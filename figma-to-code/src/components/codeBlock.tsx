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
import { setCodeStyle } from "@/store/codeStateSlice";

import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
import ConvertToSCTagEdit from "@/app/utils/convertToSCTagEdit";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage";

export default function CodeBlock() {
  // const [currentStyle, setCurrentStyle] = useState(true);
  const [code, setCode] = useState<any>();
  const [isCopied, setIsCopied] = useState<any>(false);
  const taiRef = useRef<HTMLDivElement>(null);
  const scTagRef = useRef<HTMLDivElement>(null);
  const scStyleRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const tags = useSelector((state: any) => state.tag.tags);
  const codeState = useSelector((state: any) => state.codeState.state);
  const codeStyle = useSelector((state: any) => state.codeState.style);
  const codeIsToggle = useSelector((state: any) => state.codeState.isToggle);

  const dispatch = useDispatch();

  useEffect(() => {
    handleCodeStyle("Tailwind");
  }, []);

  useEffect(() => {
    hljs.highlightAll();
    // hljs.highlightElement(taiRef.current);
  }, [code, codeState, codeStyle, codeIsToggle, currentPage, currentFrame]);

  const codeTailwind = useRef("");
  useEffect(() => {
    // console.log(pages);
    // console.log(codeTailwind);
    // console.log(currentPage);
    // console.log(currentFrame);

    // if (pages.length !== 0) {
    //   const codeRaw = pages
    //     .filter((page: any) => page.name === currentPage)[0]
    //     .frames.filter((frame: any) => frame.id === currentFrame); // array of one frame object

    //   codeTailwind = codeRaw[0]?.name;
    // }
    if (pages.length !== 0) {
      let codeRaw;
      if (currentPage && currentFrame) {
        codeRaw = pages
          .filter((page: any) => page.name === currentPage)[0]
          .frames.filter(
            (frame: any) => frame.id === currentFrame
          )[0]?.children;
        setCode(codeRaw); // array of elements object
      }
    }
  }, [pages, currentPage, currentFrame]);
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
  const handleCodeStyle = (style: any) => {
    dispatch(setCodeStyle(style));
  };

  const newhandleTag = async (id: any, tag: any) => {
    // console.log(id, tag);

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
    // console.log(id, tag);

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
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);

    if (ref === "taiRef" && taiRef.current) {
      navigator.clipboard.writeText(taiRef.current.innerText);
    } else if (ref === "scTagRef" && scTagRef.current) {
      navigator.clipboard.writeText(scTagRef.current.innerText);
    } else if (ref === "scStyleRef" && scStyleRef.current) {
      navigator.clipboard.writeText(scStyleRef.current.innerText);
    }
  };

  //
  const filterPagesToFrame = (pages: any) => {
    const page = pages?.filter((page: any) => page.name === currentPage)[0];
    const frame = page?.frames.filter(
      (frame: any) => frame.id === currentFrame
    );
    // console.log(frame.name);
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
                      setTag({
                        id: child.id,
                        tag: event.currentTarget.textContent,
                      })
                    );

                    console.log(child.id, event.currentTarget.textContent);
                    // handleTag(child.id, event.currentTarget.textContent);
                  }}
                >
                  {tags[child.id] ? tags[child.id] : child.name}

                  {/* {child.name} */}
                </code>
                &gt;{child.characters}&lt;
                <code
                  contentEditable
                  dir="RTL"
                  suppressContentEditableWarning={true}
                  onBlur={(event) => {
                    dispatch(
                      setTag({
                        id: child.id,
                        tag: event.currentTarget.textContent,
                      })
                    );

                    // handleTag(child.id, event.currentTarget.textContent);
                  }}
                >
                  {tags[child.id] ? tags[child.id] : child.name}

                  {/* {child.name} */}
                </code>
                &gt;
              </div>
            ) : (
              <div className="ml-4">{`<${child.name}><${child.name}>`}</div>
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
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name} = styled.div\``}</div>
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

  const convertToSCTagEdit = (children: any) => {
    if (!children) {
      return null;
    }

    const renderedChildren = children.flatMap((child: any) => {
      if (
        child.type === "GROUP" ||
        child.type === "INSTANCE" ||
        child.type === "FRAME"
      ) {
        return convertToSCTagEdit(child.children);
      } else {
        if (child.type === "TEXT") {
          return (
            <div
              key={child.id}
              className="text-[#F7768E]"
              onClick={() => console.log(child.id)}
            >
              &lt;
              <code
                className="nohighlight text-[#bb9af7]"
                contentEditable
                dir="RTL"
                suppressContentEditableWarning={true}
                onBlur={(event) => {
                  dispatch(
                    setTag({ [child.id]: event.currentTarget.textContent })
                  );
                }}
              >
                {tags[child.id] ? tags[child.id] : child.name}
              </code>
              &gt;
              <span className="text-[#9AA5CE]">{child.characters}</span>
              &lt;/
              <code
                className="nohighlight text-[#bb9af7]"
                contentEditable
                dir="RTL"
                suppressContentEditableWarning={true}
                onBlur={(event) => {
                  dispatch(
                    setTag({ [child.id]: event.currentTarget.textContent })
                  );
                }}
              >
                {tags[child.id] ? tags[child.id] : child.name}
              </code>
              &gt;
            </div>
          );
        } else {
          return (
            <div key={child.id} className="text-[#F7768E]">
              &lt;
              <code
                className="nohighlight text-[#bb9af7]"
                contentEditable
                dir="RTL"
                suppressContentEditableWarning={true}
                onBlur={(event) => {
                  dispatch(
                    setTag({
                      id: child.id,
                      tag: event.currentTarget.textContent,
                    })
                  );
                }}
              >
                {tags[child.id] ? tags[child.id] : child.name}
              </code>
              &gt;&lt;/
              <code
                className="nohighlight text-[#bb9af7]"
                contentEditable
                dir="RTL"
                suppressContentEditableWarning={true}
                onBlur={(event) => {
                  dispatch(
                    setTag({
                      id: child.id,
                      tag: event.currentTarget.textContent,
                    })
                  );
                }}
              >
                {tags[child.id] ? tags[child.id] : child.name}
              </code>
              &gt;
            </div>
          );
        }
      }
    });

    return renderedChildren;
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
      className="w-1/2 h-full  flex flex-col justify-center items-center pr-12"
      onClick={() => console.log(tags)}
    >
      {/* Tab */}
      <div className="w-full h-full">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "w-full  h-12 rounded-lg py-2.5 text-lg font-extrabold tracking-wide leading-5  ",
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
          <Tab.Panels className="w-full max-h-screen h-[calc(100%-90px)] mt-3">
            <Tab.Panel
              className={classNames(
                " h-5/6   rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-8  p-4 pt-8"
              )}
            >
              {isCopied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
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
                  className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                  onClick={() => copydiv("taiRef")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              )}

              <pre className="w-full h-[calc(100%-16px)]  overflow-auto no-scrollbar rounded">
                <code ref={taiRef} className="language-html no-scrollbar">
                  {ConvertToTai(code)}
                </code>
              </pre>
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                " h-5/6  divide-y rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 my-8  py-4"
              )}
            >
              <div className="w-full h-1/2">
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
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
                    className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                    onClick={() => copydiv("scTagRef")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                )}
                <pre className="w-full h-[calc(100%-16px)]  overflow-auto no-scrollbar rounded whitespace-nowrap pl-4">
                  <code className="nohighlight">
                    {convertToSCTagEdit(code)}
                  </code>
                </pre>
              </div>
              {/* <code contentEditable className="nohighlight text-[#bb9af7]">
                    &lt;test&gt;
                  </code> */}
              <div
                className="w-full h-1/2 pt-4"
                onClick={() => console.log(tags)}
              >
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 border-[1px]
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
                    className="absolute right-16 bg-slate-900 cursor-pointer w-10 h-10 stroke-white ml-auto border-[1px] border-white
                 hover:border-pink-600 hover:stroke-pink-600 rounded p-2"
                    onClick={() => copydiv("scStyleRef")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                )}
                <pre className="w-full h-full	overflow-auto no-scrollbar rounded">
                  <code ref={scStyleRef} className="language-html no-scrollbar">
                    {ConvertToSCStyle(code)}
                  </code>
                </pre>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
