"use client";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import db from "../app/firebase/firebase";

import React from "react";

export default function Collect() {
  const getDocument = async () => {
    const docRef = doc(db, "products", "Top");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const getDocuments = async () => {
    const ref = collection(db, "products");
    const querySnapshot = await getDocs(ref);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    console.log(docs);
  };

  const addDocument = async () => {
    await setDoc(doc(db, "products", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    });
  };

  return (
    <div>
      <button
        onClick={addDocument}
        className="border-2 border-black rounded-xl text-black px-4"
      >
        Add to collection
      </button>
      {/* <button onClick={getDocuments}>getDoc</button> */}
    </div>
  );
}
