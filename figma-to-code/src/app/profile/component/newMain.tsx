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
import Image from "next/image";
import GoogleIcon from "../../icons/google.ico";
import userAvatar from "../../images/user.png";

function NewMain() {
  // const [userName, setUserName] = useState("");
  // const [userEmail, setUserEmail] = useState("");

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const isLogin = user.profile.login;

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // 已登入
        console.log(user);
        // setUserName(user.displayName);
        // setUserEmail(user.email);

        dispatch(
          setLogin({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
          })
        );
        const uid = user.uid;
        console.log(uid);
      } else {
        // 未登入
        // setUserName("");
        // setUserEmail("");
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
    <div className="w-screen h-screen">
      <div className="w-full h-full bg-color-ball flex justify-center">
        <div className="w-[440px] h-[440px]  bg-slate-700 shadow-[0_0px_100px_0px_rgba(255,255,255,0.3)] backdrop-blur-md backdrop-brightness-150  bg-opacity-10 rounded-3xl mt-28">
          {isLogin ? (
            <div className="w-full h-full text-white font-medium flex flex-col justify-center items-center ">
              <img
                src={user.profile.photo}
                className="rounded-full border-2 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white"
              />
              <div className="text-3xl font-bold mt-8">{user.profile.name}</div>
              <div className="text-lg tracking-wide mt-2">
                {user.profile.email}
              </div>
              <button
                onClick={() => handleSignOut(auth)}
                className="w-1/2 h-16 text-white font-bold text-lg border-2 border-white backdrop-brightness-0 opacity-60 rounded-xl mt-10"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  items-center rounded-xl">
              <Image
                alt="user avatar"
                src={userAvatar}
                className="w-24 h-24 rounded-full border-2 grayscale opacity-30 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white mt-10"
              />
              <input
                placeholder="Email"
                className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-xl focus:outline-none mt-8 px-8"
              ></input>
              <input
                placeholder="Password"
                className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-xl focus:outline-none mt-2 px-8"
              ></input>
              <button
                onClick={() => handleSignOut(auth)}
                className="w-2/3 h-12 text-white bg-rose-900 font-bold text-md border-2 border-white   rounded-xl mt-4"
              >
                Sign in
              </button>
              <button
                onClick={() => handleGoogleSignIn(auth)}
                className="relative w-2/3 h-12 flex justify-center items-center shadow-[0_0px_50px_-10px_rgba(255,255,255,0.1)] shadow-white drop-shadow-sm
                 bg-slate-900  	backdrop-brightness-0 border-2 border-white rounded-xl mt-2 px-8"
              >
                <Image
                  alt="google icon"
                  src={GoogleIcon}
                  className="absolute left-8 w-6 h-6 drop-shadow-sm	"
                />
                <div className="text-white font-bold text-md">
                  Sign in with Google
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewMain;
