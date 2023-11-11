"use client";
// import { Provider } from "react-redux";
// import store from "@/store/store";
import CollectionSkeleton from "./component/CollectionSkeleton";
import Grid from "./component/Collections";
// async function getMovies() {
//   let res = await fetch("https://dogapi.dog/api/v2/breeds");
//   return res.json();
// }
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { State, Element } from "@/types";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect, useId } from "react";
import { setCollected } from "@/store/collectSlice";
import { setCollection } from "@/store/collectionSlice";
// const getDoc = async () => {
//   const querySnapshot = await getDocs(collection(db, "users"));
//   return querySnapshot.docs.map((doc) => doc.data());
// };
// const getUserId = () => {
//   const user = useSelector((state: State) => state.user);
//   const isLogin = user?.profile.login;
//   const uid = user?.profile.uid;
//   return uid;
// };

// import { collection, doc, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/app/firebase/firebase";
// import { Tab } from "@headlessui/react";
// import { State, Element } from "@/types";
// import { auth } from "@/app/firebase/firebase";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { cookies } from "next/headers";

// interface CollectionFrames {
//   [frameId: string]: { imagePath: string; children: Element[] };
// }
// const uid = cookies().get("uid")
// const uid = onAuthStateChanged(auth, (user) => {
//   user?.uid
// })

// const handleDocuments = async () => {
//   const results = await getDocuments(uid);
//   return Object.values(results)[0].imagePath;
// };

// async function getDocuments(uid: string) {
//   const collectionFrames: CollectionFrames = {};

//   const userRef = doc(db, "users", uid);
//   const collectionsSnapshot = await getDocs(collection(userRef, "collection"));

//   for (const collectionDoc of collectionsSnapshot.docs) {
//     const pagesSnapshot = await getDocs(collection(collectionDoc.ref, "pages"));

//     for (const pageDoc of pagesSnapshot.docs) {
//       const framesQuery = query(
//         collection(pageDoc.ref, "frames"),
//         where("collected", "==", true)
//       );
//       const framesSnapshot = await getDocs(framesQuery);

//       for (const frameDoc of framesSnapshot.docs) {
//         const frameData = frameDoc.data();

//         const childrenSnapshot = await getDocs(
//           collection(frameDoc.ref, "children")
//         );
//         const childDocData: Element[] = childrenSnapshot.docs.map(
//           (childDoc) => childDoc.data() as Element
//         );
//         collectionFrames[frameData.id] = {
//           imagePath: frameData.storagePath,
//           children: childDocData,
//         };
//       }
//     }
//   }
//   return collectionFrames;
// }

interface CollectionFrames {
  [frameId: string]: { imagePath: string; children: Element[] };
}

// useEffect(() => {
//   fetchCollectionFrames();
// }, [uid]);

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
  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.user);
  const uid = user.profile.uid;

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

  return (
    <div className="bg-slate-900 w-screen min-h-screen py-48 px-36">
      <div className="bg-opacity-20 rounded-3xl backdrop-blur backdrop-brightness-110">
        {!userCollection ? (
          <div className="text-white flex flex-col">
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
          <Grid />
        )}
      </div>
    </div>
  );
};
export default Collection;
