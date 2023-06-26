"use client";
import React, { useState } from "react";

interface Image {
  page: string;
  frame: string[];
  id: string;
  url: string;
}
interface Frame {
  id: string;
  name: string;
}
interface Page {
  id: string;
  name: string;
  frames: Frame[];
}

interface ImageSliderProps {
  pages: Page[];
  images: Image[];
}
const ImageSlider: React.FC<ImageSliderProps> = ({ pages, images }) => {
  const [currentPage, setCurrentPage] = useState<string>(pages[0].name);
  const defaultFrame = images[0];

  const [currentFrame, setCurrentFrame] = useState<string>(
    pages[0].frames[0].id
  );

  console.log(defaultFrame);
  console.log(pages);

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
        {pages &&
          pages
            .filter((page) => page.name === currentPage)[0]
            .frames.map((frame) => (
              <div key={frame.id} onClick={() => handleFrame(frame.id)}>
                {frame.name}
              </div>
            ))}
      </div>
      <div className="flex">
        {pages &&
          images &&
          images
            .filter((image) => image.page === currentPage)
            .filter((image) => image.id === currentFrame)
            .map((image) => (
              <div key={image.id}>
                <img
                  key={image.id}
                  src={image.url}
                  alt="ImageImage"
                  className="max-h-96"
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default ImageSlider;
