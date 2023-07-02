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
  query,
  where,
} from "firebase/firestore";

import { db } from "@/app/firebase/firebase";

export default function Grid() {
  const userCollection = useSelector((state: any) => state.collection.frames);
  console.log(userCollection);
  const [data, setData] = useState<any>();

  async function getDocument() {
    const productsSnapshot = await getDoc(doc(db, "products", "data2"));

    const pagesSnapshot = await getDocs(
      collection(productsSnapshot.ref, "pages")
    );

    for (const pageDoc of pagesSnapshot.docs) {
      const pageData = pageDoc.data();
      console.log(pageData);
      if (pageData.pageName === userCollection[0].page) {
        const framesSnapshot = await getDocs(collection(pageDoc.ref, "frames"));
        for (const frameDoc of framesSnapshot.docs) {
          const frameData = frameDoc.data();
          // console.log(frameData);

          const childrenSnapshot = await getDocs(
            collection(frameDoc.ref, "children")
          );
          childrenSnapshot.forEach((childDoc) => {
            const childData = childDoc.data();
            console.log(childData.name);
          });
        }

        // childrenSnapshot.forEach((child) => {
        //   childrenNames.push(child.data().name);
        // });
        // console.log(childrenNames);
      }
    }
  }

  // async function getDocument() {
  //   const productsSnapshot = await getDoc(doc(db, "products", "data2"));
  //   const productsData = productsSnapshot.data();
  //   console.log(productsData);

  //   const pagesRef = collection(productsSnapshot.ref, "pages");
  //   const pagesSnapshot = await getDocs(pagesRef);
  //   console.log(pagesSnapshot.docs.forEach((doc) => doc.data()));

  //   const q = query(
  //     collection(db, "pages"),
  //     where("pageName", "==", userCollection.page)
  //   );
  //   // for (const pageDoc of pagesSnapshot.docs) {
  //   //   for (const eachCollection of collection) {
  //   //     if (eachCollection.page === pageDoc.data()) {
  //   //       console.log(pageDoc.data());
  //   //     }
  //   //   }
  //   // }

  //   // const pagesData = [];
  //   // for (const pageDoc of pagesSnapshot.docs) {
  //   //   const pageData = pageDoc.data();
  //   //   pagesData.push(pageData);
  //   // }
  //   // console.log(pagesData);
  // }

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
