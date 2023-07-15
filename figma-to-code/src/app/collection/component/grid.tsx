import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { Tab } from "@headlessui/react";
import { setCodeStyle } from "@/store/codeStateSlice";

import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";

export default function Grid() {
  const [collectionGrid, setCollectionGrid] = useState<any>([]);
  const [frameImages, setFrameImages] = useState<any>([]);

  const codeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const storage = getStorage();

  const codeState = useSelector((state: any) => state.codeState.state);
  const codeStyle = useSelector((state: any) => state.codeState.style);
  const userCollection = useSelector((state: any) => state.collection.frames);

  useEffect(() => {
    handleCodeStyle("Tailwind");
  }, []);

  useEffect(() => {
    const showDocument = async () => {
      const frameElements = await getDocument();
      await handleConvertCode(frameElements);
    };
    showDocument();
  }, [db]);

  useEffect(() => {
    if (collectionGrid.length !== 0) {
      hljs.highlightAll();
    }
  }, [codeState, codeStyle, collectionGrid]);

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
                const childData = childDoc.data().children;
                frameElements.unshift(childData);
                console.log(childData);
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
    // console.log(downloadURL);
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
    const taiCode = await ConvertToTai(frameElements);
    const scTag = await ConvertToSCTag(frameElements);
    const scStyle = await ConvertToSCStyle(frameElements);

    setCollectionGrid((prev: any) => {
      // Check if taiCode already exists in collectionGrid
      const codeExists = prev.some((item: any) => item.tai === taiCode);

      // If taiCode exists, return the previous state without any changes
      if (codeExists) {
        return prev;
      }

      // Add taiCode to the collectionGrid
      const updatedGrid = [
        ...prev,
        { tai: taiCode, scTag: scTag, scStyle: scStyle },
      ];
      return updatedGrid;
    });
  };

  const handleCodeStyle = (style: any) => {
    dispatch(setCodeStyle(style));
  };

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }
  let [categories] = useState({
    Tailwind: [{}],
    ["Styled Component"]: [{}],
  });

  return (
    <div
      className="relative w-screen h-screen bg-color-ball-2  py-48  px-24"
      // onClick={() => console.log(collectionGrid)}
    >
      <div className="relative w-full h-84 bg-white/30 bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110 p-4">
        {/* each collection */}
        <div className="w-full h-64  flex justify-between   bg-slate-900 bg-opacity-50 rounded-3xl  px-2 py-2 ">
          <img
            src={frameImages[0]}
            className="w-60 h-full bg-white/50 object-cover overflow-scroll rounded-3xl  "
          ></img>
          <div className="w-[calc(100%-256px)] h-full ml-4">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 text-sm font-bold tracking-wide leading-5  ",
                        "ring-pink ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-1",
                        selected
                          ? "bg-gradient-to-r from-pink-400/80 to-violet-600  text-slate-900"
                          : "text-violet-600   hover:text-pink hover:shadow-[0_0px_20px_0px_rgba(0,0,0,1)] hover:shadow-violet-600"
                      )
                    }
                    onClick={() => handleCodeStyle(category)}
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="w-full h-[calc(100%-20px)]">
                <Tab.Panel
                  className={classNames(
                    "h-5/6 rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-2 p-4 relative"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute right-8 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                    // onClick={() => copydiv("SCTagRef")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>

                  <pre className="w-full h-full  overflow-auto no-scrollbar rounded">
                    <code ref={codeRef} className="language-html no-scrollbar">
                      {collectionGrid.map((collection: any) => collection.tai)}
                    </code>
                  </pre>
                </Tab.Panel>
                <Tab.Panel
                  className={classNames(
                    "h-5/6 divide-x flex rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-2"
                  )}
                >
                  <div className="w-1/2 h-full p-4 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute right-8 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                      // onClick={() => copydiv("SCTagRef")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                    <pre className="w-full h-full  overflow-auto no-scrollbar rounded">
                      <code
                        ref={codeRef}
                        className="language-html no-scrollbar"
                      >
                        {collectionGrid.map(
                          (collection: any) => collection.scTag
                        )}
                      </code>
                    </pre>
                  </div>

                  <div className="w-1/2 h-full relative p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute right-8 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                      // onClick={() => copydiv("SCTagRef")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                    <pre className="w-full h-full	overflow-auto no-scrollbar rounded">
                      <code
                        ref={codeRef}
                        className="language-html no-scrollbar"
                      >
                        {collectionGrid.map(
                          (collection: any) => collection.scStyle
                        )}
                      </code>
                    </pre>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
