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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleScroll();
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
              className="w-[530px] h-12 bg-gradient-to-r from-white to-slate-300 rounded-full font-semibold text-slate-800 px-16
              placeholder:font-normal  placeholder:text-slate-400 ring-0
              focus:outline-none focus:ring-4 focus:ring-indigo-600/60  focus:shadow-lg focus:shadow-indigo-600
              hover:ring-4 hover:ring-indigo-600/60  hover:shadow-lg hover:shadow-indigo-600
              transition-all duration-400 hover:transition-all hover:duration-400 hover:ease-in
              "
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
            className="h-12 bg-indigo-700 hover:bg-slate-300  text-xl font-bold tracking-wider text-white shadow-[inset_0_0px_20px_2px_rgba(30,27,75,1)]
             hover:text-indigo-600 hover:shadow-none  rounded-full drop-shadow-lg px-4 py-2"
          >
            Convert
          </button>
        </form>
      </div>
    </div>
  );
};
export default SearchForm;
