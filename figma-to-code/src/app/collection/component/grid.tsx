import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { collection, doc, getDocs, query, where } from "firebase/firestore";

import { db } from "@/app/firebase/firebase";
import { Tab } from "@headlessui/react";

import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
import HighLight from "@/components/highLight";

import { State, Element } from "@/types";

interface CollectionFrames {
  [frameId: string]: { imagePath: string; children: Element[] };
}
interface ConvertedFrames {
  [frameId: string]: {
    imageUrl: string;
    tailwind: string | null;
    styledComponentsTag: string | null;
    styledComponentsStyle: string | null;
  };
}

export default function Grid() {
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

  useEffect(() => {
    if (isLogin) {
      const showDocument = async () => {
        const documents = await getDocuments(uid);
        const convertedFrames = await handleConvertCode(documents);
        setCollectedFrames(convertedFrames);
      };
      showDocument();
    }
  }, [db]);

  async function getDocuments(uid: string) {
    const collectionFrames: CollectionFrames = {};

    const userRef = doc(db, "users", uid);
    const collectionsSnapshot = await getDocs(
      collection(userRef, "collection")
    );

    for (const collectionDoc of collectionsSnapshot.docs) {
      const pagesSnapshot = await getDocs(
        collection(collectionDoc.ref, "pages")
      );

      for (const pageDoc of pagesSnapshot.docs) {
        const framesQuery = query(
          collection(pageDoc.ref, "frames"),
          where("collected", "==", true)
        );
        const framesSnapshot = await getDocs(framesQuery);

        for (const frameDoc of framesSnapshot.docs) {
          const frameData = frameDoc.data();

          const childrenSnapshot = await getDocs(
            collection(frameDoc.ref, "children")
          );
          const childDocData: Element[] = childrenSnapshot.docs.map(
            (childDoc) => childDoc.data() as Element
          );
          collectionFrames[frameData.id] = {
            imagePath: frameData.storagePath,
            children: childDocData,
          };
        }
      }
    }
    return collectionFrames;
  }

  const handleConvertCode = async (collectedFrames: CollectionFrames) => {
    const convertedFrames: ConvertedFrames = {};
    if (collectedFrames) {
      for (const frameId in collectedFrames) {
        if (
          collectedFrames.hasOwnProperty(frameId) &&
          Array.isArray(collectedFrames[frameId].children)
        ) {
          const imagePath = collectedFrames[frameId].imagePath;
          const children = collectedFrames[frameId].children;
          if (imagePath) {
            try {
              const imageUrl = await getDownloadURL(ref(storage, imagePath));
              convertedFrames[frameId] = {
                imageUrl: imageUrl,
                tailwind: ConvertToTai(children),
                styledComponentsTag: ConvertToSCTag(children),
                styledComponentsStyle: ConvertToSCStyle(children),
              };
            } catch (error) {
              console.error("Error retrieving download URL:", error);
            }
          }
        }
      }
    }
    return convertedFrames;
  };
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
    <div className="relative w-screen min-h-screen bg-color-ball-2 py-48 px-24">
      <div className="relative w-full h-84 bg-slate-900 bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110 p-4">
        {/* each collection */}
        {Object.keys(collectedFrames).length !== 0 ? (
          Object.entries(collectedFrames).map(([frameId, item]) => (
            <div
              key={frameId}
              className="w-full h-64  flex justify-between   bg-slate-900 bg-opacity-30 rounded-3xl mb-2 px-2 py-2 "
            >
              <img
                src={item?.imageUrl}
                className="w-60 h-full bg-white/50 object-cover overflow-scroll rounded-3xl  "
              ></img>
              <div className="w-[calc(100%-256px)] h-full ml-4">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/60 p-1">
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
                  <Tab.Panels className="w-full h-[calc(100%-20px)]">
                    <Tab.Panel
                      className={classNames(
                        "h-5/6 rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-2 p-4 relative"
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
                      {item ? (
                        <div
                          ref={taiRef}
                          className="w-full h-full  overflow-auto no-scrollbar rounded"
                        >
                          <HighLight frameChildren={item.tailwind} />
                        </div>
                      ) : null}
                    </Tab.Panel>
                    <Tab.Panel
                      className={classNames(
                        "h-5/6 divide-x flex rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-2"
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
                        {item ? (
                          <div
                            ref={taiRef}
                            className="w-full h-full  overflow-auto no-scrollbar rounded"
                          >
                            <HighLight
                              frameChildren={item.styledComponentsTag}
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
                        {item ? (
                          <div
                            ref={taiRef}
                            className="w-full h-full  overflow-auto no-scrollbar rounded"
                          >
                            <HighLight
                              frameChildren={item.styledComponentsStyle}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          ))
        ) : (
          <div className="animate-pulse">
            <div className="w-full h-64  flex justify-between   bg-slate-900 bg-opacity-10 rounded-3xl mb-2 px-2 py-2">
              <div className="w-60 h-full flex justify-center items-center bg-white/20 rounded-3xl  ">
                <div className="opacity-20"></div>
              </div>
              <div className="w-[calc(100%-256px)] h-full flex justify-center items-center bg-white/20 rounded-3xl  ml-4 ">
                <div className="opacity-20"></div>
              </div>
            </div>
            <div className="w-full h-64  flex justify-between   bg-slate-900 bg-opacity-10 rounded-3xl mb-2 px-2 py-2">
              <div className="w-60 h-full flex justify-center items-center bg-white/20 rounded-3xl  ">
                <div className="opacity-20"></div>
              </div>
              <div className="w-[calc(100%-256px)] h-full flex justify-center items-center bg-white/20 rounded-3xl  ml-4 ">
                <div className="opacity-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
