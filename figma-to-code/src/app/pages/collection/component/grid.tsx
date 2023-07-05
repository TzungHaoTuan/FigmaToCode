import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  getDownloadURL,
  getMetadata,
  list,
} from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  DocumentSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/app/firebase/firebase";
import convertToTai from "@/app/utils/convertToTai";

export default function Grid() {
  const userCollection = useSelector((state: any) => state.collection.frames);
  const [collectionGrid, setCollectionGrid] = useState<any>([]);
  const [frameImages, setFrameImages] = useState<any>([]);
  const storage = getStorage();

  useEffect(() => {
    const showDocument = async () => {
      const frameElements = await getDocument();
      handleConvertToTai(frameElements);
    };

    showDocument();
  }, []);

  // console.log(userCollection);

  async function getDocument() {
    const productsSnapshot = await getDoc(doc(db, "products", "data"));
    const pagesSnapshot = await getDocs(
      collection(productsSnapshot.ref, "pages")
    );
    const frameElements: any[] = [];
    for (const pageDoc of pagesSnapshot.docs) {
      for (const eachCollection of userCollection) {
        const pageData = pageDoc.data();
        // console.log(pageData);
        if (pageData.pageName === eachCollection.page) {
          const framesSnapshot = await getDocs(
            collection(pageDoc.ref, "frames")
          );
          for (const frameDoc of framesSnapshot.docs) {
            const frameData = frameDoc.data();
            // console.log(frameData);

            if (frameData.id === eachCollection.frame) {
              console.log(frameData.storagePath);
              await getFrameImageUrl(frameData.storagePath);
              const childrenSnapshot = await getDocs(
                collection(frameDoc.ref, "children")
              );

              childrenSnapshot.docs.forEach((childDoc) => {
                const childData = childDoc.data();
                frameElements.push(childData);
                // setCollectionGrid((prev: any) => [...prev, childData]);
              });
            }
          }
        }
      }
    }
    return frameElements;
  }

  async function getFrameImageUrl(storagePath: any) {
    const storageRef = ref(storage, storagePath);

    const downloadURL = await getDownloadURL(storageRef);
    setFrameImages((prev: any) => [...prev, downloadURL]);
  }
  // while (downloadURL === null) {
  //   // List items under the storage reference
  //   const items = await list(storageRef);
  //   console.log(items);
  //   // Check if any items exist
  //   if (items && items.items.length > 0) {
  //     downloadURL = await getDownloadURL(storageRef);
  //     console.log(downloadURL);
  //     setFrameImages((prev: any) => [...prev, downloadURL]);
  //   } else {
  //     // Wait for 1 second before checking again
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  // }

  //   const items = await list(storageRef);

  //   if (items && items.items.length > 0) {
  //     const downloadURL = await getDownloadURL(storageRef);
  //     console.log(downloadURL);
  //     setFrameImages((prev: any) => [...prev, downloadURL]);
  //   } else {
  //     console.error("File does not exist:", storagePath);
  //   }
  // }

  const handleConvertToTai = async (frameElements: any) => {
    const code = await convertToTai(frameElements);

    setCollectionGrid((prev: any) => [...prev, code]);
  };

  return (
    <div>
      <div className="flex">
        <img
          src={frameImages[0]}
          className="w-1/4 hover:w-full object-cover overflow-scroll h-40 hover:h-[500px] mx-10 border-2 border-black rounded-xl"
        ></img>
        <div className="w-2/4 hover:w-full h-40 hover:h-[500px]  bg-white overflow-scroll mr-10 px-4 border-2 border-black rounded-xl">
          {collectionGrid[0]}
        </div>
      </div>
    </div>
  );
}
