"use client";

import { Tab } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTag } from "@/store/tagsSlice";

import HighLight from "./highLight";
import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
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
      const frameXY = [
        selectedFrame.absoluteBoundingBox.x,
        selectedFrame.absoluteBoundingBox.y,
      ];
      const justifyContent = selectedFrame.primaryAxisAlignItems;
      if (frameChildren.length !== 0) {
        const tailwind = ConvertToTai(frameChildren, frameXY, justifyContent);
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
    <div className="w-full xl:w-1/2 h-screen xl:h-4/5 flex flex-col items-center  pt-[180px] sm:pt-36 xl:pt-0 pb-16 xl:pb-0 ">
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
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full h-[calc(100%-64px)] pt-8">
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
                className="w-full h-full  overflow-auto no-scrollbar rounded"
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
            <div className="relative w-full h-1/2 pb-4">
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
                <pre className="w-full h-full  overflow-auto no-scrollbar rounded whitespace-nowrap pl-4">
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
