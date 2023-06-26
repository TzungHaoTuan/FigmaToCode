"use client";
import { useState, useRef, SyntheticEvent } from "react";
import api from "@/app/utils/api";
import SearchForm from "@/components/searchForm";
import ImageSlider from "@/components/imageSlider";
const Home: React.FC = () => {
  // const token = process.env.FM_TOKEN as string;
  const token: string = "figd_EGQtzqG_ioIj1o80DEBr4edXVXvDgumg-2LRJdvq";
  const urlRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState();
  const [imagesData, setImagesData] = useState<ImageData[]>();
  const [pages, setPages] = useState<Page[]>();

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
  const [images, setImages] = useState<Image[]>([]); // array of pages array, pages array of Images

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
    pages: string,
    frames: string[],
    imageIds: string[]
  ) {
    try {
      const data = await api.fetchImages(token, fileKey, imageIds);

      const images = imageIds.map((id) => {
        return {
          page: pages,
          frame: frames,
          id: id,
          url: data.images[id],
        } as Image;
      });
      console.log(images);
      setImages((prev: Image[]) => [...prev, ...images] as Image[]);
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
      setPages(pages);

      const pagesOfImages = await data.document.children.map(
        (page: { name: string; children: { name: string; id: string }[] }) => ({
          pages: page.name,
          frames: page.children.map((Image) => Image.name),
          Images: page.children.map((Image) => Image.id),
        })
      );
      await fetchImageData(fileKey);
      pagesOfImages.map(
        (page: { pages: string; frames: string[]; Images: string[] }) =>
          fetchImages(fileKey, page.pages, page.frames, page.Images)
      );
    }
  };

  return (
    <div>
      <SearchForm handleFetch={handleFetch} />
      {pages && <ImageSlider pages={pages} images={images} />}
    </div>
  );
};
export default Home;
