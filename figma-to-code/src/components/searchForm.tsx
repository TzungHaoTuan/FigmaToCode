"use client";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setData } from "@/store/figmaDataSlice";
import { setPages } from "@/store/pagesSlice";
import { setCurrentPage } from "@/store/currentPageSlice";
import { setCurrentFrame } from "@/store/currentFrameSlice";
import { setFrameImages } from "@/store/frameImagesSlice";
import { setImages } from "@/store/imagesSlice";
import { setCodeState } from "@/store/codeStateSlice";
import { handleFetch } from "@/app/utils/fetchFigmaData";

const SearchForm = () => {
  const dispatch = useDispatch();
  const urlRef = useRef<HTMLInputElement | null>(null);

  const [isConverting, setIsConverting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsConverting(true);
    // setTimeout(() => {
    //   handleScroll();
    // }, 7000);
    // setTimeout(() => {
    //   setIsConverting(false);
    // }, 8000);

    const url = urlRef.current?.value;
    if (url) {
      const result = await handleFetch(url);
      if (result) {
        const { data, pages, currentPage, currentFrame, frameImages, images } =
          result;
        console.log(data);

        dispatch(setData(data));
        dispatch(setPages(pages));
        dispatch(setCurrentPage(currentPage));
        dispatch(setCurrentFrame(currentFrame));
        dispatch(setFrameImages(frameImages));
        dispatch(setImages(images));
        dispatch(setCodeState(true));
      }
    }
    setTimeout(() => {
      handleScroll();
      setIsConverting(false);
    }, 1000);
  };

  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // bg-gradient-to-br
  // from-red-200
  // from-10%
  // via-purple-800
  // via-70%
  // to-violet-900
  // animate-gradient-x
  return (
    <div className="w-full h-screen">
      <div className="w-full h-full  bg-slate-900 flex flex-col  items-center px-12 pt-24">
        <div className=" text-5xl font-extrabold leading-tight tracking-wide text-slate-200 text-center mt-20">
          Accelerate Layout Creation<br></br>with Effortless Conversion
        </div>
        <div className="text-xl  leading-tight  text-indigo-300 text-center mt-4">
          Empowering Web Developers with Seamless<br></br>
          <span className="font-mono text-indigo-400"> Tailwind </span>
          and
          <span className="font-mono text-indigo-400"> Styled Component </span>
          Code Generation
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-[677px] justify-between items-center mt-8"
        >
          <div className="relative flex justify-center items-center">
            <input
              type="text"
              ref={urlRef}
              placeholder="Figma file url..."
              className={`${
                isConverting ? "w-[400px]" : "w-[480px]"
              } h-12 bg-gradient-to-r from-white to-slate-300 rounded-full font-semibold text-slate-800 px-16
              placeholder:font-normal  placeholder:text-slate-400 ring-0
              focus:outline-none focus:ring-4 focus:ring-indigo-600/60  focus:shadow-lg focus:shadow-indigo-600
              hover:ring-4 hover:ring-indigo-600/60  hover:shadow-lg hover:shadow-indigo-600
              transition-all duration-400 hover:transition-all hover:duration-400 hover:ease-in ${
                isConverting ? "transition-all duration-300 ease-in-out" : ""
              }`}
            ></input>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              // stroke="currentColor"
              className="w-6 h-6 absolute left-6 top-1/2 transform -translate-y-1/2 stroke-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          <button
            type="submit"
            className={`${
              isConverting ? "w-56" : "w-44"
            } h-12 flex justify-center items-center bg-indigo-700  text-lg font-semibold tracking-wider text-white 
             hover:text-indigo-600  hover:bg-slate-300  ${
               isConverting
                 ? "text-indigo-600 bg-slate-300"
                 : "text-white bg-indigo-700"
             }   rounded-full  px-4 py-2 ${
              isConverting ? "transition-all duration-300 ease-in-out" : ""
            }`}
          >
            {isConverting ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-6 h-6 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="rgb(79, 70, 229)"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="rgb(219, 39, 119)"
                />
              </svg>
            ) : null}
            {isConverting ? "Converting..." : "Convert"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default SearchForm;
