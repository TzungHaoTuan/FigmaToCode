"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Collection from "./Collection";
import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
import { State, CollectionFrames, ConvertedFrames } from "@/types";

const Collections: React.FC = () => {
  const [collectedFrames, setCollectedFrames] = useState<ConvertedFrames>({});
  const storage = getStorage();

  const userCollection: CollectionFrames = useSelector(
    (state: State) => state.collection.frames
  );

  const handleConvertCode = (
    collectedFrames: CollectionFrames
  ): ConvertedFrames => {
    const convertedFrames: ConvertedFrames = {};
    for (const frameId in collectedFrames) {
      if (collectedFrames.hasOwnProperty(frameId)) {
        const children = collectedFrames[frameId].children;
        const frameXY = [
          collectedFrames[frameId].absoluteBoundingBox.x,
          collectedFrames[frameId].absoluteBoundingBox.y,
        ];
        const justifyContent = collectedFrames[frameId].primaryAxisAlignItems;

        convertedFrames[frameId] = {
          imageUrl: null,
          tailwind: ConvertToTai(children, frameXY, justifyContent),
          styledComponentsTag: ConvertToSCTag(children),
          styledComponentsStyle: ConvertToSCStyle(children),
        };
      }
    }
    return convertedFrames;
  };

  const updateImageUrls = async (collectedFrames: CollectionFrames) => {
    const imagePromises = Object.entries(collectedFrames).map(
      async ([frameId, frameData]) => {
        if (frameData.imagePath) {
          try {
            const imageUrl = await getDownloadURL(
              ref(storage, frameData.imagePath)
            );
            return { frameId, imageUrl };
          } catch (error) {
            console.error("Error retrieving download URL:", error);
            return { frameId, imageUrl: null };
          }
        }
        return { frameId, imageUrl: null };
      }
    );

    const images = await Promise.all(imagePromises);
    setCollectedFrames((prevFrames) => {
      const newFrames = { ...prevFrames };
      images.forEach(({ frameId, imageUrl }) => {
        if (newFrames[frameId]) {
          newFrames[frameId].imageUrl = imageUrl;
        }
      });
      return newFrames;
    });
  };

  useEffect(() => {
    if (userCollection) {
      const initialFrames = handleConvertCode(userCollection);
      setCollectedFrames(initialFrames);
      updateImageUrls(userCollection);
    }
  }, [userCollection]);

  return (
    <div className="flex flex-col w-full">
      {Object.entries(collectedFrames).map(([frameId, frameData]) => (
        <Collection key={frameId} frameData={frameData} />
      ))}
    </div>
  );
};
export default Collections;
