"use client";

// import Prism from "prismjs";
// import "prismjs/components/prism-core";
// import "prismjs/components/prism-markup";
// import "prismjs/themes/prism-solarizedlight.css";

import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
hljs.registerLanguage("html", html);
import "highlight.js/styles/tokyo-night-dark.css";

import { Tab } from "@headlessui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTag } from "@/store/tagsSlice";

export default function divBlock() {
  const [currentStyle, setCurrentStyle] = useState(true);

  const taiRef = useRef<HTMLDivElement>(null);
  const SCTagRef = useRef<HTMLDivElement>(null);
  const SCStyleRef = useRef<HTMLDivElement>(null);

  const taiCodeRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const tags = useSelector((state: any) => state.tag.tags);
  const codeState = useSelector((state: any) => state.codeState.state);

  console.log(pages);

  const dispatch = useDispatch();

  useEffect(() => {
    if (taiRef.current && codeState) {
      hljs.highlightElement(taiRef.current);
    }
  }, [taiRef, codeState]);

  // useEffect(() => {
  //   Prism.highlightAll();
  // }, [currentStyle]);

  // color div

  // useEffect(() => {
  //   hljs.highlightAll();
  //   hljs.configure({ ignoreUnescapedHTML: true });
  // }),
  //   [];
  // useEffect(() => {
  //   if (divRef.current) {
  //     hljs.highlightElement(divRef.current);
  //   }
  // }, []);

  const newhandleTag = async (id: any, tag: any) => {
    console.log(id, tag);

    const productsRef = doc(db, "products", "data");
    const pagesRef = collection(productsRef, "pages");
    const pagesSnapshot = await getDocs(pagesRef);

    const firstPageDoc = pagesSnapshot.docs[0];
    const framesRef = collection(firstPageDoc.ref, "frames");
    const framesSnapshot = await getDocs(framesRef);

    const firstFrameDoc = framesSnapshot.docs[0];
    const childrenRef = collection(firstFrameDoc.ref, "children");
    const childrenSnapshot = await getDocs(childrenRef);

    const firstChildDoc = childrenSnapshot.docs[0];
    const childrenData = firstChildDoc.data();
    if (childrenData && childrenData.children) {
      const children = childrenData.children;
      children[1].children[0].name = tag;
      await updateDoc(firstChildDoc.ref, { children: children });
    }
  };

  const handleTag = async (id: any, tag: any) => {
    console.log(id, tag);

    const productsRef = doc(db, "products", "data");
    const pagesRef = collection(productsRef, "pages");
    const pagesSnapshot = await getDocs(pagesRef);

    await Promise.all(
      pagesSnapshot.docs.map(async (pageDoc) => {
        const framesRef = collection(pageDoc.ref, "frames");
        const framesSnapshot = await getDocs(framesRef);

        await Promise.all(
          framesSnapshot.docs.map(async (frameDoc) => {
            const childrenRef = collection(frameDoc.ref, "children");
            const childrenSnapshot = await getDocs(childrenRef);

            await Promise.all(
              childrenSnapshot.docs.map(async (childDoc) => {
                const children = childDoc.data().children;

                // children[1].children[0].name = tag;
                // const myDoc = childDoc;
                // await updateDoc(myDoc.ref, { children: children });
                children.forEach(async (child: any) => {
                  if (child.children.id === id) {
                    child.name = tag;

                    const myDoc = childDoc;
                    await updateDoc(myDoc.ref, { children: children });
                  }
                });
              })
            );
          })
        );
      })
    );
  };

  const copydiv = (ref: any) => {
    if (ref === "taiRef" && taiRef.current) {
      navigator.clipboard.writeText(taiRef.current.innerText);
    } else if (ref === "SCTagRef" && SCTagRef.current) {
      navigator.clipboard.writeText(SCTagRef.current.innerText);
    } else if (ref === "SCStyleRef" && SCStyleRef.current) {
      navigator.clipboard.writeText(SCStyleRef.current.innerText);
    }
  };

  // Tailwind
  const renderTai = (children: any) => {
    if (!children) {
      return null;
    }

    const renderedChildren = children.flatMap((child: any) => {
      if (
        child.type === "GROUP" ||
        child.type === "INSTANCE" ||
        child.type === "FRAME"
      ) {
        return renderTai(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          if (child.fills[0]?.type === "IMAGE") {
            return `<img className="w-[${
              child.absoluteBoundingBox.width
            }px] h-[${child.absoluteBoundingBox.height}px] left-[${
              child.absoluteBoundingBox.x
            }px] top-[${child.absoluteBoundingBox.y}px] ${
              child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
            } ${
              child.strokes.length !== 0
                ? `border-[${
                    child.strokeWeight
                  }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )}]/${child.strokes[0].color.a * 100}]`
                : ""
            } absolute"/>`;
          } else if (child.fills[0]?.type === "SOLID") {
            return `<div className="w-[${
              child.absoluteBoundingBox.width
            }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
              child.absoluteBoundingBox.x
            }px] mt-[${child.absoluteBoundingBox.y}px] bg-[rgb(${Math.round(
              child.fills[0].color.r * 255
            )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
              child.fills[0].color.b * 255
            )}]/${child.fills[0].color.a * 100}] ${
              child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
            } ${
              child.strokes.length !== 0
                ? `border-[${
                    child.strokeWeight
                  }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )}]/${child.strokes[0].color.a * 100}]`
                : ""
            } absolute">${child.name}</div>`;
          } else {
            return `<div className="w-[${
              child.absoluteBoundingBox.width
            }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
              child.absoluteBoundingBox.x
            }px] mt-[${child.absoluteBoundingBox.y}px] ${
              child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
            } ${
              child.strokes.length !== 0
                ? `border-[${
                    child.strokeWeight
                  }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )}]/${child.strokes[0].color.a * 100}]`
                : ""
            }absolute">${child.name}</div>`;
          }
        } else if (child.type === "ELLIPSE") {
          return `<div className="rounded-full w-[${
            child.absoluteBoundingBox.width
          }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
            child.absoluteBoundingBox.x
          }px] mt-[${child.absoluteBoundingBox.y}px] bg-[rgb(${Math.round(
            child.fills[0]?.color?.r * 255
          )},${Math.round(child.fills[0]?.color?.g * 255)},${Math.round(
            child.fills[0]?.color?.b * 255
          )}]/${child.fills[0]?.color?.a * 100}] ${
            child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
          } ${
            child.strokes.length !== 0
              ? `border-[${
                  child.strokeWeight
                }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                  child.strokes[0].color.r * 255
                )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                  child.strokes[0].color.b * 255
                )}]/${child.strokes[0].color.a * 100}]`
              : ""
          }absolute">${child.name}</div>`;
        } else if (child.type === "LINE" || child.type === "VECTOR") {
          return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
            child.absoluteBoundingBox.height
          }px] ml-[${child.absoluteBoundingBox.x}px] mt-[${
            child.absoluteBoundingBox.y
          }px] bg-[rgb(${Math.round(
            child.strokes[0]?.color.r * 255
          )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
            child.strokes[0]?.color.b * 255
          )}]/${
            child.strokes[0]?.opacity
              ? child.strokes[0]?.opacity * child.strokes[0]?.color.a * 100
              : child.strokes[0]?.color.a * 100
          }]absolute">${child.name}</div>`;
        } else if (child.type === "TEXT") {
          return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
            child.absoluteBoundingBox.height
          }px] left-[${child.absoluteBoundingBox.x}px] top-[${
            child.absoluteBoundingBox.y
          }px] font-["${child.style.fontFamily}"] ${
            child.style.italic ? "italic" : ""
          } font-[${child.style.fontWeight}] text-[${
            child.style.fontSize
          }px] leading-[${Math.round(child.style.lineHeightPx * 10) / 10}px] ${
            child.style.letterSpacing
              ? `tracking-[${
                  Math.round(child.style.letterSpacing * 10) / 10
                }px]`
              : ""
          } text-[${child.style.textAlignHorizontal.toLowerCase()}] bg-[rgb(${Math.round(
            child.fills[0].color.r * 255
          )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
            child.fills[0].color.b * 255
          )}]/${child.fills[0].color.a * 100}] absolute">${child.name}</div>`;
        }
        // return <div key={child.id}>{child.name}</div>;
      }
    });
    return renderedChildren.join("\n");
  };

  // SC Tag
  const renderTagSC = (children: any) => {
    if (!children) {
      return null;
    }

    const renderedChildren = children.flatMap((child: any) => {
      if (
        child.type === "GROUP" ||
        child.type === "INSTANCE" ||
        child.type === "FRAME"
      ) {
        return renderTagSC(child.children);
      } else {
        return (
          <div key={child.id}>
            {child.type === "TEXT" ? (
              <div className="ml-4">
                &lt;
                <code
                  contentEditable
                  dir="RTL"
                  suppressContentEditableWarning={true}
                  onBlur={(event) => {
                    dispatch(
                      setTag({ [child.id]: event.currentTarget.textContent })
                    );
                    handleTag(child.id, event.currentTarget.textContent);
                  }}
                >
                  {tags[child.id] ? tags[child.id] : child.name.slice(0, 4)}

                  {/* {child.name} */}
                </code>
                &gt;{child.characters}&lt;
                <code
                  contentEditable
                  dir="RTL"
                  suppressContentEditableWarning={true}
                  onBlur={(event) => {
                    dispatch(
                      setTag({ [child.id]: event.currentTarget.textContent })
                    );
                    handleTag(child.id, event.currentTarget.textContent);
                  }}
                >
                  {tags[child.id] ? tags[child.id] : child.name.slice(0, 4)}

                  {/* {child.name} */}
                </code>
                &gt;
              </div>
            ) : (
              <div className="ml-4">{`<${child.name.slice(
                0,
                5
              )}><${child.name.slice(0, 4)}>`}</div>
            )}
          </div>
        );
      }
    });
    return renderedChildren;
  };

  // SC Style
  const renderStyleSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (
        child.type === "GROUP" ||
        child.type === "INSTANCE" ||
        child.type === "FRAME"
      ) {
        return renderStyleSC(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          if (child.fills[0]?.type === "IMAGE") {
            return (
              <div key={child.id}>
                <div>{`const ${child.name} = styled.img\``}</div>
                <div className="ml-4">{` background-image: url("Your-image-url.jpg");`}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
              </div>
            );
          } else if (child.fills[0]?.type === "SOLID") {
            return (
              <div key={child.id}>
                <div>{`const ${child.name} = styled.div\``}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                <div className="ml-4">
                  {`backgroundColor: rgba(${Math.round(
                    child.fills[0]?.color.r * 255
                  )},
                ${Math.round(child.fills[0]?.color.g * 255)},
                ${Math.round(child.fills[0]?.color.b * 255)},
                ${
                  child.fills[0].opacity
                    ? child.fills[0].opacity * child.fills[0].color.a
                    : child.fills[0].color.a
                })`}
                </div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
              </div>
            );
          } else {
            return (
              <div key={child.id}>
                <div>{`const ${child.name} = styled.div\``}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
              </div>
            );
          }
        } else if (child.type === "ELLIPSE") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name.slice(0, 2)} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">{` border-radius: 50%;`}</div>
              <div className="ml-4">
                {` backgroundColor: rgba(${Math.round(
                  child.fills[0]?.color.r * 255
                )},
                ${Math.round(child.fills[0]?.color.g * 255)},
                ${Math.round(child.fills[0]?.color.b * 255)},
                ${
                  child.fills[0]?.opacity
                    ? child.fills[0]?.opacity * child.fills[0]?.color.a
                    : child.fills[0]?.color.a
                })`}
              </div>
              {child.strokes.length !== 0 && (
                <div className="ml-4">
                  {`border: 
                ${child.strokeWeight}px 
                ${child.strokes[0].type.toLowerCase()} 
                  rgba(
                    ${Math.round(child.strokes[0]?.color.r * 255)},
                    ${Math.round(child.strokes[0]?.color.g * 255)},
                    ${Math.round(child.strokes[0]?.color.b * 255)},
                    ${child.strokes[0].color.a})`}
                </div>
              )}
              <div>`</div>
            </div>
          );
        } else if (child.type === "LINE" || child.type === "VECTOR") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">
                {` backgroundColor: rgba(${Math.round(
                  child.strokes[0]?.color.r * 255
                )},
                ${Math.round(child.strokes[0]?.color.g * 255)},
                ${Math.round(child.strokes[0]?.color.b * 255)},
                ${
                  child.strokes[0]?.opacity
                    ? child.strokes[0]?.opacity * child.strokes[0]?.color.a
                    : child.strokes[0]?.color.a
                })`}
              </div>
              <div>`</div>
            </div>
          );
        } else if (child.type === "TEXT") {
          return (
            <div key={child.id}>
              <div>{`const ${child.name} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">{` font-family: ${child.style.fontFamily};`}</div>
              {child.style.italic && (
                <div className="ml-4">{` font-style: italic;`}</div>
              )}
              <div className="ml-4">{` font-weight: ${child.style.fontWeight};`}</div>
              <div className="ml-4">{` font-size: ${child.style.fontSize}px;`}</div>
              <div className="ml-4">{` line-height: ${
                Math.round(child.style.lineHeightPx * 10) / 10
              }px;`}</div>
              {child.style.letterSpacing !== 0 && (
                <div className="ml-4">{` letter-spacing: ${
                  Math.round(child.style.letterSpacing * 10) / 10
                }px;`}</div>
              )}
              <div className="ml-4">{` text-align: ${child.style.textAlignHorizontal.toLowerCase()};`}</div>
              <div className="ml-4">
                {` color: rgba(
                ${Math.round(child.fills[0]?.color.r * 255)},
                ${Math.round(child.fills[0]?.color.g * 255)},
                ${Math.round(child.fills[0]?.color.b * 255)},
                ${child.fills[0].color.a})`}
              </div>
              <div>`</div>
            </div>
          );
        }
        return <div key={child.id}>{child.name}</div>;
      }
    });
  };

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  let [categories] = useState({
    Tailwind: [{}],
    ["Styled Component"]: [{}],
  });

  return (
    <div className="w-1/2 h-full  flex flex-col justify-center items-center pr-12">
      {/* Tab */}
      <div className="w-full h-full">
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
                onClick={(prev: any) => setCurrentStyle(!prev)}
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-full max-h-screen h-[calc(100%-90px)] mt-2">
            <Tab.Panel
              className={classNames(
                " h-4/5  rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-8 p-3"
              )}
            >
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                  onClick={() => copydiv("taiRef")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </div>

              <pre className="w-full h-[calc(100%-64px)] overflow-auto no-scrollbar mt-4 rounded">
                <code ref={taiRef} className="language-html">
                  {codeState && pages.length !== 0
                    ? pages
                        .filter((page: any) => page.name === currentPage)[0]
                        .frames.map((frame: any) => {
                          if (frame.id === currentFrame) {
                            return renderTai(frame.children);
                          }
                        })
                    : ""}
                </code>
              </pre>
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                " h-4/5 grid grid-cols-1 divide-y rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-8 p-3"
              )}
            >
              <div className="">
                <div className="w-10 h-10 ml-auto flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                    onClick={() => copydiv("SCTagRef")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                </div>

                <pre className="w-full h-[100px] overflow-auto no-scrollbar mt-4 rounded">
                  <code ref={SCTagRef} className="language-html text-slate-100">
                    {codeState && pages.length !== 0
                      ? pages
                          .filter((page: any) => page.name === currentPage)[0]
                          .frames.map((frame: any) => {
                            if (frame.id === currentFrame) {
                              return renderTagSC(frame.children);
                            }
                          })
                      : ""}
                  </code>
                </pre>
              </div>

              <div className="h-full pt-4">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                    onClick={() => copydiv("SCStyleRef")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                </div>
                <pre className="w-[calc(100%-32px)] h-[120px] overflow-auto no-scrollbar whitespace-nowrap mt-4 ml-4 rounded">
                  <code
                    ref={SCStyleRef}
                    className="language-html text-slate-100"
                  >
                    {codeState && pages.length !== 0
                      ? pages
                          .filter((page: any) => page.name === currentPage)[0]
                          .frames.map((frame: any) => {
                            if (frame.id === currentFrame) {
                              return renderStyleSC(frame.children);
                            }
                          })
                      : ""}
                  </code>
                </pre>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* <div className="flex">
        <button
          onClick={(e) => {
            setCurrentStyle("Tailwind");
          }}
          className=" px-10 border-2 border-black rounded-xl"
        >
          Tailwind
        </button>
        <button
          onClick={() => setCurrentStyle("SC")}
          className=" px-10 border-2 border-black rounded-xl"
        >
          Styled Component
        </button>
      </div> */}

      {/* Tailwind */}
      {/* {currentStyle === "Tailwind" && (
        <div className="w-full border-2 border-black rounded-xl">
          <button
            onClick={() => copydiv("taiRef")}
            className="w-4 h-4 ml-96 mt-4 border-2 border-black rounded-xl"
          ></button>
          <div ref={taiRef} className="w-full h-60 overflow-scroll ">
            {pages.length !== 0 &&
              pages
                .filter((page: any) => page.name === currentPage)[0]
                .frames.map((frame: any) => {
                  if (frame.id === currentFrame) {
                    return renderTai(frame.children);
                  }
                })}
          </div>
        </div>
      )} */}
      {/* SC */}

      {/* {currentStyle === "SC" && pages.length !== 0 && (
        <div className="flex">
          <div className=" px-4 w-1/2 border-2 border-black rounded-xl">
            <button
              onClick={() => copydiv("SCTagRef")}
              className="w-4 h-4  border-2 border-black rounded-xl"
            ></button>
            <div ref={SCTagRef} className=" h-60 overflow-scroll ">
              <div>&lt;div&gt;</div>
              {pages
                .filter((page: any) => page.name === currentPage)[0]
                .frames.map((frame: any) => {
                  if (frame.id === currentFrame) {
                    return renderTagSC(frame.children);
                  }
                })}
              <div>&lt;/div&gt;</div>
            </div>
          </div>
          <div className=" px-4 w-1/2 border-2 border-black rounded-xl">
            <button
              onClick={() => copydiv("SCStyleRef")}
              className="w-4 h-4  mt-4 border-2 border-black rounded-xl"
            ></button>
            <div ref={SCStyleRef} className=" h-60 overflow-scroll ">
              {pages
                .filter((page: any) => page.name === currentPage)[0]
                .frames.map((frame: any) => {
                  if (frame.id === currentFrame) {
                    return renderStyleSC(frame.children);
                  }
                })}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
