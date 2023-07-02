"use client";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCollection } from "@/store/collectionSlice";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../app/firebase/firebase";

export default function Collect() {
  const data = useSelector((state: any) => state.figmaData.data);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const userCollection = useSelector((state: any) => state.collection.frames);

  const dispatch = useDispatch();

  const handleCollection = () => {
    handleCollectionState();
    addDocument();
  };

  const handleCollectionState = () => {
    dispatch(setCollection([{ page: currentPage, frame: currentFrame }]));
  };

  const getDocuments = async () => {
    const ref = collection(db, "products");
    const querySnapshot = await getDocs(ref);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    console.log(docs);

    await deleteDoc(doc(db, "products", "data2"));
  };

  const addDocument = async () => {
    const productsRef = doc(db, "products", "data2");

    // Create the main document
    await setDoc(productsRef, {
      name: data.name,
    });

    // Create the "pages" subcollection and inside
    const pagesRef = collection(productsRef, "pages");

    await data.document.children.map(async (page: any) => {
      setDoc(doc(pagesRef, page.name), { pageName: page.name });

      const pagesSnapshot = await getDocs(pagesRef);
      pagesSnapshot.forEach(async (pageDoc) => {
        const framesRef = collection(pageDoc.ref, "frames");
        await page.children.map(async (frame: any) => {
          setDoc(doc(framesRef, frame.name), { id: frame.id });

          const framesSnapshot = await getDocs(framesRef);
          framesSnapshot.forEach(async (frameDoc) => {
            const childrenRef = collection(frameDoc.ref, "children");
            await frame.children.map((child: any) => {
              setDoc(doc(childrenRef, child.name), child);
            });
          });
        });
      });
    });
  };

  return (
    <div>
      <button
        onClick={handleCollection}
        className="border-2 border-black rounded-xl text-black px-4"
      >
        Add to collection
      </button>
      <button
        onClick={getDocuments}
        className="border-2 border-black rounded-xl text-black px-4"
      >
        get aand delete Doc
      </button>
    </div>
  );
}
