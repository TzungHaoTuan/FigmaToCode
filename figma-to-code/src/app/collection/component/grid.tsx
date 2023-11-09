"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { collection, doc, getDocs, query, where } from "firebase/firestore";

import { db } from "@/app/firebase/firebase";
import { Tab } from "@headlessui/react";

import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
import HighLight from "@/components/highLight";

import { State, Element, CollectionFrames, ConvertedFrames } from "@/types";

const Grid: React.FC = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [styleCopied, setStyleCopied] = useState<string>("");
  const [collectedFrames, setCollectedFrames] = useState<ConvertedFrames>({});

  const taiRef = useRef<HTMLDivElement>(null);
  const scTagRef = useRef<HTMLDivElement>(null);
  const scStyleRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const storage = getStorage();

  const user = useSelector((state: State) => state.user);
  const isLogin = user?.profile.login;
  const uid = user?.profile.uid;

  const userCollection: CollectionFrames = useSelector(
    (state: State) => state.collection.frames
  );

  // useEffect(() => {
  //   if (!isLogin) return;
  //   const showDocument = async () => {
  //     // const documents = await getDocuments(uid);
  //     if (userCollection) {
  //       const convertedFrames = await handleConvertCode(userCollection);
  //       setCollectedFrames(convertedFrames);
  //     }
  //   };
  //   showDocument();
  // }, [userCollection]);

  // const handleConvertCode = async (collectedFrames: CollectionFrames) => {
  //   const convertedFrames: ConvertedFrames = {};

  //   for (const frameId in collectedFrames) {
  //     if (
  //       collectedFrames.hasOwnProperty(frameId) &&
  //       Array.isArray(collectedFrames[frameId].children)
  //     ) {
  //       const children = collectedFrames[frameId].children;
  //       convertedFrames[frameId] = {
  //         imageUrl: null,
  //         tailwind: ConvertToTai(children),
  //         styledComponentsTag: ConvertToSCTag(children),
  //         styledComponentsStyle: ConvertToSCStyle(children),
  //       };

  //       const imagePath = collectedFrames[frameId].imagePath;
  //       if (imagePath) {
  //         try {
  //           const imageUrl = await getDownloadURL(ref(storage, imagePath));
  //           setCollectedFrames((prevFrames) => ({
  //             ...prevFrames,
  //             [frameId]: { ...prevFrames[frameId], imageUrl },
  //           }));
  //         } catch (error) {
  //           console.error("Error retrieving download URL:", error);
  //         }
  //       }
  //     }
  //   }

  //   return convertedFrames;
  // };

  const handleConvertCode = (
    collectedFrames: CollectionFrames
  ): ConvertedFrames => {
    const convertedFrames: ConvertedFrames = {};
    for (const frameId in collectedFrames) {
      if (collectedFrames.hasOwnProperty(frameId)) {
        const children = collectedFrames[frameId].children;
        convertedFrames[frameId] = {
          imageUrl: null,
          tailwind: ConvertToTai(children),
          styledComponentsTag: ConvertToSCTag(children),
          styledComponentsStyle: ConvertToSCStyle(children),
        };
      }
    }
    return convertedFrames;
  };

  const updateImageUrls = async (collectedFrames: CollectionFrames) => {
    const imagePromises = Object.entries(collectedFrames).map(
      async ([frameId, frameData]) => {
        if (frameData.imagePath) {
          try {
            const imageUrl = await getDownloadURL(
              ref(storage, frameData.imagePath)
            );
            return { frameId, imageUrl };
          } catch (error) {
            console.error("Error retrieving download URL:", error);
            return { frameId, imageUrl: null };
          }
        }
        return { frameId, imageUrl: null };
      }
    );

    const images = await Promise.all(imagePromises);
    setCollectedFrames((prevFrames) => {
      const newFrames = { ...prevFrames };
      images.forEach(({ frameId, imageUrl }) => {
        if (newFrames[frameId]) {
          newFrames[frameId].imageUrl = imageUrl;
        }
      });
      return newFrames;
    });
  };

  useEffect(() => {
    if (userCollection) {
      const initialFrames = handleConvertCode(userCollection);
      setCollectedFrames(initialFrames);
      updateImageUrls(userCollection);
    }
  }, [userCollection]);

  const handleCopied = (style: string) => {
    setIsCopied((prevState) => !prevState);
    setStyleCopied(style);
    setTimeout(() => {
      setIsCopied(false);
      setStyleCopied("");
    }, 1000);

    switch (style) {
      case "taiRef":
        {
          taiRef.current &&
            navigator.clipboard.writeText(taiRef.current.innerText);
        }
        break;
      case "scTagRef":
        {
          scTagRef.current &&
            navigator.clipboard.writeText(scTagRef.current.innerText);
        }
        break;
      case "scStyleRef":
        {
          scStyleRef.current &&
            navigator.clipboard.writeText(scStyleRef.current.innerText);
        }
        break;
    }
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  let [categories] = useState({
    Tailwind: [{}],
    ["Styled Component"]: [{}],
  });

  return (
    <div className="">
      <div className="">
        {Object.entries(collectedFrames).map(([frameId, frameData]) => (
          <div key={frameId} className="h-80 flex rounded-3xl mb-10">
            {frameData.imageUrl ? (
              <Image
                src={frameData.imageUrl}
                alt="Frame"
                width={320}
                height={320}
                // layout="responsive"
                className="object-cover	rounded-xl border-2 border-purple-300"
              />
            ) : (
              <div className="w-80 h-full flex justify-center items-center rounded-xl bg-slate-800">
                <svg
                  className="w-20 h-20 fill-slate-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            )}

            {/* <img
                src={frameData?.imageUrl}
                className="w-60 h-full bg-white/50 object-cover overflow-scroll rounded-3xl  "
              ></img> */}
            {/* {frameData.imageUrl ? (
                <img src={frameData.imageUrl} alt="Frame" />
              ) : (
                <div>loading image...</div>
              )} */}

            <div className="w-[calc(100%-320px)] h-full rounded-3xl ml-4">
              <Tab.Group>
                <Tab.List className="h-16 flex space-x-1 rounded-xl bg-indigo-900/60">
                  {Object.keys(categories).map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-md font-bold tracking-wide leading-5  ",
                          "ring-pink ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-1",
                          selected
                            ? "bg-gradient-to-r from-pink-400/80 to-violet-600  text-slate-900"
                            : "text-slate-100/80   hover:text-pink hover:shadow-[0_0px_20px_0px_rgba(0,0,0,1)] hover:shadow-slate-100"
                        )
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="w-full h-[calc(100%-80px)] rounded-xl mt-4">
                  <Tab.Panel
                    className={classNames(
                      "h-full rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] border-2 border-purple-300 my-2 p-4 relative"
                    )}
                  >
                    {isCopied && styleCopied === "taiRef" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
              border-pink-600 stroke-pink-600 rounded p-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                        onClick={() => handleCopied("taiRef")}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                        />
                      </svg>
                    )}
                    {frameData ? (
                      <div
                        ref={taiRef}
                        className="w-full h-full overflow-auto no-scrollbar rounded"
                      >
                        <HighLight frameChildren={frameData.tailwind} />
                      </div>
                    ) : null}
                  </Tab.Panel>
                  <Tab.Panel
                    className={classNames(
                      "h-full divide-x flex rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-2"
                    )}
                  >
                    <div className="w-1/2 h-full p-4 relative">
                      {isCopied && styleCopied === "scTagRef" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
              border-pink-600 stroke-pink-600 rounded p-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                          onClick={() => handleCopied("scTagRef")}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                          />
                        </svg>
                      )}
                      {frameData ? (
                        <div
                          ref={taiRef}
                          className="w-full h-full  overflow-auto no-scrollbar rounded"
                        >
                          <HighLight
                            frameChildren={frameData.styledComponentsTag}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="w-1/2 h-full relative p-4">
                      {isCopied && styleCopied === "scStyleRef" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
              border-pink-600 stroke-pink-600 rounded p-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="absolute top-6 right-6 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                          onClick={() => handleCopied("scStyleRef")}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                          />
                        </svg>
                      )}
                      {frameData ? (
                        <div
                          ref={taiRef}
                          className="w-full h-full  overflow-auto no-scrollbar rounded"
                        >
                          <HighLight
                            frameChildren={frameData.styledComponentsStyle}
                          />
                        </div>
                      ) : null}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        ))}
      </div>
    </div>
    // <div>
    //   {Object.entries(collectedFrames).map(([frameId, frameData]) => (
    //     <div key={frameId}>
    //       {/* Show placeholder or spinner until imageUrl is available */}
    //       {frameData.imageUrl ? (
    //         // <img
    //         //   src={frameData?.imageUrl}
    //         //   className="w-60 h-full bg-white/50 object-cover overflow-scroll rounded-3xl  "
    //         // ></img>
    //         <Image
    //           src={frameData.imageUrl}
    //           alt="Frame"
    //           width={240}
    //           height={240}
    //           // layout="responsive"
    //         />
    //       ) : (
    //         <div>Loading image...</div>
    //       )}
    //     </div>
    //   ))}
    // </div>
  );
};
export default Grid;
