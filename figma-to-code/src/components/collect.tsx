"use client";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCollection } from "@/store/collectionSlice";

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
} from "firebase/firestore";

import { db } from "../app/firebase/firebase";

export default function Collect() {
  const data = useSelector((state: any) => state.figmaData.data);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const userCollection = useSelector((state: any) => state.collection.frames);
  const frameImages = useSelector((state: any) => state.frameImages.images);
  const dispatch = useDispatch();
  const storage = getStorage();

  const handleCollection = async () => {
    await frameImages
      .filter((image: any) => image.id === currentFrame)
      .map((image: any) =>
        uploadImage(
          image.id,
          "https://corsproxy.io/?" + encodeURIComponent(image.url)
        )
      );
    await handleCollectionState();
    await addDocument();
  };

  const handleCollectionState = async () => {
    dispatch(setCollection([{ page: currentPage, frame: currentFrame }]));
  };

  const addDocument = async () => {
    const productsRef = doc(db, "products", "data");

    // Create the main document
    await setDoc(productsRef, {
      name: data.name,
    });

    // Create the "pages" subcollection and inside
    console.log("start writing data");
    const pagesRef = collection(productsRef, "pages");
    const pagesPromises = data.document.children.map(async (page: any) => {
      await setDoc(doc(pagesRef, page.name), { pageName: page.name });

      const pageRef = doc(pagesRef, page.name);
      const framesRef = collection(pageRef, "frames");
      const framesPromises = page.children.map(async (frame: any) => {
        await setDoc(doc(framesRef, frame.name), { id: frame.id });

        const frameRef = doc(framesRef, frame.name);
        const childrenRef = collection(frameRef, "children");
        const childrenPromises = frame.children.map((child: any) => {
          return setDoc(doc(childrenRef, child.name), child);
        });

        return Promise.all(childrenPromises);
      });
      console.log("Store children successfully!");

      return Promise.all(framesPromises);
    });
    console.log("Store frames successfully!");
    await Promise.all(pagesPromises);
    console.log("Store pages successfully!");
    console.log("Finish writing data");

    // await data.document.children.map(async (page: any) => {
    //   setDoc(doc(pagesRef, page.name), { pageName: page.name });

    //   const pagesSnapshot = await getDocs(pagesRef);
    //   pagesSnapshot.forEach(async (pageDoc) => {
    //     const framesRef = collection(pageDoc.ref, "frames");
    //     await page.children.map(async (frame: any) => {
    //       setDoc(doc(framesRef, frame.name), { id: frame.id });

    //       const framesSnapshot = await getDocs(framesRef);
    //       framesSnapshot.forEach(async (frameDoc) => {
    //         const childrenRef = collection(frameDoc.ref, "children");
    //         await frame.children.map((child: any) => {
    //           setDoc(doc(childrenRef, child.name), child);
    //         });
    //       });
    //     });
    //   });
    // });
  };

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

  async function uploadImage(imageId: any, imageUrl: any) {
    try {
      const blob = await loadImageAsBlob(imageUrl);
      const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
      await uploadBytes(storageRef, blob as Blob)
        // Store the path in Firestore
        .then(async (snapshot) => {
          await storeImagePath(imageId, snapshot);
          console.log("Successful upload the Blob!");
          // await storeImagePath(imageId, snapshot);
        });
    } catch (error) {
      console.error("Failed to compress image:", error);
      throw error;
    }
  }

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

  async function storeImagePath(imageId: any, snapshot: any) {
    const storagePath = snapshot.ref.fullPath;

    const productsRef = doc(db, "products", "data");
    const pagesRef = collection(productsRef, "pages");
    const pagesSnapshot = await getDocs(pagesRef);
    pagesSnapshot.forEach(async (pageDoc) => {
      const framesRef = collection(pageDoc.ref, "frames");
      const framesSnapshot = await getDocs(framesRef);
      framesSnapshot.forEach(async (frameDoc) => {
        if (frameDoc.data().id === imageId) {
          await updateDoc(frameDoc.ref, { storagePath });
        }
      });
    });
  }

  return (
    <div>
      <button
        onClick={handleCollection}
        className="border-2 border-black rounded-xl text-black px-4"
      >
        Add to collection
      </button>
    </div>
  );
}
