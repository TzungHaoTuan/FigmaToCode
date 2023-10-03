"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { setCollection } from "@/store/collectionSlice";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "../app/firebase/firebase";
// import { app } from "@/app/firebase/firebase";

import { setCollect } from "@/store/collectSlice";
import { setCollected } from "@/store/collectSlice";
import {
  Frame,
  Pages,
  Page,
  CurrentPage,
  CurrentFrame,
  frameImages,
  Images,
  Image,
  IsConverting,
  Tag,
  Element,
  State,
  User,
  FigmaData,
} from "@/types";

export default function Collect() {
  const data = useSelector((state: State) => state.figmaData.data);
  const currentPage = useSelector(
    (state: CurrentPage) => state.currentPage.page
  );
  const currentFrame = useSelector(
    (state: CurrentFrame) => state.currentFrame.frame
  );
  const frameImages = useSelector(
    (state: frameImages) => state.frameImages.images
  );
  const tags = useSelector((state: Tag) => state.tag.tags);
  const isCollecting = useSelector(
    (state: State) => state.collect.isCollecting
  );

  const dispatch = useDispatch();
  const storage = getStorage();

  // const auth = getAuth(app);

  const user = useSelector((state: State) => state.user);
  const isLogin = user?.profile.login;
  const uid = user?.profile.uid;
  const userName = user?.profile.name;

  const handleCollection = () => {
    if (isLogin && data) {
      dispatch(setCollect());
      frameImages
        .filter((image: Image) => image.id === currentFrame?.id)
        .map((image: Image) =>
          uploadImage(
            image.id,
            "https://corsproxy.io/?" + encodeURIComponent(image.url)
          )
        );
    }
  };

  const uploadImage = async (imageId: string, imageUrl: string) => {
    try {
      const imageBlob = await compressImage(imageUrl);
      const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
      await uploadBytes(storageRef, imageBlob as Blob)
        // Store the path in Firestore
        .then(async (snapshot) => {
          await addDocument(snapshot, uid, userName, data, currentFrame, tags);
        });
    } catch (error) {
      console.error("Failed to compress image:", error);
      throw error;
    }
  };

  const compressImage = async (imageUrl: string) => {
    // const blob = await fetch(imageUrl).then((response) => response.blob());
    // return blob;
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    return imageBlob;
  };

  interface Snapshot {
    ref: {
      fullPath: string;
    };
  }

  const addDocument = async (
    snapshot: Snapshot,
    uid: string,
    userName: string,
    data: FigmaData,
    currentFrame: { id: string; name: string },
    tags: Record<string, string>
  ) => {
    const storagePath = snapshot.ref.fullPath;

    const usersRef = doc(db, "users", uid);
    await setDoc(usersRef, {
      name: userName,
    });

    const collectionRef = collection(usersRef, "collection");
    const collectionDocRef = doc(collectionRef, data.name);
    await setDoc(collectionDocRef, {
      project: data.name,
    });

    const pagesRef = collection(collectionDocRef, "pages");
    const pagesPromises = data.document.children.map(async (page: Page) => {
      const pageRef = doc(pagesRef, page.name);
      await setDoc(pageRef, { pageName: page.name });

      const framesRef = collection(pageRef, "frames");
      const framesPromises = page.children.map(async (frame: Frame) => {
        const frameRef = doc(framesRef, frame.name);

        const frameDocSnapshot = await getDoc(frameRef);
        const frameData = frameDocSnapshot.data() as Record<string, unknown>; // Replace with the actual type if available

        const updatedFrameData = {
          ...frameData,
          id: frame.id,
          ...(frame.id === currentFrame.id
            ? { collected: true, storagePath }
            : {}),
        };
        await setDoc(frameRef, updatedFrameData);

        const childrenRef = collection(frameRef, "children");
        const childrenPromises = frame.children.map((element: Element) =>
          setDoc(doc(childrenRef, element.name), element)
        );

        return Promise.all(childrenPromises);
      });

      return Promise.all(framesPromises);
    });

    await Promise.all(pagesPromises);

    dispatch(setCollect());
    dispatch(setCollected(true));

    if (Object.keys(tags).length !== 0) {
      await handleTag();
    }
  };

  const handleTag = async () => {
    // Assuming you know the user ID, collection ID, page ID, and frame ID
    const frameRef = doc(
      db,
      "users",
      uid,
      "collection",
      data.name,
      "pages",
      currentPage,
      "frames",
      currentFrame.name
    );
    const childrenRef = collection(frameRef, "children");
    const childrenSnapshot = await getDocs(childrenRef);

    const childrenPromises = childrenSnapshot.docs.map((childDoc) =>
      updateChildren(childDoc, tags)
    );

    await Promise.all(childrenPromises);
  };

  async function updateChildren(
    childDoc: QueryDocumentSnapshot<DocumentData>,
    tags: Record<string, string>
  ) {
    const docData = childDoc.data();
    const [updatedData, dataUpdated] = await updateChildRecursive(
      docData,
      tags
    );
    if (dataUpdated) {
      await updateDoc(childDoc.ref, updatedData);
    }
  }

  async function updateChildRecursive(
    docData: DocumentData,
    tags: Record<string, string>
  ) {
    // Clone the document data
    let clonedData = { ...docData };

    // Flag to check if an update has been made
    let updated = false;

    // Base case: if the object has an 'id' field and that id exists in tags
    if (clonedData.id && tags[clonedData.id]) {
      // Update the name
      clonedData.name = tags[clonedData.id];
      updated = true;
    }

    // Recursive case: if the property 'children' is an array, recurse on each child object
    if (Array.isArray(clonedData.children)) {
      for (let i = 0; i < clonedData.children.length; i++) {
        const child = clonedData.children[i];
        if (typeof child === "object") {
          // Get the updated child
          const [updatedChild, childUpdated] = await updateChildRecursive(
            child,
            tags
          );
          // If the child was updated, replace it in the children array
          if (childUpdated) {
            clonedData.children[i] = updatedChild;
            updated = true;
          }
        }
      }
    }
    return [clonedData, updated];
  }

  return (
    <div className="w-full flex justify-center items-center">
      <button
        onClick={handleCollection}
        className={`w-full h-12 flex justify-center items-center
        ${
          isCollecting
            ? " text-pink-500 bg-slate-100"
            : " text-slate-100 bg-indigo-600 hover:text-indigo-600  hover:bg-slate-100"
        }
          
          text-xl font-bold  rounded-xl px-4`}
      >
        {isCollecting ? (
          <div className="relative w-6 h-6 animate-spin rounded-full bg-gradient-to-r from-indigo-600  to-pink-500 ">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-100 rounded-full border-2 border-white"></div>
          </div>
        ) : (
          ""
        )}
        <div className={` ml-4 `}>
          {isCollecting ? "Collecting..." : "Add to collection"}
        </div>
      </button>
    </div>
  );
}
