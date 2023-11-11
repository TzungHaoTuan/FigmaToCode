"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import isLogOutAvatar from "../../images/user.png";
import { useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Collection from "./Collection";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

import { db } from "@/app/firebase/firebase";
import { Tab } from "@headlessui/react";

import ConvertToTai from "@/app/utils/convertToTai";
import ConvertToSCTag from "@/app/utils/convertToSCTag";
import ConvertToSCStyle from "@/app/utils/convertToSCStyle";
import HighLight from "@/components/highLight";

import { State, Element, CollectionFrames, ConvertedFrames } from "@/types";

const Collections: React.FC = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [styleCopied, setStyleCopied] = useState<string>("");
  const [collectedFrames, setCollectedFrames] = useState<ConvertedFrames>({});

  const taiRef = useRef<HTMLDivElement>(null);
  const scTagRef = useRef<HTMLDivElement>(null);
  const scStyleRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const storage = getStorage();

  const user = useSelector((state: State) => state.user);
  const isLogin = user?.profile.login;
  const uid = user?.profile.uid;

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
        convertedFrames[frameId] = {
          imageUrl: null,
          tailwind: ConvertToTai(children),
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

  const handleCopied = (style: string) => {
    setIsCopied((prevState) => !prevState);
    setStyleCopied(style);
    setTimeout(() => {
      setIsCopied(false);
      setStyleCopied("");
    }, 1000);

    switch (style) {
      case "taiRef":
        {
          taiRef.current &&
            navigator.clipboard.writeText(taiRef.current.innerText);
        }
        break;
      case "scTagRef":
        {
          scTagRef.current &&
            navigator.clipboard.writeText(scTagRef.current.innerText);
        }
        break;
      case "scStyleRef":
        {
          scStyleRef.current &&
            navigator.clipboard.writeText(scStyleRef.current.innerText);
        }
        break;
    }
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  let [categories] = useState({
    Tailwind: [{}],
    ["Styled Component"]: [{}],
  });

  return (
    <>
      {Object.entries(collectedFrames).map(([frameId, frameData]) => (
        <Collection key={frameId} frameData={frameData} />
      ))}
    </>
  );
};
export default Collections;
