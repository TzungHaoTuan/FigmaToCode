"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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

const ImageSlider = () => {
  const pages = useSelector((state: PagesState) => state.pages.pages);
  const images = useSelector((state: ImagesState) => state.frameImages.images);

  const [currentPage, setCurrentPage] = useState<string>();
  const [currentFrame, setCurrentFrame] = useState<string>();

  // useEffect(() => {
  //   pages && setCurrentPage(pages[0].name);
  // }, []);

  const initialFrame = useSelector(
    (state: FrameState) => state.initialFrame.frame
  );

  console.log(pages);
  console.log(images);
  console.log(currentPage);
  console.log(initialFrame);
  const handlePage = (name: string): void => {
    setCurrentPage(name);
  };
  const handleFrame = (id: string): void => {
    setCurrentFrame(id);
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
        {pages && currentPage
          ? pages
              .filter((page) => page.name === currentPage)
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
      <div className="flex">
        {currentFrame && images.length !== 0
          ? images.map(
              (image) =>
                image.page === currentPage &&
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
          : images.length !== 0
          ? images.map(
              (image) =>
                image.id === initialFrame && (
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
