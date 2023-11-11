import { useState, useRef } from "react";
import Image from "next/image";
import { ConvertedFramesData } from "@/types";
import { Tab } from "@headlessui/react";
import HighLight from "@/components/highLight";

type CollectionProps = {
  frameData: ConvertedFramesData;
};

const Collection: React.FC<CollectionProps> = ({ frameData }) => {
  const taiRef = useRef<HTMLDivElement>(null);
  const scTagRef = useRef<HTMLDivElement>(null);
  const scStyleRef = useRef<HTMLDivElement>(null);

  const [frameIsScaled, setFrameIsScaled] = useState(false);
  const [frameIsFilled, setFrameIsFilled] = useState(true);
  const [copied, setCopied] = useState("");

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  const [categories] = useState({
    Tailwind: [{}],
    ["Styled Component"]: [{}],
  });

  const scaleFrame = () => {
    setFrameIsScaled((prev) => !prev);
    if (frameIsFilled) {
      setTimeout(() => {
        setFrameIsFilled((prev) => !prev);
      }, 500);
    } else {
      setFrameIsFilled((prev) => !prev);
    }
  };

  const handleCopied = (style: string) => {
    setCopied(style);
    setTimeout(() => {
      setCopied("");
    }, 500);
    switch (style) {
      case "Tailwind":
        {
          taiRef.current &&
            navigator.clipboard.writeText(taiRef.current.innerText);
        }
        break;
      case "styledComponentsTag":
        {
          scTagRef.current &&
            navigator.clipboard.writeText(scTagRef.current.innerText);
        }
        break;
      case "styledComponentsStyle":
        {
          scStyleRef.current &&
            navigator.clipboard.writeText(scStyleRef.current.innerText);
        }
        break;
    }
  };

  return (
    <div className="relative w-full h-80 flex rounded-3xl mb-10">
      <div
        className={`
      ${frameIsScaled ? "w-full" : "w-80"}
      transition-all
       absolute h-full z-10 rounded-xl overflow-scroll
        border-2 border-purple-300 hover:border-violet-500
        cursor-pointer 
      `}
      >
        {frameData.imageUrl ? (
          frameIsFilled ? (
            <Image
              src={frameData.imageUrl}
              alt="Frame"
              fill
              priority={true}
              className="object-cover object-top rounded-xl"
              onClick={scaleFrame}
            />
          ) : (
            <Image
              src={frameData.imageUrl}
              alt="Frame"
              width={2000}
              height={2000}
              priority={true}
              className="rounded-xl"
              onClick={scaleFrame}
            />
          )
        ) : (
          <div className="w-full h-full flex justify-center items-center rounded-xl bg-slate-800">
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
      </div>
      <div className={`${frameIsScaled ? "block" : "block"} h-80 w-80`}></div>
      <div className="justify-self-end w-[calc(100%-336px)] h-full rounded-3xl ml-4">
        <Tab.Group>
          <Tab.List className="h-16 flex space-x-1 rounded-xl bg-neutral-900 text-lg">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-md font-bold tracking-wide leading-5",
                    "focus:outline-none",
                    selected
                      ? "bg-gradient-to-r from-rose-300 to-violet-500  text-slate-100 border-2 border-purple-300"
                      : "text-slate-100 hover:text-violet-500"
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
                "relative h-full rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] border-2 border-purple-300 p-4"
              )}
            >
              {copied === "Tailwind" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute top-4 right-4 bg-slate-900 cursor-pointer w-10 h-10 border-2
              border-purple-600 stroke-purple-600 rounded p-2"
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
                  className="absolute top-4 right-4 bg-slate-900 cursor-pointer w-10 h-10 stroke-purple-300 ml-auto border-2 border-purple-300
                 hover:border-purple-600 hover:stroke-purple-600 rounded p-2"
                  onClick={() => handleCopied("Tailwind")}
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
                "h-full divide-x flex rounded-xl bg-[#1a1b26] shadow-[inset_0_0px_10px_0px_rgba(15,23,42,1)] border-2 border-purple-300 p-4 "
              )}
            >
              <div className="w-1/2 pr-4 relative">
                {copied === "styledComponentsTag" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute top-0 right-4 bg-slate-900 cursor-pointer w-10 h-10 border-2
              border-purple-600 stroke-purple-600 rounded p-2"
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
                    className="absolute top-0 right-4 bg-slate-900 cursor-pointer w-10 h-10 stroke-purple-300 ml-auto border-2 border-purple-300
                 hover:border-purple-600 hover:stroke-purple-600 rounded p-2"
                    onClick={() => handleCopied("styledComponentsTag")}
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
                    ref={scTagRef}
                    className="w-full h-full overflow-auto no-scrollbar"
                  >
                    <HighLight frameChildren={frameData.styledComponentsTag} />
                  </div>
                ) : null}
              </div>

              <div className="w-1/2 pl-4 relative">
                {copied === "styledComponentsStyle" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute top-0 right-0 bg-slate-900 cursor-pointer w-10 h-10 border-2
              border-purple-600 stroke-purple-600 rounded p-2"
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
                    className="absolute top-0 right-0 bg-slate-900 cursor-pointer w-10 h-10 stroke-purple-300 ml-auto border-2 border-purple-300
                 hover:border-purple-600 hover:stroke-purple-600 rounded p-2"
                    onClick={() => handleCopied("styledComponentsStyle")}
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
                    ref={scStyleRef}
                    className="w-full h-full overflow-auto no-scrollbar"
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
  );
};
export default Collection;
