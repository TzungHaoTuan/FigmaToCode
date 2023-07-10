"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "@/store/userSlice";
import { setLogout } from "@/store/userSlice";

import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import store from "@/store/store";

import { app } from "@/app/firebase/firebase";

function NewMain() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // 已登入
        setUserName(user.displayName);
        setUserEmail(user.email);
        dispatch(
          setLogin({
            name: user.displayName,
            email: user.email,
          })
        );
        const uid = user.uid;
        console.log(uid);
      } else {
        // 未登入
        setUserName("");
        setUserEmail("");
        dispatch(setLogout());

        console.log("未登入");
      }
    });
    console.log(user);
  }, []);

  const handleGoogleSignIn = async (auth: any) => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        // 登入成功，取得 token、user
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        // console.log(token);
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode);
        console.log(errorMessage);
        console.log(credential);
      });
  };

  const handleSignOut = async (auth: any) => {
    await signOut(auth)
      .then(() => {
        // 登出成功
      })
      .catch((error) => {
        // error
      });
  };

  return (
    <div>
      <div>{user.profile.name}</div>
      <div>{user.profile.email}</div>
      <button onClick={() => handleGoogleSignIn(auth)}>
        Sign in with Google
      </button>
      <button onClick={() => handleSignOut(auth)}>Sign out</button>
    </div>
  );
}

export default NewMain;
