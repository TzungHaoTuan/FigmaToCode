import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
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
  const [collectionGrid, setCollectionGrid] = useState<any>([{ name: "Tuan" }]);
  const storage = getStorage();

  // console.log(userCollection);

  async function getDocument() {
    const productsSnapshot = await getDoc(doc(db, "products", "data"));
    const pagesSnapshot = await getDocs(
      collection(productsSnapshot.ref, "pages")
    );

    for (const pageDoc of pagesSnapshot.docs) {
      for (const eachCollection of userCollection) {
        const pageData = pageDoc.data();
        // console.log(pageData);
        if (pageData.pageName === eachCollection.page) {
          const framesSnapshot = await getDocs(
            collection(pageDoc.ref, "frames")
          );
          for (const frameDoc of framesSnapshot.docs) {
            const frameData = frameDoc.data();
            // console.log(frameData);

            if (frameData.id === eachCollection.frame) {
              const childrenSnapshot = await getDocs(
                collection(frameDoc.ref, "children")
              );
              // childrenSnapshot.forEach((childDoc) => {
              //   const childData = childDoc.data();
              // });
              // console.log(childrenSnapshot.docs);
              childrenSnapshot.docs.forEach((childDoc) => {
                const childData = childDoc.data();

                setCollectionGrid((prev: any) => [...prev, childData]);
              });
            }
          }

          // childrenSnapshot.forEach((child) => {
          //   childrenNames.push(child.data().name);
          // });
          // console.log(childrenNames);
        }
      }
    }

    // const documentRef = doc(db, "products", "LA");

    // getDoc(documentRef)
    //   .then((docSnapshot) => {
    //     if (docSnapshot.exists()) {
    //       const data = docSnapshot.data();

    //       // Retrieve the storagePath from the Firestore document
    //       const storagePath = data.storagePath;

    //       // Construct the download URL for the image
    //       const storageRef = ref(storage, storagePath);

    //       // Get the download URL
    //       getDownloadURL(storageRef)
    //         .then((downloadURL) => {
    //           console.log(downloadURL);
    //         })
    //         .catch((error) => {
    //           console.error("Error retrieving download URL:", error);
    //         });
    //     } else {
    //       console.log("Document does not exist");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error retrieving document:", error);
    //   });
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
  //   for (const pageDoc of pagesSnapshot.docs) {
  //     for (const eachCollection of collection) {
  //       if (eachCollection.page === pageDoc.data()) {
  //         console.log(pageDoc.data());
  //       }
  //     }
  //   }

  //   // const pagesData = [];
  //   // for (const pageDoc of pagesSnapshot.docs) {
  //   //   const pageData = pageDoc.data();
  //   //   pagesData.push(pageData);
  //   // }
  //   // console.log(pagesData);
  // }

  useEffect(() => {
    getDocument();
  }, []);

  // if (!collectionGrid) {
  //   return;
  // }
  // console.log(collectionGrid);
  // console.log(collectionGrid[0]?.name);

  return (
    <div>
      <div onClick={() => console.log(collectionGrid)}>Grid</div>
      {collectionGrid.map((child: any) => {
        <div key={child.id}>{child.name}</div>;
      })}
      <div>{collectionGrid[12]?.name}</div>
    </div>
  );
}
