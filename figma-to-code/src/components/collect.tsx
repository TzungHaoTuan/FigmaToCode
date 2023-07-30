"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCollection } from "@/store/collectionSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
} from "firebase/firestore";

import { db } from "../app/firebase/firebase";
import { app } from "@/app/firebase/firebase";

import { setCollect } from "@/store/collectSlice";
import { setCollected } from "@/store/collectSlice";

export default function Collect() {
  const data = useSelector((state: any) => state.figmaData.data);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const frameImages = useSelector((state: any) => state.frameImages.images);
  const tags = useSelector((state: any) => state.tag.tags);
  const isCollecting = useSelector((state: any) => state.collect.isCollecting);

  const dispatch = useDispatch();
  const storage = getStorage();

  const auth = getAuth(app);
  const user = useSelector((state: any) => state.user);
  const isLogin = user?.profile.login;
  const uid = user?.profile.uid;
  const userName = user?.profile.name;

  // useEffect(() => {
  //   user.profile.uid ? console.log(user.profile.uid) : console.log("Not login");
  //   // onAuthStateChanged(auth, (user: any) => {
  //   //   if (user) {
  //   //     // 已登入
  //   //     console.log(user);
  //   //     const uid = user.uid;
  //   //     console.log(uid);
  //   //   } else {
  //   //     console.log("未登入");
  //   //   }
  //   // });
  // }, [isLogin]);
  // const uid = onAuthStateChanged(auth, (user: any) => user.id);

  const handleCollection = async () => {
    if (isLogin && data) {
      dispatch(setCollect());

      await frameImages
        .filter((image: any) => image.id === currentFrame?.id)
        .map((image: any) =>
          uploadImage(
            image.id,
            "https://corsproxy.io/?" + encodeURIComponent(image.url)
          )
        );
      // await handleCollectionState();
    }
  };

  // const handleCollectionState = async () => {
  //   dispatch(
  //     setCollection([
  //       { name: data.name, page: currentPage, frame: currentFrame },
  //     ])
  //   );
  // };

  const addDocument = async (imageId: any, snapshot: any) => {
    console.log("start writing data");
    const storagePath = snapshot.ref.fullPath;

    const usersRef = doc(db, "users", uid);
    await setDoc(usersRef, {
      name: userName,
    });

    const collectionRef = collection(usersRef, "collection");
    const collectionDocRef = doc(collectionRef, data.name);
    await setDoc(doc(collectionRef, data.name), {
      project: data.name,
    });

    // Create the "pages" subcollection and inside
    const pagesRef = collection(collectionDocRef, "pages");
    const pagesPromises = data.document.children.map(async (page: any) => {
      await setDoc(doc(pagesRef, page.name), { pageName: page.name });

      const pageRef = doc(pagesRef, page.name);
      const framesRef = collection(pageRef, "frames");
      const framesPromises = page.children.map(async (frame: any) => {
        // await setDoc(doc(framesRef, frame.name), { id: frame.id });

        const frameDocRef = doc(framesRef, frame.name);
        const frameDocSnapshot = await getDoc(frameDocRef);
        const frameData = frameDocSnapshot.data();

        if (frame.id === currentFrame.id) {
          await setDoc(frameDocRef, {
            ...frameData,
            id: frame.id,
            collected: true,
            storagePath: storagePath,
          });
        } else {
          await setDoc(frameDocRef, {
            ...frameData,
            id: frame.id,
          });
        }

        const frameRef = doc(framesRef, frame.name);
        const childrenRef = collection(frameRef, "children");
        const childrenPromises = frame.children.map((child: any) => {
          return setDoc(doc(childrenRef, child.name), child);
        });

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

    console.log("Finish writing data");
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

  async function updateChildRecursive(
    docData: DocumentData,
    tags: { [x: string]: any }
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

  async function updateChildren(childDoc: any, tags: any) {
    const docData = childDoc.data();
    const [updatedData, dataUpdated] = await updateChildRecursive(
      docData,
      tags
    );
    if (dataUpdated) {
      await updateDoc(childDoc.ref, updatedData);
    }
  }

  async function uploadImage(imageId: any, imageUrl: any) {
    try {
      const blob = await loadImageAsBlob(imageUrl);
      const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
      await uploadBytes(storageRef, blob as Blob)
        // Store the path in Firestore
        .then(async (snapshot) => {
          await addDocument(imageId, snapshot);
          console.log("Successful upload the Blob!");
          // await storeImagePath(imageId, snapshot);
        });
    } catch (error) {
      console.error("Failed to compress image:", error);
      throw error;
    }
  }

  function loadImageAsBlob(imageUrl: any) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", imageUrl, true);
      xhr.responseType = "blob";

      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response;
          resolve(blob);
        } else {
          reject(
            new Error(
              `Failed to fetch image (${xhr.status}): ${xhr.statusText}`
            )
          );
        }
      };

      xhr.onerror = function () {
        reject(new Error("Failed to fetch image"));
      };

      xhr.send();
    });
  }

  // async function storeImagePath(imageId: any, snapshot: any) {
  //   const storagePath = snapshot.ref.fullPath;

  //   const productsRef = doc(db, "products", "data");
  //   const pagesRef = collection(productsRef, "pages");
  //   const pagesSnapshot = await getDocs(pagesRef);
  //   pagesSnapshot.forEach(async (pageDoc) => {
  //     const framesRef = collection(pageDoc.ref, "frames");
  //     const framesSnapshot = await getDocs(framesRef);
  //     framesSnapshot.forEach(async (frameDoc) => {
  //       if (frameDoc.data().id === imageId) {
  //         await updateDoc(frameDoc.ref, { storagePath });
  //       }
  //     });
  //   });
  // }

  // async function compressImage(imageUrl: any) {
  //   const blob = await fetch(imageUrl).then((response) => response.blob());
  //   return blob;
  // }
  // async function uploadImage(imageId: any, imageUrl: any) {
  //   // Compress the image
  //   const blob = await compressImage(imageUrl);

  //   // Upload the image
  //   const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
  //   uploadBytes(storageRef, blob)
  //     // Store the path in Firestore
  //     .then(async (snapshot) => {
  //       // await storeImagePath(imageId, snapshot);
  //     });
  // }

  return (
    <div
      className="w-full flex justify-center items-center mt-[56px]"
      onClick={() => console.log([data.name, currentPage, currentFrame])}
    >
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
