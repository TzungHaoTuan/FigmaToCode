"use client";
import React, { useState, Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "@/store/currentPageSlice";
import { setCurrentFrame } from "@/store/currentFrameSlice";

import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface Image {
  page: string;
  id: string;
  url: string;
}
interface Images {
  images: Image[];
}

interface ImagesState {
  frameImages: Images;
}

type FrameState = {
  initialFrame: {
    frame: string;
  };
};
interface Frame {
  id: string;
  name: string;
}
interface Page {
  id: string;
  name: string;
  frames: Frame[];
}

interface Pages {
  pages: Page[];
}
interface PagesState {
  pages: Pages;
}

const ImageSlider = ({ toggleScaled }: any) => {
  const pages = useSelector((state: PagesState) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const images = useSelector((state: ImagesState) => state.frameImages.images);
  const isCoverting = useSelector((state: any) => state.convert.isConverting);

  const [currentPageState, setCurrentPageState] = useState<string>("Pages");
  const [currentFrameState, setCurrentFrameState] = useState<string>("Frames");
  const [currentImageState, setCurrentImageState] = useState<any>(0);

  const [isAnimating, setIsAnimating] = React.useState(false);
  const [animationDirection, setAnimationDirection] = React.useState("next");

  useEffect(() => {
    const selectedPage = pages.find((page) => page.name === currentPageState);
    if (selectedPage) {
      dispatch(
        setCurrentFrame({
          id: selectedPage.frames[0].id,
          name: selectedPage.frames[0].name,
        })
      );
      setCurrentFrameState(selectedPage.frames[0].name);
    }
  }, [currentPage, pages]);

  const dispatch = useDispatch();

  const handlePage = (name: string): void => {
    dispatch(setCurrentPage(name));
  };
  const handleFrame = (id: string, name: string): void => {
    dispatch(setCurrentFrame({ id, name }));
  };

  // images
  // const handleImageChange = (direction: any) => {
  //   if (isAnimating) return;

  //   setIsAnimating(true);
  //   setAnimationDirection(direction);

  //   // Wait for the animation to finish before updating the current image
  //   setTimeout(() => {
  //     if (direction === "next") {
  //       setCurrentImageState((prevImage: any) =>
  //         // 是不是最後一張
  //         prevImage === images.length - 1 ? 0 : prevImage + 1
  //       );
  //     } else if (direction === "prev") {
  //       setCurrentImageState((prevImage: any) =>
  //         // 是不是第一張
  //         prevImage === 0 ? images.length - 1 : prevImage - 1
  //       );
  //     }
  //     setIsAnimating(false);
  //   }, 800); // Adjust the animation duration as needed
  // };

  //
  return (
    <div
      className="w-full flex flex-col items-center xl:justify-between"
      onClick={() => console.log([currentPage, currentFrame])}
    >
      <div className="w-full flex justify-between">
        <div className="w-[calc((100%-24px)/2)] lg:w-[calc((100%-32px)/2)]">
          {/* page 選單*/}
          <Listbox
            value={currentPageState}
            onChange={setCurrentPageState}
            // onChange={(value) => handlePage(value)}
          >
            <div className="relative">
              <Listbox.Button
                className="relative flex justify-center items-center w-full h-16 text-center text-xl font-bold cursor-default rounded-lg
               border-2 border-pink-300 text-white tracking-wider py-2 shadow-md 
               focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 "
              >
                <span className="block truncate">{currentPageState}</span>
                {/* <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span> */}
              </Listbox.Button>
              <Transition
                // as={Fragment}
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
                            currentPageState === page.name
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
          <Listbox
            value={currentFrameState}
            onChange={setCurrentFrameState}

            // onChange={(value) => handleFrame(value)}
          >
            <div className=" relative">
              <Listbox.Button
                className="relative  flex justify-center items-center w-full h-16 text-center text-xl font-bold cursor-default rounded-lg
               border-2 border-violet-300 text-white tracking-wider py-2   shadow-md
                focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
              >
                <span className="block truncate">{currentFrameState}</span>
                {/* <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span> */}
              </Listbox.Button>
              <Transition
                // as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {pages && pages.length !== 0 && (
                  <Listbox.Options
                    className="absolute w-full mt-1 max-h-60  overflow-auto rounded-md bg-white  text-lg
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {currentPageState === "Pages"
                      ? pages[0]?.frames.map((frame) => (
                          <Listbox.Option
                            key={frame.id}
                            className={({ active }) =>
                              `relative w-full h-12 flex  justify-center items-center cursor-default select-none  ${
                                active
                                  ? "bg-violet-300 text-violet-900 drop-shadow-xl"
                                  : "bg-violet-200  text-slate-900"
                              } ${
                                currentFrameState === frame.name
                                  ? "font-extrabold"
                                  : "font-bold"
                              }`
                            }
                            value={frame.name}
                            // onClick={() => handleFrame(frame.id)}
                          >
                            <div
                              className="w-full h-full flex justify-center items-center"
                              onClick={() => handleFrame(frame.id, frame.name)}
                            >
                              {frame.name}
                            </div>
                          </Listbox.Option>
                        ))
                      : pages
                          .filter((page) => page.name === currentPageState)
                          .map((page) =>
                            page.frames.map((frame) => (
                              <Listbox.Option
                                key={frame.id}
                                className={({ active }) =>
                                  `relative w-full h-12 flex  justify-center items-center cursor-default select-none  ${
                                    active
                                      ? "bg-violet-300 text-violet-900 drop-shadow-xl"
                                      : "bg-violet-200  text-slate-900"
                                  } ${
                                    currentFrameState === frame.name
                                      ? "font-extrabold"
                                      : "font-bold"
                                  }`
                                }
                                value={frame.name}
                                // onClick={() => handleFrame(frame.id)}
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
                          )}
                  </Listbox.Options>
                )}
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] xl:h-[350px] flex justify-center items-center pt-12">
        {images.length !== 0 ? (
          currentPageState === "Pages" || currentFrameState === "Frames" ? (
            images.map(
              (image) =>
                image.page === pages[0].name &&
                image.id === pages[0].frames[0].id && (
                  <div
                    key={image.id}
                    className="h-full flex justify-center items-center"
                  >
                    <img
                      key={image.id}
                      src={image.url}
                      alt="ImageImage"
                      className="max-h-full object-auto"
                      // onClick={() => console.log(image.id)}
                    />
                  </div>
                )
            )
          ) : (
            images.map(
              (image) =>
                image.page === currentPageState &&
                image.id === currentFrame.id && (
                  <div
                    key={image.id}
                    className="h-full flex justify-center items-center"
                    onClick={() => console.log(images)}
                  >
                    <img
                      key={image.id}
                      src={image.url}
                      alt="ImageImage"
                      className="max-h-full object-auto"
                    />
                  </div>
                )
            )
          )
        ) : (
          // skeleton
          <div
            role="status"
            className={`w-full h-full space-y-8 ${
              isCoverting ? "animate-pulse" : ""
            }
             md:space-y-0 md:space-x-8 md:flex md:items-center`}
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
};

export default ImageSlider;
