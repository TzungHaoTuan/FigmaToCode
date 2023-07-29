"use client";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "@/app/firebase/firebase";

import { setLogin, setLogout } from "@/store/userSlice";

export default function FirebaseAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // 已登入
        const name = user.displayName;
        const email = user.email;
        const photo = user.photoURL;
        const uid = user.uid;

        console.log("isLogin");

        const payload: {
          name: string;
          email: string;
          uid: string;
          photo?: string;
        } = {
          name,
          email,
          uid,
        };

        if (photo) {
          payload.photo = photo;
        }

        dispatch(setLogin(payload));
      } else {
        dispatch(setLogout());

        console.log("isLogout");
      }
    });
  }, []);
  return <></>;
}
