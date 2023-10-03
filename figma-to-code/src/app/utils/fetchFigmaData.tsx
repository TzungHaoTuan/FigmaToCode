"use client";
import api from "@/app/utils/api";

const token = process.env.NEXT_PUBLIC_FM_TOKEN as string;

type PageData = {
  id: string;
  name: string;
  children: FrameData[];
};
type FrameData = {
  id: string;
  name: string;
  children: object[];
};
interface Page {
  id: string;
  name: string;
  children: Frames[];
}
interface Frames {
  id: string;
  name: string;
  children: object[];
}
interface Frame {
  page: string;
  frameId: string;
}
interface Images {
  [id: string]: string;
}
interface FrameImage {
  page: string;
  id: string;
  url: string;
}

const getFile = async (fileKey: string) => {
  try {
    const file = await api.fetchData(token, fileKey);
    return file;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getImages = async (fileKey: string): Promise<Images> => {
  try {
    const images = await api.fetchImages(token, fileKey);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return {};
  }
};

const getFrameImages = async (
  fileKey: string,
  frames: Frame[]
): Promise<FrameImage[]> => {
  try {
    const frameImages: FrameImage[] = [];
    await Promise.all(
      frames.map(async (frame: Frame) => {
        const images = await api.fetchFrameImages(
          token,
          fileKey,
          frame.frameId
        );
        const image = {
          page: frame.page,
          id: frame.frameId,
          url: images[frame.frameId],
        };
        frameImages.push(image);
      })
    );
    return frameImages;
  } catch (error) {
    console.error("Error fetching frame images:", error);
    throw error;
  }
};

export const handleFetch = async (url: string) => {
  if (!url) return;

  const fileStartIndex = url.indexOf("file/") + 5;
  const fileEndIndex = url.indexOf("/", fileStartIndex);
  const fileKey = url.substring(fileStartIndex, fileEndIndex);

  const file = await getFile(fileKey);
  const images = await getImages(fileKey);

  if (!file) return;
  const pages = file.document.children.map((page: PageData) => ({
    id: page.id,
    name: page.name,
    children: page.children.map((frame: FrameData) => ({
      id: frame.id,
      name: frame.name,
      children: frame.children,
    })),
  }));

  const frames = pages.flatMap((page: Page) =>
    page.children.map((frame: Frames) => ({
      page: page.name,
      frameId: frame.id,
    }))
  );
  const frameImages = await getFrameImages(fileKey, frames);

  const currentPage = pages[0].name;
  const currentFrame = {
    id: pages[0].children[0].id,
    name: pages[0].children[0].name,
  };

  return { file, pages, currentPage, currentFrame, frameImages, images};
};
