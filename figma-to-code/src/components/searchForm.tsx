"use client";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setData } from "@/store/figmaDataSlice";
import { setPages } from "@/store/pagesSlice";
import { setCurrentPage } from "@/store/currentPageSlice";
import { setCurrentFrame } from "@/store/currentFrameSlice";
import { setFrameImages } from "@/store/frameImagesSlice";
import { setImages } from "@/store/imagesSlice";
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
      }
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-1/2 flex ">
        <input
          type="text"
          ref={urlRef}
          className="w-full h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <button
          type="submit"
          className=" h-10 border-2 border-black rounded-xl"
        >
          Search
        </button>
      </form>
    </div>
  );
};
export default SearchForm;
