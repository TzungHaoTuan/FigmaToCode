"use client";

import Link from "next/link";
import CollectionSkeleton from "./component/CollectionSkeleton";
import Collections from "./component/Collections";
import { useRouter, usePathname } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { State, Element } from "@/types";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { setCollection } from "@/store/collectionSlice";

interface CollectionFrames {
  [frameId: string]: { imagePath: string; children: Element[] };
}

async function getDocuments(uid: string) {
  const collectionFrames: CollectionFrames = {};

  const userRef = doc(db, "users", uid);
  const collectionsSnapshot = await getDocs(collection(userRef, "collection"));

  for (const collectionDoc of collectionsSnapshot.docs) {
    const pagesSnapshot = await getDocs(collection(collectionDoc.ref, "pages"));

    for (const pageDoc of pagesSnapshot.docs) {
      const framesQuery = query(
        collection(pageDoc.ref, "frames"),
        where("collected", "==", true)
      );
      const framesSnapshot = await getDocs(framesQuery);

      for (const frameDoc of framesSnapshot.docs) {
        const frameData = frameDoc.data();

        const childrenSnapshot = await getDocs(
          collection(frameDoc.ref, "children")
        );
        const childDocData: Element[] = childrenSnapshot.docs.map(
          (childDoc) => childDoc.data() as Element
        );
        collectionFrames[frameData.id] = {
          imagePath: frameData.storagePath,
          children: childDocData,
        };
      }
    }
  }
  return collectionFrames;
}

const Collection = () => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.user);
  const uid = user.profile.uid;
  const isLogin = user.profile.login;

  const userCollection: CollectionFrames = useSelector(
    (state: State) => state.collection.frames
  );

  useEffect(() => {
    if (!uid) return;
    const getColltionFrames = async () => {
      const collectionFrames = await getDocuments(uid);
      dispatch(setCollection(collectionFrames));
    };
    getColltionFrames();
  }, [uid]);

  const navigateToLogin = () => {
    router.push(`/profile?redirect=${pathname.slice(1)}`);
  };

  return (
    <div className="flex justify-center items-center w-screen min-h-screen bg-slate-900 py-48 px-36">
      {isLogin ? (
        <>
          {!userCollection ? (
            <div className="w-full text-white flex flex-col">
              <div className="inline-flex justify-center mb-8">Loading...</div>
              {Array.from({ length: 3 }, (_, index) => (
                <CollectionSkeleton key={index} />
              ))}
            </div>
          ) : Object.keys(userCollection).length === 0 ? (
            <div className="text-white flex flex-col">
              <div className="inline-flex justify-center mb-8">
                Currently no collections.
              </div>
              {Array.from({ length: 3 }, (_, index) => (
                <CollectionSkeleton key={index} />
              ))}
            </div>
          ) : (
            <Collections />
          )}
        </>
      ) : (
        <div className="flex flex-col justify-end items-center">
          <div className="text-white">Login to check collections!</div>
          <button
            onClick={navigateToLogin}
            className="w-20 h-10 text-white hover:text-violet-600 text-md font-bold
            bg-violet-600 hover:bg-white rounded-xl mt-4"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};
export default Collection;
