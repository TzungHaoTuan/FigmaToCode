"use client";
import api from "@/app/utils/api";

const token = process.env.NEXT_PUBLIC_FM_TOKEN as string;

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

async function fetchData(fileKey: string) {
  try {
    const data = await api.fetchData(token, fileKey);
    // console.log(data);
    return data;
  } catch {}
}

async function fetchImages(fileKey: string) {
  try {
    const data = await api.fetchImages(token, fileKey);
    const images = [];
    images.push(data.meta.images);
    return images;
  } catch {}
}

async function fetchFrameImages(fileKey: string, frames: any) {
  try {
    const frameImages: object[] = [];
    await Promise.all(
      frames.map(async (frame: any) => {
        const data = await api.fetchFrameImages(token, fileKey, frame.ids);
        const image = {
          page: frame.page,
          id: frame.ids,
          url: data.images[frame.ids],
        };
        frameImages.push(image);
      })
    );
    return frameImages;
  } catch {}
}

export const handleFetch = async (url: string) => {
  if (url) {
    const fileStartIndex = url.indexOf("file/") + 5;
    const fileEndIndex = url.indexOf("/", fileStartIndex);
    const fileKey = url.substring(fileStartIndex, fileEndIndex);

    //get imageKey
    // const imageStartIndex = url.indexOf("node-id=") + 8;
    // const imageEndIndex = url.indexOf("&", imageStartIndex);
    // const imageId = url.substring(imageStartIndex, imageEndIndex);

    const data = await fetchData(fileKey);
    const images = await fetchImages(fileKey);

    const arrayOfPages: { page: string; ids: string[] }[] =
      await data.document.children.map(
        (page: { name: string; children: { name: string; id: string }[] }) => ({
          page: page.name,
          ids: page.children.map((frame) => frame.id),
        })
      );
    const arrayOfFrames = arrayOfPages.flatMap(({ page, ids }) =>
      ids.map((id) => ({ page, ids: id }))
    );
    const frameImages = await fetchFrameImages(fileKey, arrayOfFrames);

    const pages = await data.document.children.map(
      (page: { id: string; name: string; children: Frame[] }) => ({
        id: page.id,
        name: page.name,
        frames: page.children,
      })
    );
    const currentPage = await pages[0].name;
    const currentFrame = await {
      id: pages[0].frames[0].id,
      name: pages[0].frames[0].name,
    };

    return { data, pages, currentPage, currentFrame, frameImages, images };
  }
};
