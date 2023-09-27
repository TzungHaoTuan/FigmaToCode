"use client";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
hljs.registerLanguage("html", html);
import "highlight.js/styles/tokyo-night-dark.css";

import { Tab } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTag } from "@/store/tagsSlice";
import { setCodeStyle } from "@/store/codeStateSlice";
// import { setCodeToggle } from "@/store/codeStateSlice";

import HighLight from "./highLight";
import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
// import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage";
import CodeSkeleton from "./codeSkeleton";
import {
  Frame,
  Pages,
  Page,
  CurrentPage,
  CurrentFrame,
  Element,
  ElementType,
  Tag,
  CodeStatus,
} from "@/types";

interface FrameChildren {
  tailwind: string | null;
  styledComponentsTag: Element[];
  styledComponentsStyle: string | null;
}

export default function CodeBlock(): JSX.Element {
  // const [currentStyle, setCurrentStyle] = useState(true);
  const [frameChildren, setFrameChildren] = useState<FrameChildren>();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [styleCopied, setStyleCopied] = useState<string>("");

  const taiRef = useRef<HTMLDivElement>(null);
  const scTagRef = useRef<HTMLDivElement>(null);
  const scStyleRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: Pages) => state.pages.pages);
  const currentPage = useSelector(
    (state: CurrentPage) => state.currentPage.page
  );
  const currentFrame = useSelector(
    (state: CurrentFrame) => state.currentFrame.frame.name
  );
  const tags = useSelector((state: Tag) => state.tag.tags);
  const dispatch = useDispatch();

  // const codeState = useSelector((state: CodeStatus) => state.codeState.state);
  // const codeStyle = useSelector((state: CodeStatus) => state.codeState.style);
  // const codeIsToggle = useSelector(
  //   (state: CodeStatus) => state.codeState.isToggle
  // );
  // const isCoverting = useSelector((state: any) => state.convert.isConverting);

  // useEffect(() => {
  //   handleCodeStyle("Tailwind");
  // }, []);
  // useEffect(
  //   () => {
  //     hljs.highlightAll();

  //     // hljs.highlightElement(taiRef.current);
  //   },
  //   [
  //     // frameChildren,
  //     // codeToggling,
  //     // codeState,
  //     // codeStyle,
  //     // codeIsToggle,
  //     // currentPage,
  //     // currentFrame,
  //   ]
  // );
  // useEffect(() => {
  //   if (testRef.current) {
  //     // Remove the highlighted code elements added by highlight.js
  //     Array.from(testRef.current.children).forEach(child => {
  //       testRef.current?.removeChild(child);
  //     });

  //     // Re-add the original code as a text node
  //     testRef.current.appendChild(document.createTextNode(code));

  //     // Re-apply syntax highlighting
  //     hljs.highlightBlock(codeRef.current);
  //     hljs.highlightElement(testRef.current);
  //   }
  // }, [frameChildren]);
  useEffect(() => {
    if (pages.length === 0) {
      return;
    }
    let frameChildren;
    const selectedPage = pages.filter(
      (page: Page) => page.name === currentPage
    )[0];
    const selectedFrame = selectedPage.children.filter(
      (frame: Frame) => frame.name === currentFrame
    )[0];
    if (selectedFrame) {
      frameChildren = selectedFrame.children;
      if (frameChildren.length !== 0) {
        const tailwind = ConvertToTai(frameChildren);
        const styledComponentsTag = frameChildren;
        const styledComponentsStyle = ConvertToSCStyle(frameChildren);
        setFrameChildren({
          tailwind: tailwind,
          styledComponentsTag: styledComponentsTag,
          styledComponentsStyle: styledComponentsStyle,
        });
      }
    }
  }, [pages, currentPage, currentFrame]);

  // const handleCodeStyle = (style: string) => {
  //   dispatch(setCodeStyle(style));
  // };

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

  // Tailwind
  // const renderTai = (children: any) => {
  //   if (!children) {
  //     return null;
  //   }

  //   const renderedChildren = children.flatMap((child: any) => {
  //     if (
  //       child.type === "GROUP" ||
  //       child.type === "INSTANCE" ||
  //       child.type === "FRAME"
  //     ) {
  //       return renderTai(child.children);
  //     } else {
  //       if (child.type === "RECTANGLE") {
  //         if (child.fills[0]?.type === "IMAGE") {
  //           return `<img className="w-[${
  //             child.absoluteBoundingBox.width
  //           }px] h-[${child.absoluteBoundingBox.height}px] left-[${
  //             child.absoluteBoundingBox.x
  //           }px] top-[${child.absoluteBoundingBox.y}px] ${
  //             child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
  //           } ${
  //             child.strokes.length !== 0
  //               ? `border-[${
  //                   child.strokeWeight
  //                 }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
  //                   child.strokes[0].color.r * 255
  //                 )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
  //                   child.strokes[0].color.b * 255
  //                 )}]/${child.strokes[0].color.a * 100}]`
  //               : ""
  //           } absolute"/>`;
  //         } else if (child.fills[0]?.type === "SOLID") {
  //           return `<div className="w-[${
  //             child.absoluteBoundingBox.width
  //           }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
  //             child.absoluteBoundingBox.x
  //           }px] mt-[${child.absoluteBoundingBox.y}px] bg-[rgb(${Math.round(
  //             child.fills[0].color.r * 255
  //           )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
  //             child.fills[0].color.b * 255
  //           )}]/${child.fills[0].color.a * 100}] ${
  //             child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
  //           } ${
  //             child.strokes.length !== 0
  //               ? `border-[${
  //                   child.strokeWeight
  //                 }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
  //                   child.strokes[0].color.r * 255
  //                 )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
  //                   child.strokes[0].color.b * 255
  //                 )}]/${child.strokes[0].color.a * 100}]`
  //               : ""
  //           } absolute">${child.name}</div>`;
  //         } else {
  //           return `<div className="w-[${
  //             child.absoluteBoundingBox.width
  //           }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
  //             child.absoluteBoundingBox.x
  //           }px] mt-[${child.absoluteBoundingBox.y}px] ${
  //             child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
  //           } ${
  //             child.strokes.length !== 0
  //               ? `border-[${
  //                   child.strokeWeight
  //                 }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
  //                   child.strokes[0].color.r * 255
  //                 )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
  //                   child.strokes[0].color.b * 255
  //                 )}]/${child.strokes[0].color.a * 100}]`
  //               : ""
  //           }absolute">${child.name}</div>`;
  //         }
  //       } else if (child.type === "ELLIPSE") {
  //         return `<div className="rounded-full w-[${
  //           child.absoluteBoundingBox.width
  //         }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
  //           child.absoluteBoundingBox.x
  //         }px] mt-[${child.absoluteBoundingBox.y}px] bg-[rgb(${Math.round(
  //           child.fills[0]?.color?.r * 255
  //         )},${Math.round(child.fills[0]?.color?.g * 255)},${Math.round(
  //           child.fills[0]?.color?.b * 255
  //         )}]/${child.fills[0]?.color?.a * 100}] ${
  //           child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
  //         } ${
  //           child.strokes.length !== 0
  //             ? `border-[${
  //                 child.strokeWeight
  //               }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
  //                 child.strokes[0].color.r * 255
  //               )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
  //                 child.strokes[0].color.b * 255
  //               )}]/${child.strokes[0].color.a * 100}]`
  //             : ""
  //         }absolute">${child.name}</div>`;
  //       } else if (child.type === "LINE" || child.type === "VECTOR") {
  //         return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
  //           child.absoluteBoundingBox.height
  //         }px] ml-[${child.absoluteBoundingBox.x}px] mt-[${
  //           child.absoluteBoundingBox.y
  //         }px] bg-[rgb(${Math.round(
  //           child.strokes[0]?.color.r * 255
  //         )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
  //           child.strokes[0]?.color.b * 255
  //         )}]/${
  //           child.strokes[0]?.opacity
  //             ? child.strokes[0]?.opacity * child.strokes[0]?.color.a * 100
  //             : child.strokes[0]?.color.a * 100
  //         }]absolute">${child.name}</div>`;
  //       } else if (child.type === "TEXT") {
  //         return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
  //           child.absoluteBoundingBox.height
  //         }px] left-[${child.absoluteBoundingBox.x}px] top-[${
  //           child.absoluteBoundingBox.y
  //         }px] font-["${child.style.fontFamily}"] ${
  //           child.style.italic ? "italic" : ""
  //         } font-[${child.style.fontWeight}] text-[${
  //           child.style.fontSize
  //         }px] leading-[${Math.round(child.style.lineHeightPx * 10) / 10}px] ${
  //           child.style.letterSpacing
  //             ? `tracking-[${
  //                 Math.round(child.style.letterSpacing * 10) / 10
  //               }px]`
  //             : ""
  //         } text-[${child.style.textAlignHorizontal.toLowerCase()}] bg-[rgb(${Math.round(
  //           child.fills[0].color.r * 255
  //         )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
  //           child.fills[0].color.b * 255
  //         )}]/${child.fills[0].color.a * 100}] absolute">${child.name}</div>`;
  //       }
  //       // return <div key={child.id}>{child.name}</div>;
  //     }
  //   });
  //   return renderedChildren.join("\n");
  // };

  // SC Tag
  // const renderTagSC = (children: any) => {
  //   if (!children) {
  //     return null;
  //   }

  //   const renderedChildren = children.flatMap((child: any) => {
  //     if (
  //       child.type === "GROUP" ||
  //       child.type === "INSTANCE" ||
  //       child.type === "FRAME"
  //     ) {
  //       return renderTagSC(child.children);
  //     } else {
  //       return (
  //         <div key={child.id}>
  //           {child.type === "TEXT" ? (
  //             <div className="ml-4">
  //               &lt;
  //               <code
  //                 contentEditable
  //                 dir="RTL"
  //                 suppressContentEditableWarning={true}
  //                 onBlur={(event) => {
  //                   dispatch(
  //                     setTag({
  //                       id: child.id,
  //                       tag: event.currentTarget.textContent,
  //                     })
  //                   );

  //                   // console.log(child.id, event.currentTarget.textContent);
  //                   // handleTag(child.id, event.currentTarget.textContent);
  //                 }}
  //               >
  //                 {tags[child.id] ? tags[child.id] : child.name}

  //                 {/* {child.name} */}
  //               </code>
  //               &gt;{child.characters}&lt;
  //               <code
  //                 contentEditable
  //                 dir="RTL"
  //                 suppressContentEditableWarning={true}
  //                 onBlur={(event) => {
  //                   dispatch(
  //                     setTag({
  //                       id: child.id,
  //                       tag: event.currentTarget.textContent,
  //                     })
  //                   );

  //                   // handleTag(child.id, event.currentTarget.textContent);
  //                 }}
  //               >
  //                 {tags[child.id] ? tags[child.id] : child.name}

  //                 {/* {child.name} */}
  //               </code>
  //               &gt;
  //             </div>
  //           ) : (
  //             <div className="ml-4">{`<${child.name}><${child.name}>`}</div>
  //           )}
  //         </div>
  //       );
  //     }
  //   });
  //   return renderedChildren;
  // };

  // SC Style
  // const renderStyleSC = (children: any) => {
  //   if (!children) {
  //     return null;
  //   }

  //   return children.map((child: any) => {
  //     if (
  //       child.type === "GROUP" ||
  //       child.type === "INSTANCE" ||
  //       child.type === "FRAME"
  //     ) {
  //       return renderStyleSC(child.children);
  //     } else {
  //       if (child.type === "RECTANGLE") {
  //         if (child.fills[0]?.type === "IMAGE") {
  //           return (
  //             <div key={child.id}>
  //               <div>{`const ${child.name} = styled.img\``}</div>
  //               <div className="ml-4">{` background-image: url("Your-image-url.jpg");`}</div>
  //               <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //               <div className="ml-4">{` height: ${Math.round(
  //                 child.absoluteBoundingBox.height
  //               )}px;`}</div>
  //               <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //               <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //               {child.cornerRadius ? (
  //                 <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
  //               ) : (
  //                 ""
  //               )}
  //               {child.strokes.length !== 0 ? (
  //                 <div className="ml-4">{`border: ${child.strokeWeight}px
  //             ${child.strokes[0].type.toLowerCase()}
  //             rgba(
  //               ${Math.round(child.strokes[0].color.r * 255)},
  //               ${Math.round(child.strokes[0].color.g * 255)},
  //               ${Math.round(child.strokes[0].color.b * 255)},
  //               ${child.strokes[0].color.a})
  //               `}</div>
  //               ) : (
  //                 ""
  //               )}
  //               <div>`</div>
  //             </div>
  //           );
  //         } else if (child.fills[0]?.type === "SOLID") {
  //           return (
  //             <div key={child.id}>
  //               <div>{`const ${child.name} = styled.div\``}</div>
  //               <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //               <div className="ml-4">{` height: ${Math.round(
  //                 child.absoluteBoundingBox.height
  //               )}px;`}</div>
  //               <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //               <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //               <div className="ml-4">
  //                 {`backgroundColor: rgba(${Math.round(
  //                   child.fills[0]?.color.r * 255
  //                 )},
  //               ${Math.round(child.fills[0]?.color.g * 255)},
  //               ${Math.round(child.fills[0]?.color.b * 255)},
  //               ${
  //                 child.fills[0].opacity
  //                   ? child.fills[0].opacity * child.fills[0].color.a
  //                   : child.fills[0].color.a
  //               })`}
  //               </div>
  //               {child.cornerRadius ? (
  //                 <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
  //               ) : (
  //                 ""
  //               )}
  //               {child.strokes.length !== 0 ? (
  //                 <div className="ml-4">{`border: ${child.strokeWeight}px
  //             ${child.strokes[0].type.toLowerCase()}
  //             rgba(
  //               ${Math.round(child.strokes[0].color.r * 255)},
  //               ${Math.round(child.strokes[0].color.g * 255)},
  //               ${Math.round(child.strokes[0].color.b * 255)},
  //               ${child.strokes[0].color.a})
  //               `}</div>
  //               ) : (
  //                 ""
  //               )}
  //               <div>`</div>
  //             </div>
  //           );
  //         } else {
  //           return (
  //             <div key={child.id}>
  //               <div>{`const ${child.name} = styled.div\``}</div>
  //               <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //               <div className="ml-4">{` height: ${Math.round(
  //                 child.absoluteBoundingBox.height
  //               )}px;`}</div>
  //               <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //               <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //               {child.cornerRadius ? (
  //                 <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
  //               ) : (
  //                 ""
  //               )}
  //               {child.strokes.length !== 0 ? (
  //                 <div className="ml-4">{`border: ${child.strokeWeight}px
  //             ${child.strokes[0].type.toLowerCase()}
  //             rgba(
  //               ${Math.round(child.strokes[0].color.r * 255)},
  //               ${Math.round(child.strokes[0].color.g * 255)},
  //               ${Math.round(child.strokes[0].color.b * 255)},
  //               ${child.strokes[0].color.a})
  //               `}</div>
  //               ) : (
  //                 ""
  //               )}
  //               <div>`</div>
  //             </div>
  //           );
  //         }
  //       } else if (child.type === "ELLIPSE") {
  //         return (
  //           <div key={child.id}>
  //             <div>{`const Text_${child.name} = styled.div\``}</div>
  //             <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //             <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
  //             <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //             <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //             <div className="ml-4">{` border-radius: 50%;`}</div>
  //             <div className="ml-4">
  //               {` backgroundColor: rgba(${Math.round(
  //                 child.fills[0]?.color.r * 255
  //               )},
  //               ${Math.round(child.fills[0]?.color.g * 255)},
  //               ${Math.round(child.fills[0]?.color.b * 255)},
  //               ${
  //                 child.fills[0]?.opacity
  //                   ? child.fills[0]?.opacity * child.fills[0]?.color.a
  //                   : child.fills[0]?.color.a
  //               })`}
  //             </div>
  //             {child.strokes.length !== 0 && (
  //               <div className="ml-4">
  //                 {`border:
  //               ${child.strokeWeight}px
  //               ${child.strokes[0].type.toLowerCase()}
  //                 rgba(
  //                   ${Math.round(child.strokes[0]?.color.r * 255)},
  //                   ${Math.round(child.strokes[0]?.color.g * 255)},
  //                   ${Math.round(child.strokes[0]?.color.b * 255)},
  //                   ${child.strokes[0].color.a})`}
  //               </div>
  //             )}
  //             <div>`</div>
  //           </div>
  //         );
  //       } else if (child.type === "LINE" || child.type === "VECTOR") {
  //         return (
  //           <div key={child.id}>
  //             <div>{`const Text_${child.name} = styled.div\``}</div>
  //             <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //             <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
  //             <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //             <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //             <div className="ml-4">
  //               {` backgroundColor: rgba(${Math.round(
  //                 child.strokes[0]?.color.r * 255
  //               )},
  //               ${Math.round(child.strokes[0]?.color.g * 255)},
  //               ${Math.round(child.strokes[0]?.color.b * 255)},
  //               ${
  //                 child.strokes[0]?.opacity
  //                   ? child.strokes[0]?.opacity * child.strokes[0]?.color.a
  //                   : child.strokes[0]?.color.a
  //               })`}
  //             </div>
  //             <div>`</div>
  //           </div>
  //         );
  //       } else if (child.type === "TEXT") {
  //         return (
  //           <div key={child.id}>
  //             <div>{`const ${child.name} = styled.div\``}</div>
  //             <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
  //             <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
  //             <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
  //             <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
  //             <div className="ml-4">{` font-family: ${child.style.fontFamily};`}</div>
  //             {child.style.italic && (
  //               <div className="ml-4">{` font-style: italic;`}</div>
  //             )}
  //             <div className="ml-4">{` font-weight: ${child.style.fontWeight};`}</div>
  //             <div className="ml-4">{` font-size: ${child.style.fontSize}px;`}</div>
  //             <div className="ml-4">{` line-height: ${
  //               Math.round(child.style.lineHeightPx * 10) / 10
  //             }px;`}</div>
  //             {child.style.letterSpacing !== 0 && (
  //               <div className="ml-4">{` letter-spacing: ${
  //                 Math.round(child.style.letterSpacing * 10) / 10
  //               }px;`}</div>
  //             )}
  //             <div className="ml-4">{` text-align: ${child.style.textAlignHorizontal.toLowerCase()};`}</div>
  //             <div className="ml-4">
  //               {` color: rgba(
  //               ${Math.round(child.fills[0]?.color.r * 255)},
  //               ${Math.round(child.fills[0]?.color.g * 255)},
  //               ${Math.round(child.fills[0]?.color.b * 255)},
  //               ${child.fills[0].color.a})`}
  //             </div>
  //             <div>`</div>
  //           </div>
  //         );
  //       }
  //       return <div key={child.id}>{child.name}</div>;
  //     }
  //   });
  // };

  const convertToSCTagEdit = (
    children: Element[] | undefined
  ): (JSX.Element | null)[] | null => {
    if (!children) {
      return null;
    }
    const renderedChildren = children.flatMap((child: Element) => {
      switch (child.type) {
        case ElementType.GROUP:
        case ElementType.INSTANCE:
        case ElementType.FRAME:
          return convertToSCTagEdit(child.children);
        case ElementType.TEXT:
          return (
            <div key={child.id} className="text-[#F7768E]">
              &lt;
              <code
                className="text-[#bb9af7]"
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
                className="text-[#bb9af7]"
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
        default:
          return (
            <div key={child.id} className="text-[#F7768E]">
              &lt;
              <code
                className="text-[#bb9af7]"
                contentEditable
                dir="RTL"
                suppressContentEditableWarning={true}
                onBlur={(event) => {
                  dispatch(
                    setTag({ [child.id]: event.currentTarget.textContent })
                  );
                }}
                // onBlur={(event) => {
                //   dispatch(
                //     setTag({
                //       id: child.id,
                //       tag: event.currentTarget.textContent,
                //     })
                //   );
                // }}
              >
                {tags[child.id] ? tags[child.id] : child.name}
              </code>
              &gt;&lt;/
              <code
                className="text-[#bb9af7]"
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
    });
    const styledComponentsTag = renderedChildren.filter(
      (child) => child !== null
    );
    return styledComponentsTag.length > 0 ? styledComponentsTag : null;
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  let [categories] = useState({
    Tailwind: [{}],
    ["Styled Components"]: [{}],
  });

  return (
    <div className="w-full xl:w-1/2 h-screen xl:h-4/5 flex flex-col items-center justify-start xl:justify-between pt-56 sm:pt-36 xl:pt-0 pb-12 xl:pb-0 ">
      {/* Tab */}
      <Tab.Group>
        <Tab.List className="w-full flex space-x-1 rounded-xl bg-blue-900/20">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full h-16 rounded-lg font-extrabold text-base sm:text-xl leading-5",
                  "ring-pink ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-1",
                  selected
                    ? "bg-gradient-to-r from-pink-400/80 to-violet-600  text-slate-900"
                    : " text-violet-300 hover:text-pink hover:shadow-[0_0px_20px_0px_rgba(0,0,0,1)] hover:shadow-violet-600"
                )
              }
              // onClick={() => handleCodeStyle(category)}
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full h-[calc(100%-60px)] xl:h-[calc(100%-112px)] pt-12 xl:pt-0">
          <Tab.Panel
            className={classNames(
              "relative h-full rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 p-4"
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
            {frameChildren ? (
              <div
                ref={taiRef}
                className="w-full h-[calc(100%-16px)]  overflow-auto no-scrollbar rounded"
              >
                <HighLight frameChildren={frameChildren.tailwind} />
              </div>
            ) : (
              <CodeSkeleton />
            )}
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "h-full  divide-y rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] ring-1 ring-violet-100 p-4"
            )}
          >
            <div className="relative w-full h-1/2">
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
              {frameChildren ? (
                <pre className="w-full h-[calc(100%-16px)]  overflow-auto no-scrollbar rounded whitespace-nowrap pl-4">
                  <code ref={scTagRef}>
                    {convertToSCTagEdit(frameChildren.styledComponentsTag)}
                  </code>
                </pre>
              ) : (
                <CodeSkeleton />
              )}
            </div>
            <div className="relative w-full h-1/2 pt-4">
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
              {frameChildren ? (
                <div
                  ref={scStyleRef}
                  className="w-full h-full overflow-auto no-scrollbar rounded"
                >
                  <HighLight
                    frameChildren={frameChildren.styledComponentsStyle}
                  />
                </div>
              ) : (
                <CodeSkeleton />
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
