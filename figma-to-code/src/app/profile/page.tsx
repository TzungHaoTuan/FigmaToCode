"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "@/store/userSlice";
import { setLogout } from "@/store/userSlice";

import Link from "next/link";

import { Provider } from "react-redux";
import store from "@/store/store";

import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "@/app/firebase/firebase";
import NewMain from "./component/newMain";

// import Main from "./component/main";
// import { signIn } from "@/app/utils/signIn";

function Profile() {
  // async function getSignInData() {
  //   const response = signIn();
  //   if (response) {
  //     console.log((await response).user.displayName);
  //     console.log((await response).user.email);
  //   }
  // }

  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential?.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  return (
    <Provider store={store}>
      <NewMain />

      {/* <Main />
      <button onClick={getSignInData}>sign in</button> */}

      {/* <form className="flex flex-col m-10">
        <input
          placeholder="email"
          className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <input
          placeholder="password"
          className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          sign up
        </button>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          login
        </button>
        <button className="mt-4 h-10 border-2 border-black rounded-xl text-black px-4">
          logout
        </button>
      </form> */}
    </Provider>
  );
}

export default Profile;
