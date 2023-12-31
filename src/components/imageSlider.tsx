"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "@/store/currentPageSlice";
import { setCurrentFrame } from "@/store/currentFrameSlice";
import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";

import {
  Pages,
  CurrentPage,
  CurrentFrame,
  frameImages,
  IsConverting,
} from "@/types";

export default function ImageSlider(): JSX.Element {
  const pages = useSelector((state: Pages) => state.pages.pages);
  const currentPage = useSelector(
    (state: CurrentPage) => state.currentPage.page
  );
  const currentFrame = useSelector(
    (state: CurrentFrame) => state.currentFrame.frame
  );
  const frameImages = useSelector(
    (state: frameImages) => state.frameImages.images
  );
  const isCoverting = useSelector(
    (state: IsConverting) => state.convert.isConverting
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const selectedPage = pages.find((page) => page.name === currentPage);
    if (selectedPage) {
      dispatch(
        setCurrentFrame({
          id: selectedPage.children[0].id,
          name: selectedPage.children[0].name,
        })
      );
    }
  }, [pages, currentPage]);

  const handlePage = (name: string): void => {
    dispatch(setCurrentPage(name));
  };
  const handleFrame = (id: string, name: string): void => {
    dispatch(setCurrentFrame({ id, name }));
  };

  return (
    <div className="w-full h-[calc(100%-48px)] flex flex-col items-center">
      <div className="w-full flex justify-between">
        <div className="w-[calc((100%-24px)/2)] xl:w-[calc((100%-32px)/2)]">
          {/* page 選單*/}
          <Listbox value={currentPage}>
            <div className="relative">
              <Listbox.Button
                className="relative flex justify-center items-center w-full h-16 text-center text-xl font-bold cursor-default rounded-lg
               border-2 border-pink-300 text-white tracking-wider py-2 shadow-md 
               focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 "
              >
                <span className="block truncate">{currentPage}</span>
              </Listbox.Button>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {pages && pages.length !== 0 && (
                  <Listbox.Options
                    className="absolute w-full mt-1 max-h-60  overflow-auto rounded-md bg-white  text-lg
                   shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {pages.map((page) => (
                      <Listbox.Option
                        key={page.id}
                        className={({ active }) =>
                          `relative w-full h-12 flex  justify-center items-center cursor-default select-none ${
                            active
                              ? "bg-pink-300 text-pink-900"
                              : "bg-pink-200  text-slate-900"
                          } ${
                            currentPage === page.name
                              ? "font-extrabold"
                              : "font-bold"
                          }`
                        }
                        value={page.name}
                      >
                        <div
                          className="w-full h-full flex justify-center items-center"
                          onClick={() => handlePage(page.name)}
                        >
                          {page.name}
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* frame 選單 */}
        <div className="w-[calc((100%-24px)/2)] md:w-[calc((100%-32px)/2)]">
          <Listbox value={currentFrame}>
            <div className=" relative">
              <Listbox.Button
                className="relative  flex justify-center items-center w-full h-16 text-center text-xl font-bold cursor-default rounded-lg
               border-2 border-violet-300 text-white tracking-wider py-2   shadow-md
                focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
              >
                <span className="block truncate">{currentFrame.name}</span>
              </Listbox.Button>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {pages && pages.length !== 0 && (
                  <Listbox.Options
                    className="absolute w-full mt-1 max-h-60  overflow-auto rounded-md bg-white  text-lg
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {pages
                      .filter((page) => page.name === currentPage)
                      .map((page) =>
                        page.children
                          ? page.children.map((frame) => (
                              <Listbox.Option
                                key={frame.id}
                                className={({ active }) =>
                                  `relative w-full h-12 flex  justify-center items-center cursor-default select-none ${
                                    active
                                      ? "bg-violet-300 text-violet-900"
                                      : "bg-violet-200  text-slate-900"
                                  } ${
                                    currentFrame.name === frame.name
                                      ? "font-extrabold"
                                      : "font-bold"
                                  }`
                                }
                                value={frame.name}
                              >
                                <div
                                  className="w-full h-full flex justify-center items-center"
                                  onClick={() => {
                                    handleFrame(frame.id, frame.name);
                                  }}
                                >
                                  {frame.name}
                                </div>
                              </Listbox.Option>
                            ))
                          : null
                      )}
                  </Listbox.Options>
                )}
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="w-full h-[calc(100%-64px)] flex justify-center items-center py-8">
        {frameImages.length !== 0 ? (
          currentPage === "Pages" || currentFrame.name === "Frames" ? (
            frameImages.map(
              (frameImage) =>
                frameImage.page === pages[0].name &&
                frameImage.id === pages[0].children[0].id && (
                  <Image
                    key={frameImage.id}
                    src={frameImage.url}
                    alt="Frame"
                    width={2000}
                    height={2000}
                    priority={true}
                    className=""
                  />
                )
            )
          ) : (
            frameImages.map(
              (frameImage) =>
                frameImage.page === currentPage &&
                frameImage.id === currentFrame.id && (
                  <div
                    key={frameImage.id}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <Image
                      src={frameImage.url}
                      alt="Frame"
                      width={1000}
                      height={1000}
                      priority={true}
                      className="object-contain max-h-full"
                    />
                  </div>
                )
            )
          )
        ) : (
          // skeleton
          <div
            role="status"
            className={`w-full h-full ${isCoverting ? "animate-pulse" : ""}
             md:space-y-0 md:space-x-8`}
          >
            <div className="flex items-center justify-center w-full h-full bg-slate-300 rounded-lg  dark:bg-slate-700">
              <svg
                className="w-16 h-16 text-slate-200 dark:text-slate-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
