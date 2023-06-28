"use client";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setFrame } from "@/store/frameSlice";
import { setPages } from "@/store/pagesSlice";
import { setFrameImages } from "@/store/imagesSlice";
import api from "@/app/utils/api";

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

const SearchForm = () => {
  const token = process.env.NEXT_PUBLIC_FM_TOKEN as string;
  // const token: string = "figd_EGQtzqG_ioIj1o80DEBr4edXVXvDgumg-2LRJdvq";
  const urlRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState();
  const [imagesData, setImagesData] = useState<ImageData[]>();
  // const [pages, setPages] = useState<Page[]>();
  // const [images, setImages] = useState<Image[]>([]);

  const dispatch = useDispatch();

  async function fetchData(fileKey: string) {
    try {
      const data = await api.fetchData(token, fileKey);
      setData(data);
      console.log(data);
      console.log(data.document.children[0].children[0].children[0].children);

      return data;
    } catch {}
  }

  async function fetchImageData(fileKey: string) {
    try {
      const data = await api.fetchImagesData(token, fileKey);
      const imagesData: ImageData[] = [];
      imagesData.push(data.meta.images);
      setImagesData(imagesData);
    } catch {}
  }

  async function fetchImages(fileKey: string, frames: any) {
    try {
      const images: object[] = [];
      await Promise.all(
        frames.map(async (frame: any) => {
          const data = await api.fetchImages(token, fileKey, frame.ids);
          const image = {
            page: frame.page,
            id: frame.ids,
            url: data.images[frame.ids],
          };
          images.push(image);
        })
      );

      dispatch(setFrameImages(images));
    } catch {}
  }

  const handleFetch = async (url: string) => {
    // get fileKey
    if (url) {
      const fileStartIndex = url.indexOf("file/") + 5;
      const fileEndIndex = url.indexOf("/", fileStartIndex);
      const fileKey = url.substring(fileStartIndex, fileEndIndex);

      //get imageKey
      const imageSDatatartIndex = url.indexOf("node-id=") + 8;
      const imageEndIndex = url.indexOf("&", imageSDatatartIndex);
      const imageId = url.substring(imageSDatatartIndex, imageEndIndex);

      const data = await fetchData(fileKey);
      const pages = await data.document.children.map(
        (page: { id: string; name: string; children: Frame[] }) => ({
          id: page.id,
          name: page.name,
          frames: page.children,
        })
      );
      // setPages(pages);
      dispatch(setPages(pages));
      dispatch(setFrame(pages[0].frames[0].id));

      const arrayOfPages: { page: string; ids: string[] }[] =
        await data.document.children.map(
          (page: {
            name: string;
            children: { name: string; id: string }[];
          }) => ({
            page: page.name,
            ids: page.children.map((frame) => frame.id),
          })
        );
      await fetchImageData(fileKey);

      const arrayOfFrames = arrayOfPages.flatMap(({ page, ids }) =>
        ids.map((id) => ({ page, ids: id }))
      );

      fetchImages(fileKey, arrayOfFrames);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = urlRef.current?.value;
    url && handleFetch(url);
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
