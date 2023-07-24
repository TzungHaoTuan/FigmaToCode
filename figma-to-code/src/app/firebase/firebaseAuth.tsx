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
import { Provider } from "react-redux";

import store from "@/store/store";
import { setLogin, setLogout } from "@/store/userSlice";

export default function FirebaseAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // 已登入
        console.log(user.displayName, user.email);
        dispatch(
          setLogin({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
          })
        );
      } else {
        dispatch(setLogout());
        console.log("未登入");
      }
    });
  }, []);
  return <></>;
}
