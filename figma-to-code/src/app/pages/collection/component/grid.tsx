import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  DocumentSnapshot,
} from "firebase/firestore";

import db from "@/app/firebase/firebase";

export default function Grid() {
  const [data, setData] = useState<any>();

  async function getDocument() {
    const productsSnapshot = await getDoc(doc(db, "products", "data2"));
    const productsData = productsSnapshot.data();
    console.log(productsData);

    const pagesRef = collection(productsSnapshot.ref, "pages");
    const pagesSnapshot = await getDocs(pagesRef);

    const pagesData = [];
    for (const pageDoc of pagesSnapshot.docs) {
      const pageData = pageDoc.data();
      pagesData.push(pageData);
    }
    console.log(pagesData);
  }

  useEffect(() => {
    getDocument();
  }, [db]);

  return (
    <div>
      {/* {data &&
        data.document.children.map((child: any) => {
          <div key={child.id}>{child.name}</div>;
        })} */}
    </div>
  );
}
