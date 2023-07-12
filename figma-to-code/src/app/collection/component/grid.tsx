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
import convertToSCTag from "@/app/utils/convertToSC";

export default function Grid() {
  const userCollection = useSelector((state: any) => state.collection.frames);
  const [collectionGrid, setCollectionGrid] = useState<any>([]);
  const [frameImages, setFrameImages] = useState<any>([]);
  const storage = getStorage();

  useEffect(() => {
    const showDocument = async () => {
      const frameElements = await getDocument();
      handleConvertCode(frameElements);
    };

    showDocument();
  }, [db]);

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
              // await getFrameImageUrl(frameData.storagePath);
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

  const handleConvertCode = async (frameElements: any) => {
    const taiCode = await convertToTai(frameElements);
    const SCCode = await convertToSCTag(frameElements);

    setCollectionGrid((prev: any) => [...prev, { tai: taiCode, sc: SCCode }]);
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="w-full h-full bg-color-ball-2  py-48  px-24">
        <div className="relative w-full h-full bg-white bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110 p-4">
          <div className="w-full h-40  flex justify-between items-center  bg-slate-900 bg-opacity-50 rounded-3xl  px-2 py-2 ">
            <img
              src={frameImages[0]}
              className="w-36 h-36 bg-white object-cover overflow-scroll rounded-3xl  "
            ></img>
            <div className="w-[calc(100%-152px)]  h-36  bg-white no-scrollbar overflow-scroll rounded-3xl  px-4  ">
              {collectionGrid[0]?.tai}
            </div>
          </div>
          {/* <div className="w-2/4  h-40  bg-white overflow-scroll mr-10 px-4 border-2 border-black rounded-xl">
          {collectionGrid[0]?.sc}
        </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
