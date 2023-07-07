"use client";

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
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTag } from "@/store/tagsSlice";

export default function CodeBlock() {
  const [currentStyle, setCurrentStyle] = useState("Tailwind");

  const taiRef = useRef<HTMLDivElement>(null);
  const SCTagRef = useRef<HTMLDivElement>(null);
  const SCStyleRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const tags = useSelector((state: any) => state.tag.tags);

  const dispatch = useDispatch();

  // const handleTag = async (id: any, tag: any) => {
  //   console.log(id, tag);

  //   const productsRef = doc(db, "products", "data");
  //   const pagesRef = collection(productsRef, "pages");
  //   const pagesSnapshot = await getDocs(pagesRef);

  //   await Promise.all(
  //     pagesSnapshot.docs.map(async (pageDoc) => {
  //       const framesRef = collection(pageDoc.ref, "frames");
  //       const framesSnapshot = await getDocs(framesRef);

  //       await Promise.all(
  //         framesSnapshot.docs.map(async (frameDoc) => {
  //           const childrenRef = collection(frameDoc.ref, "children");
  //           const childrenSnapshot = await getDocs(childrenRef);

  //           await Promise.all(
  //             childrenSnapshot.docs.map(async (childDoc) => {
  //               const children = childDoc.data().children;

  //               children.forEach(async (child: any) => {
  //                 if (child.id === id) {
  //                   child.name = tag;

  //                   const myDoc = childDoc;
  //                   await updateDoc(myDoc.ref, { children: children });
  //                 }
  //               });
  //             })
  //           );
  //         })
  //       );
  //     })
  //   );
  // };

  const copyCode = (ref: any) => {
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

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderTai(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          if (child.fills[0]?.type === "IMAGE") {
            return (
              <div key={child.id}>
                <div>
                  {`<img src="Your image path!"
                  className="
            absolute 
            w-[${child.absoluteBoundingBox.width}px] 
            h-[${child.absoluteBoundingBox.height}px] 
            ml-[${child.absoluteBoundingBox.x}px] 
            mt-[${child.absoluteBoundingBox.y}px] 
            ${child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""} 
            ${
              child.strokes.length !== 0
                ? `border-[${child.strokeWeight}px] 
              border-${child.strokes[0].type.toLowerCase()}
              border-[rgb(${Math.round(
                child.strokes[0].color.r * 255
              )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )}]/${child.strokes[0].color.a * 100}]
              `
                : ""
            }" />`}
                </div>
                <br></br>
              </div>
            );
          } else if (child.fills[0]?.type === "SOLID") {
            return (
              <div key={child.id}>
                <div>
                  {`<div className="
            absolute 
            w-[${child.absoluteBoundingBox.width}px] 
            h-[${child.absoluteBoundingBox.height}px] 
            ml-[${child.absoluteBoundingBox.x}px] 
            mt-[${child.absoluteBoundingBox.y}px] 
            bg-[rgb(${Math.round(child.fills[0].color.r * 255)},${Math.round(
                    child.fills[0].color.g * 255
                  )},${Math.round(child.fills[0].color.b * 255)}]/${
                    child.fills[0].color.a * 100
                  }] 
            ${child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""}
            ${
              child.strokes.length !== 0
                ? `border-[${child.strokeWeight}px] 
              border-${child.strokes[0].type.toLowerCase()}
              border-[rgb(${Math.round(
                child.strokes[0].color.r * 255
              )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )}]/${child.strokes[0].color.a * 100}]
              `
                : ""
            }">${child.name}
            </div>`}
                </div>
                <br></br>
              </div>
            );
          } else {
            return (
              <div key={child.id}>
                <div>
                  {`<div className="
                  absolute 
                  w-[${child.absoluteBoundingBox.width}px] 
                  h-[${child.absoluteBoundingBox.height}px] 
                  ml-[${child.absoluteBoundingBox.x}px] 
                  mt-[${child.absoluteBoundingBox.y}px] 
                  ${
                    child.cornerRadius
                      ? `rounded-[${child.cornerRadius}px]`
                      : ""
                  }
                  ${
                    child.strokes.length !== 0
                      ? `border-[${child.strokeWeight}px] 
                    border-${child.strokes[0].type.toLowerCase()}
                    border-[rgb(${Math.round(
                      child.strokes[0].color.r * 255
                    )},${Math.round(
                          child.strokes[0].color.g * 255
                        )},${Math.round(child.strokes[0].color.b * 255)}]/${
                          child.strokes[0].color.a * 100
                        }]
                    `
                      : ""
                  }">${child.name}</div>`}
                </div>
                <br></br>
              </div>
            );
          }
        } else if (child.type === "ELLIPSE") {
          return (
            <div key={child.id}>
              <div>
                {`<div className="
          absolute 
          rounded-full 
          w-[${child.absoluteBoundingBox.width}px] 
          h-[${child.absoluteBoundingBox.height}px] 
          ml-[${child.absoluteBoundingBox.x}px] 
          mt-[${child.absoluteBoundingBox.y}px] 
          bg-[rgb(${Math.round(child.fills[0]?.color.r * 255)},${Math.round(
                  child.fills[0]?.color.g * 255
                )},${Math.round(child.fills[0]?.color.b * 255)}]/${
                  child.fills[0]?.color.a * 100
                }] 
                ${child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""}
                ${
                  child.strokes.length !== 0
                    ? `border-[${child.strokeWeight}px] 
                  border-${child.strokes[0].type.toLowerCase()}
                  border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                        child.strokes[0].color.b * 255
                      )}]/${child.strokes[0].color.a * 100}]
                  `
                    : ""
                }">${child.name}</div>`}
              </div>
              <br></br>
            </div>
          );
        } else if (child.type === "LINE") {
          return (
            <div key={child.id}>
              <div>
                {`<div className="
          absolute 
          w-[${child.absoluteBoundingBox.width}px] 
          h-[${child.absoluteBoundingBox.height}px] 
          ml-[${child.absoluteBoundingBox.x}px] 
          mt-[${child.absoluteBoundingBox.y}px] 
          bg-[rgb(${Math.round(child.strokes[0]?.color.r * 255)},${Math.round(
                  child.strokes[0]?.color.g * 255
                )},${Math.round(child.strokes[0]?.color.b * 255)}]/${
                  child.strokes[0].opacity
                    ? child.strokes[0].opacity * child.strokes[0].color.a * 100
                    : child.strokes[0].color.a * 100
                }]">${child.name}</div>`}
              </div>
              <br></br>
            </div>
          );
        } else if (child.type === "TEXT") {
          return (
            <div key={child.id}>
              <div>
                {`<div className="
            absolute 
            w-[${child.absoluteBoundingBox.width}px] 
            h-[${child.absoluteBoundingBox.height}px] 
            ml-[${child.absoluteBoundingBox.x}px] 
            mt-[${child.absoluteBoundingBox.y}px] 
            font-["${child.style.fontFamily}"] 
            ${child.style.italic ? "italic" : ""} 
            font-[${child.style.fontWeight}] 
            text-[${child.style.fontSize}px] 
            leading-[${Math.round(child.style.lineHeightPx * 10) / 10}px]
            ${
              child.style.letterSpacing
                ? `tracking-[${
                    Math.round(child.style.letterSpacing * 10) / 10
                  }px]`
                : ""
            }
            text-[${child.style.textAlignHorizontal.toLowerCase()}] 
            bg-[rgb(${Math.round(child.fills[0].color.r * 255)},${Math.round(
                  child.fills[0].color.g * 255
                )},${Math.round(child.fills[0].color.b * 255)}]/${
                  child.fills[0].color.a * 100
                }]">${child.name}</div>`}
              </div>
              <br></br>
            </div>
          );
        }
        return <div key={child.id}>{child.name}</div>;
      }
    });
  };

  // SC Tag
  const renderTagSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderTagSC(child.children);
      } else {
        return (
          <div key={child.id}>
            {child.type === "TEXT" ? (
              <div className="ml-4">
                &lt;
                <span
                  contentEditable
                  dir="RTL"
                  suppressContentEditableWarning={true}
                  onBlur={(event) => {
                    dispatch(
                      setTag({ [child.id]: event.currentTarget.textContent })
                    );
                    console.log(tags);
                  }}
                >
                  {/* {tags[child.id] ? tags[child.id] : ""} */}
                  {tags[child.id] ? tags[child.id] : child.name}

                  {/* {child.name} */}
                </span>
                &gt;{child.characters}&lt;
                <span
                  contentEditable
                  suppressContentEditableWarning={true}
                  // onInput={(event) =>
                  //   handleTag(child.id, event.currentTarget.innerText)
                  // }
                >
                  {tags[child.id] ? tags[child.id] : child.name}
                </span>
                &gt;
              </div>
            ) : (
              <div className="ml-4">{`<${child.name}><${child.name}>`}</div>
            )}
          </div>
        );
      }
    });
  };

  // SC Style
  const renderStyleSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
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
              <br></br>
            </div>
          );
        } else if (child.type === "LINE") {
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
              <br></br>
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
              <br></br>
            </div>
          );
        }
        return <div key={child.id}>{child.name}</div>;
      }
    });
  };

  return (
    <div>
      <div className="flex">
        <button
          onClick={(e) => {
            setCurrentStyle("Tailwind");
          }}
          className="mx-10 px-10 border-2 border-black rounded-xl"
        >
          Tailwind
        </button>
        <button
          onClick={() => setCurrentStyle("SC")}
          className="mx-10 px-10 border-2 border-black rounded-xl"
        >
          Styled Component
        </button>
      </div>

      {/* Tailwind */}
      {currentStyle === "Tailwind" && (
        <div className="mx-10 mb-10 px-4 border-2 border-black rounded-xl">
          <button
            onClick={() => copyCode("taiRef")}
            className="w-4 h-4 ml-96 mt-4 border-2 border-black rounded-xl"
          ></button>
          <div ref={taiRef} className="h-60 overflow-scroll ">
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
      )}
      {/* SC */}

      {currentStyle === "SC" && pages.length !== 0 && (
        <div className="flex">
          <div className=" px-4 w-1/2 border-2 border-black rounded-xl">
            <button
              onClick={() => copyCode("SCTagRef")}
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
              onClick={() => copyCode("SCStyleRef")}
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
      )}
    </div>
  );
}
