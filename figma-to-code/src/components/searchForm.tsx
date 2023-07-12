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

  return (
    <div
      className="w-full h-screen bg-gradient-to-br 
    from-red-200
    from-10%
    via-purple-800
    via-70% 
    to-violet-900 
    animate-gradient-x 
    
    flex flex-col justify-center items-center px-12 pt-28"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full justify-center items-center"
      >
        <input
          type="text"
          ref={urlRef}
          className="w-1/2 h-12 border-2 border-white    rounded-full drop-shadow-lg text-black px-4"
        ></input>
        <button
          type="submit"
          className="h-12  border-4 border-white font-semibold text-white rounded-full drop-shadow-lg ml-10 px-4 py-2"
        >
          Convert
        </button>
      </form>
    </div>
  );
};
export default SearchForm;
