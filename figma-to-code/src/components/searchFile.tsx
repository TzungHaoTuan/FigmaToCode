"use client";
import { useState, useRef, SyntheticEvent } from "react";
import api from "@/app/utils/api";

export default function SearchFile() {
  // const token = process.env.FM_TOKEN as string;
  const token: string = "figd_EGQtzqG_ioIj1o80DEBr4edXVXvDgumg-2LRJdvq";
  const urlRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState();
  const [imagesData, setImagesData] = useState<ImageData[]>();
  const [pages, setPages] = useState(); // array of pages obj

  interface Image {
    page: string;
    id: string;
    url: string;
  }
  const [images, setImages] = useState<Image[]>([]); // array of pages array, pages array of frames

  async function fetchData(fileKey: string) {
    try {
      const data = await api.fetchData(token, fileKey);
      setData(data);
      console.log(data);
      console.log(data.document.children[0].children[0].children[0].children);

      return data;
    } catch {
      window.alert("Figma data not found!");
    }
  }

  async function fetchImageData(fileKey: string) {
    try {
      const data = await api.fetchImagesData(token, fileKey);
      // const imagesData = await data.meta.images;

      const imagesData: ImageData[] = [];
      imagesData.push(data.meta.images);
      setImagesData(imagesData);

      // setImagesData([imagesData]);
    } catch {
      window.alert("Figma imageData not found!");
    }
  }

  async function fetchImages(
    fileKey: string,
    pageName: string,
    imageIds: string[]
  ) {
    try {
      const data = await api.fetchImages(token, fileKey, imageIds);

      const images = imageIds.map((id) => {
        return { page: pageName, id: id, url: data.images[id] } as Image;
      });

      setImages((prev: Image[]) => [...prev, ...images]);
    } catch {}
  }

  async function handleFetch(e: SyntheticEvent) {
    e.preventDefault();
    // get fileKey
    const url = urlRef.current?.value as string | undefined;
    if (url !== undefined) {
      const fileStartIndex = url.indexOf("file/") + 5;
      const fileEndIndex = url.indexOf("/", fileStartIndex);
      const fileKey = url.substring(fileStartIndex, fileEndIndex);

      //get imageKey
      const imageSDatatartIndex = url.indexOf("node-id=") + 8;
      const imageEndIndex = url.indexOf("&", imageSDatatartIndex);
      const imageId = url.substring(imageSDatatartIndex, imageEndIndex);

      const data = await fetchData(fileKey);
      const pages = await data.document.children.map(
        (page: { id: string; name: string }) => ({
          id: page.id,
          name: page.name,
        })
      );
      setPages(pages);

      const pagesOfFrames = await data.document.children.map(
        (page: { name: string; children: { id: string }[] }) => ({
          pageName: page.name,
          frames: page.children.map((frame) => frame.id),
        })
      );
      await fetchImageData(fileKey);
      pagesOfFrames.map((page: { pageName: string; frames: string[] }) =>
        fetchImages(fileKey, page.pageName, page.frames)
      );
    }
  }
  return (
    <div className="w-full">
      <form onSubmit={handleFetch} className="w-1/2 flex ">
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
}
