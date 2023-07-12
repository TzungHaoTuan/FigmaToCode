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

import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
hljs.registerLanguage("html", html);
import "highlight.js/styles/tokyo-night-dark.css";

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
      console.log(frameElements);
      handleConvertCode(frameElements);
    };

    showDocument();
    // console.log(userCollection);
    // console.log(collectionGrid);
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
              // console.log(frameData.storagePath);
              await getFrameImageUrl(frameData.storagePath);
              const childrenSnapshot = await getDocs(
                collection(frameDoc.ref, "children")
              );

              childrenSnapshot.docs.forEach((childDoc) => {
                const childData = childDoc.data();
                frameElements.push(childData.children);
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
    console.log(downloadURL);
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
    console.log(taiCode);
    // const SCCode = await convertToSCTag(frameElements);
    // sc: SCCode
    if (taiCode) {
      setCollectionGrid((prev: any) => [...prev, { tai: taiCode }]);
    }
  };

  return (
    <div
      className="relative w-screen h-screen"
      // onClick={() => console.log(collectionGrid)}
    >
      <div className="w-full h-full bg-color-ball-2  py-48  px-24">
        <div className="relative w-full h-full bg-white/30 bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110 p-4">
          <div className="w-full h-40  flex justify-between items-center  bg-slate-900/20 bg-opacity-50 rounded-3xl  px-2 py-2 ">
            <img
              src={frameImages[0]}
              className="w-36 h-36 bg-white/50 object-cover overflow-scroll rounded-3xl  "
            ></img>

            <pre className="w-[calc(100%-152px)]  h-36  bg-white/30 no-scrollbar overflow-scroll rounded-3xl  px-4  ">
              {collectionGrid.map((item: any, index: any) => (
                <code
                  key={index}
                  className="language-html no-scrollbar overflow-auto whitespace-nowrap rounded-3xl  px-4"
                >
                  {item.tai}
                </code>
              ))}{" "}
            </pre>
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
