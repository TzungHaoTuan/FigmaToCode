import React, { useState, useEffect, useRef } from "react";
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
import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";

export default function Grid() {
  const userCollection = useSelector((state: any) => state.collection.frames);
  const [collectionGrid, setCollectionGrid] = useState<any>([]);
  const [frameImages, setFrameImages] = useState<any>([]);
  const storage = getStorage();

  const codeRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [codeRef, collectionGrid]);

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
                const childData = childDoc.data().children;
                frameElements.push(childData);
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
    // console.log(taiCode);
    const SCCode = await ConvertToSCTag(frameElements);
    // sc: SCCode
    setCollectionGrid((prev: any) => {
      // Check if taiCode already exists in collectionGrid
      const taiCodeExists = prev.some((item: any) => item.tai === taiCode);

      // If taiCode exists, return the previous state without any changes
      if (taiCodeExists) {
        return prev;
      }

      // Add taiCode to the collectionGrid
      const updatedGrid = [...prev, { tai: taiCode, sc: SCCode }];
      return updatedGrid;
    });
  };

  return (
    <div
      className="relative w-screen h-screen"
      // onClick={() => console.log(collectionGrid)}
    >
      <div className="w-full h-full bg-color-ball-2  py-48  px-24">
        <div className="relative w-full h-84 bg-white/30 bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110 p-4">
          <div className="w-full h-80  flex justify-between   bg-slate-900/20 bg-opacity-50 rounded-3xl  px-2 py-2 ">
            <img
              src={frameImages[0]}
              className="w-64 h-full bg-white/50 object-cover overflow-scroll rounded-3xl  "
            ></img>
            <div className="w-[calc(100%-280px)]  h-full  bg-white/30 no-scrollbar overflow-scroll rounded-3xl    ">
              <pre className="w-full h-1/2 overflow-scroll no-scrollbar whitespace-nowrap bg-slate-900 text-white rounded-xl p-4">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                </div>
                {collectionGrid.map((item: any, index: any) => (
                  <code className="">{item.sc}</code>
                ))}
              </pre>
              <pre className="w-full h-1/2 overflow-scroll no-scrollbar whitespace-nowrap bg-slate-900 text-white rounded-xl p-4">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                </div>
                {collectionGrid.map((item: any, index: any) => (
                  <code>
                    {`<div className="w-[318px] h-[14px] left-[561px] top-[16px] font-["Poppins"]  font-[300] text-[16px] leading-[14px] tracking-[1px] text-[left] bg-[rgb(26,26,26]/100] absolute">Rated 4.8-stars across 20k+ reviews</div>`}
                    <br></br>{" "}
                    {`<div className="w-[140px] h-[41px] left-[60px] top-[74.5px] font-["Montserrat Alternates"]  font-[700] text-[42px] leading-[51.2px]  text-[center] bg-[rgb(26,26,26]/100] absolute">SoSo</div>`}
                    <br></br>{" "}
                    {`<div className="w-[86px] h-[24px] left-[389px] top-[83px] font-["Abel"]  font-[400] text-[18px] leading-[24px] tracking-[0.5px] text-[center] bg-[rgb(26,26,26]/100] absolute">Daily health</div>`}
                    <br></br>{" "}
                    {`<div className="w-[86px] h-[24px] left-[539px] top-[83px] font-["Abel"]  font-[400] text-[18px] leading-[24px] tracking-[0.5px] text-[center] bg-[rgb(26,26,26]/100] absolute">Weight loss</div>`}
                    <br></br>{" "}
                    {`<div className="w-[31px] h-[24px] left-[683px] top-[83px] font-["Abel"]  font-[400] text-[18px] leading-[24px] tracking-[0.5px] text-[center] bg-[rgb(26,26,26]/100] absolute">Skin</div>`}
                    <br></br>{" "}
                    {`<div className="w-[29px] h-[24px] left-[768px] top-[83px] font-["Abel"]  font-[400] text-[18px] leading-[24px] tracking-[0.5px] text-[center] bg-[rgb(26,26,26]/100] absolute">Hair</div>`}
                    <br></br>{" "}
                    {`<div className="w-[40px] h-[24px] left-[851px] top-[83px] font-["Abel"]  font-[400] text-[18px] leading-[24px] tracking-[0.5px] text-[center] bg-[rgb(26,26,26]/100] absolute">Blogs</div>`}
                    <br></br>{" "}
                    {`<div className="rounded-full w-[48px] h-[48px] ml-[1037px] mt-[71px] bg-[rgb(255,255,255]/100]  absolute">Ellipse 19</div>`}
                    {/* {item.tai
                      .split(">")
                      .map(
                        (line: string, lineIndex: number, lines: string[]) => (
                          <div key={lineIndex}>
                            {lineIndex !== lines.length - 1 ? line + ">" : line}
                          </div>
                        )
                      )} */}
                  </code>
                ))}
              </pre>
            </div>
          </div>

          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
