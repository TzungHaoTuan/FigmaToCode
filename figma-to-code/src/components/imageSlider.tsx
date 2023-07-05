"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "@/store/currentPageSlice";
import { setCurrentFrame } from "@/store/currentFrameSlice";

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

  const [currentPageState, setCurrentPageState] = useState<string>();
  const [currentFrameState, setCurrentFrameState] = useState<string>();

  const dispatch = useDispatch();

  const handlePage = (name: string): void => {
    setCurrentPageState(name);
    dispatch(setCurrentPage(name));
  };
  const handleFrame = (id: string): void => {
    setCurrentFrameState(id);
    dispatch(setCurrentFrame(id));
  };
  return (
    <div>
      <div className="flex">
        {pages &&
          pages.map((page) => (
            <div
              key={page.id}
              className="border-2 border-black"
              onClick={() => handlePage(page.name)}
            >
              {page.name}
            </div>
          ))}
      </div>
      <div className="flex">
        {pages
          ? pages
              .filter((page) => page.name === currentPageState)
              .map((page) =>
                page.frames.map((frame) => (
                  <div key={frame.id} onClick={() => handleFrame(frame.id)}>
                    {frame.name}
                  </div>
                ))
              )
          : // : pages
            // ? pages[0].frames.map((frame) => (
            //     <div key={frame.id} onClick={() => handleFrame(frame.id)}>
            //       {frame.name}
            //     </div>
            //   ))
            null}
      </div>
      <div className="flex" onClick={toggleScaled}>
        {currentFrameState && images.length !== 0
          ? images.map(
              (image) =>
                image.page === currentPageState &&
                image.id === currentFrameState && (
                  <div key={image.id}>
                    <img
                      key={image.id}
                      src={image.url}
                      alt="ImageImage"
                      className="max-h-96"
                    />
                  </div>
                )
            )
          : images.length !== 0
          ? images.map(
              (image) =>
                image.id === currentFrame && (
                  <div key={image.id}>
                    <img
                      key={image.id}
                      src={image.url}
                      alt="ImageImage"
                      className="max-h-96"
                    />
                  </div>
                )
            )
          : null}
      </div>
    </div>
  );
};

export default ImageSlider;
