"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCollection } from "@/store/collectionSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../app/firebase/firebase";
import { app } from "@/app/firebase/firebase";

import { setCollect } from "@/store/collectSlice";
import { setCollected } from "@/store/collectSlice";

export default function Collect() {
  const data = useSelector((state: any) => state.figmaData.data);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const userCollection = useSelector((state: any) => state.collection.frames);
  const frameImages = useSelector((state: any) => state.frameImages.images);
  const tags = useSelector((state: any) => state.tag.tags);
  const isCollecting = useSelector((state: any) => state.collect.isCollecting);

  const dispatch = useDispatch();
  const storage = getStorage();

  const auth = getAuth(app);
  const user = useSelector((state: any) => state.user);
  const isLogin = user?.profile.login;
  const uid = user?.profile.uid;
  const userName = user?.profile.name;

  useEffect(() => {
    user.profile.uid ? console.log(user.profile.uid) : console.log("Not login");
    // onAuthStateChanged(auth, (user: any) => {
    //   if (user) {
    //     // 已登入
    //     console.log(user);
    //     const uid = user.uid;
    //     console.log(uid);
    //   } else {
    //     console.log("未登入");
    //   }
    // });
  }, [isLogin]);
  // const uid = onAuthStateChanged(auth, (user: any) => user.id);

  const handleCollection = async () => {
    if (isLogin && data) {
      dispatch(setCollect());

      await frameImages
        .filter((image: any) => image.id === currentFrame)
        .map((image: any) =>
          uploadImage(
            image.id,
            "https://corsproxy.io/?" + encodeURIComponent(image.url)
          )
        );
      await handleCollectionState();
    }
  };

  const handleCollectionState = async () => {
    dispatch(
      setCollection([
        { name: data.name, page: currentPage, frame: currentFrame },
      ])
    );
  };

  const addDocument = async (imageId: any, snapshot: any) => {
    console.log("start writing data");
    const storagePath = snapshot.ref.fullPath;

    const usersRef = doc(db, "users", uid);
    await setDoc(usersRef, {
      name: userName,
    });

    const collectionRef = collection(usersRef, "collection");
    const collectionDocRef = doc(collectionRef, data.name);
    await setDoc(doc(collectionRef, data.name), {
      project: data.name,
    });

    // Create the "pages" subcollection and inside
    const pagesRef = collection(collectionDocRef, "pages");
    const pagesPromises = data.document.children.map(async (page: any) => {
      await setDoc(doc(pagesRef, page.name), { pageName: page.name });

      const pageRef = doc(pagesRef, page.name);
      const framesRef = collection(pageRef, "frames");
      const framesPromises = page.children.map(async (frame: any) => {
        // await setDoc(doc(framesRef, frame.name), { id: frame.id });

        const frameDocRef = doc(framesRef, frame.name);
        const frameDocSnapshot = await getDoc(frameDocRef);
        const frameData = frameDocSnapshot.data();

        if (frame.id === currentFrame) {
          await setDoc(frameDocRef, {
            ...frameData,
            id: frame.id,
            collected: true,
            storagePath: storagePath,
          });
        } else {
          await setDoc(frameDocRef, {
            ...frameData,
            id: frame.id,
          });
        }

        const frameRef = doc(framesRef, frame.name);
        const childrenRef = collection(frameRef, "children");
        const childrenPromises = frame.children.map((child: any) => {
          return setDoc(doc(childrenRef, child.name), { children: child });
        });

        return Promise.all(childrenPromises);
      });

      return Promise.all(framesPromises);
    });
    await Promise.all(pagesPromises);
    if (Object.keys(tags).length !== 0) {
      await handleTag();
    }
    dispatch(setCollect());
    dispatch(setCollected(true));
    console.log("Finish writing data");
  };

  const handleTag = async () => {
    const usersRef = doc(db, "users", uid);
    const collectionRef = collection(usersRef, "collection");
    const collectionSnapshot = await getDocs(collectionRef);

    const collectionPromises = collectionSnapshot.docs.map(
      async (collectionDoc) => {
        const pagesRef = collection(collectionDoc.ref, "pages");
        const pagesSnapshot = await getDocs(pagesRef);

        const pagesPromises = pagesSnapshot.docs.map(async (pageDoc) => {
          const framesRef = collection(pageDoc.ref, "frames");
          const framesSnapshot = await getDocs(framesRef);

          const framesPromises = framesSnapshot.docs.map(async (frameDoc) => {
            const childrenRef = collection(frameDoc.ref, "children");
            const childrenSnapshot = await getDocs(childrenRef);

            const childrenPromises = childrenSnapshot.docs.map(
              async (childDoc) => {
                const childDocObj = childDoc.data().children;
                const childrenArray = childDocObj.children;

                if (childrenArray) {
                  const childrenArrayInside = childrenArray[1]?.children;
                  if (childrenArrayInside) {
                    for (const child of childrenArrayInside) {
                      if (tags[child.id]) {
                        child.name = tags[child.id];
                      }
                      await updateDoc(childDoc.ref, { children: childDocObj });
                    }
                  }
                }
              }
            );

            await Promise.all(childrenPromises); //

            await Promise.all(childrenPromises);
          });

          await Promise.all(framesPromises);
        });

        await Promise.all(pagesPromises);
      }
    );

    await Promise.all(collectionPromises);
  };

  const newhandleTag = async (tag: any) => {
    console.log(tag);
    const usersRef = doc(db, "users", uid);
    const collectionRef = collection(usersRef, "collection");
    const collectionSnapshot = await getDocs(collectionRef);
    const pagesRef = collection(collectionRef, "pages");
    const pagesSnapshot = await getDocs(pagesRef);

    const firstPageDoc = pagesSnapshot.docs[0];
    const framesRef = collection(firstPageDoc.ref, "frames");
    const framesSnapshot = await getDocs(framesRef);

    const firstFrameDoc = framesSnapshot.docs[1];
    const childrenRef = collection(firstFrameDoc.ref, "children");
    const childrenSnapshot = await getDocs(childrenRef);

    const firstChildDoc = childrenSnapshot.docs[2];
    const childrenData = firstChildDoc.data();
    console.log(childrenData);
    const children = childrenData.children;
    children.children[0].name = "Image";
    await updateDoc(firstChildDoc.ref, { children: children });
    // if (childrenData && childrenData.children) {
    //   const children = childrenData.children;
    //   children[1].children[0].name = tag["103:157"];
    //   await updateDoc(firstChildDoc.ref, { children: children });
    // }
  };

  // const handleTag = async (tags: any) => {
  //   const productsRef = doc(db, "products", "data");
  //   const pagesRef = collection(productsRef, "pages");
  //   const pagesSnapshot = await getDocs(pagesRef);

  //   await Promise.all(
  //     pagesSnapshot.docs.map(async (pageDoc) => {
  //       const framesRef = collection(pageDoc.ref, "frames");
  //       const framesSnapshot = await getDocs(framesRef);

  //       await Promise.all(
  //         framesSnapshot.docs.map(async (frameDoc) => {
  //           const childrenRef = collection(frameDoc.ref, "children");
  //           const childrenSnapshot = await getDocs(childrenRef);

  //           await Promise.all(
  //             childrenSnapshot.docs.map(async (childDoc) => {
  //               const children = childDoc.data().children;

  //               children.forEach(async (child: any) => {
  //                 if (tags[child.id]) {
  //                   child.name = tags[child.id];

  //                   const myDoc = childDoc;
  //                   await updateDoc(myDoc.ref, { children: children });
  //                 }
  //               });
  //             })
  //           );
  //         })
  //       );
  //     })
  //   );
  // };

  async function uploadImage(imageId: any, imageUrl: any) {
    try {
      const blob = await loadImageAsBlob(imageUrl);
      const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
      await uploadBytes(storageRef, blob as Blob)
        // Store the path in Firestore
        .then(async (snapshot) => {
          await addDocument(imageId, snapshot);
          console.log("Successful upload the Blob!");
          // await storeImagePath(imageId, snapshot);
        });
    } catch (error) {
      console.error("Failed to compress image:", error);
      throw error;
    }
  }

  function loadImageAsBlob(imageUrl: any) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", imageUrl, true);
      xhr.responseType = "blob";

      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response;
          resolve(blob);
        } else {
          reject(
            new Error(
              `Failed to fetch image (${xhr.status}): ${xhr.statusText}`
            )
          );
        }
      };

      xhr.onerror = function () {
        reject(new Error("Failed to fetch image"));
      };

      xhr.send();
    });
  }

  // async function storeImagePath(imageId: any, snapshot: any) {
  //   const storagePath = snapshot.ref.fullPath;

  //   const productsRef = doc(db, "products", "data");
  //   const pagesRef = collection(productsRef, "pages");
  //   const pagesSnapshot = await getDocs(pagesRef);
  //   pagesSnapshot.forEach(async (pageDoc) => {
  //     const framesRef = collection(pageDoc.ref, "frames");
  //     const framesSnapshot = await getDocs(framesRef);
  //     framesSnapshot.forEach(async (frameDoc) => {
  //       if (frameDoc.data().id === imageId) {
  //         await updateDoc(frameDoc.ref, { storagePath });
  //       }
  //     });
  //   });
  // }

  // async function compressImage(imageUrl: any) {
  //   const blob = await fetch(imageUrl).then((response) => response.blob());
  //   return blob;
  // }
  // async function uploadImage(imageId: any, imageUrl: any) {
  //   // Compress the image
  //   const blob = await compressImage(imageUrl);

  //   // Upload the image
  //   const storageRef = ref(storage, `images/frames/${imageId}.jpg`);
  //   uploadBytes(storageRef, blob)
  //     // Store the path in Firestore
  //     .then(async (snapshot) => {
  //       // await storeImagePath(imageId, snapshot);
  //     });
  // }

  return (
    <div className="w-full flex justify-center items-center mt-[56px] px-16">
      <button
        onClick={handleCollection}
        className="w-full h-12 flex justify-center items-center bg-slate-100  text-2xl font-bold  rounded-xl px-4"
      >
        {isCollecting ? (
          <div className="relative w-6 h-6 animate-spin rounded-full bg-gradient-to-r from-indigo-600  to-pink-600 ">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-100 rounded-full border-2 border-white"></div>
          </div>
        ) : (
          ""
        )}
        <div
          className={`${
            isCollecting ? " text-pink-600" : " text-indigo-600"
          } ml-4`}
        >
          {isCollecting ? "Collecting..." : "Add to collection"}
        </div>
      </button>
    </div>
  );
}
