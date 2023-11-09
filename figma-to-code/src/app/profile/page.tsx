"use client";

import ReduxProvider from "@/redux/reduxProvider";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import nativeSignUp from "./component/nativeSignUp";
import nativeSignIn from "./component/nativeSignIn";

import {
  Auth,
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { app } from "@/app/firebase/firebase";
import Image from "next/image";
import GoogleIcon from "../icons/google.ico";
import isLogOutAvatar from "../images/user.png";

import { State } from "@/types";

export default function Profile() {
  const auth = getAuth(app);

  const [isSignUp, setIsSignUp] = useState(true);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("user@gmail.com");
  const [signInPassword, setSignInPassword] = useState("user12345");

  const user = useSelector((state: State) => state.user);
  const photo = user?.profile.photo;
  const isLogin = user?.profile.login;

  const handleSignUpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    nativeSignUp(auth, signUpName, signUpEmail, signUpPassword);
  };

  const handleSignInSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    nativeSignIn(auth, signInEmail, signInPassword);
  };

  const handleGoogleSignIn = async (auth: Auth) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        if ("code" in error) {
          const errorCode = error.code;
          const credential = GoogleAuthProvider.credentialFromError(
            error as FirebaseError
          ); // Here's the type assertion
        }
        throw new Error(errorMessage);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  };

  const handleSignOut = async (auth: Auth) => {
    await signOut(auth);
  };

  return (
    <ReduxProvider>
      <div className="w-screen h-screen">
        <div className="w-full h-full bg-color-ball flex justify-center items-center">
          <div className="w-[600px] h-[600px]  bg-slate-700 shadow-[0_0px_100px_0px_rgba(255,255,255,0.3)] backdrop-blur-md backdrop-brightness-150  bg-opacity-10 rounded-full">
            {isLogin ? (
              <div className="w-full h-full text-white font-medium flex flex-col justify-center items-center ">
                {photo ? (
                  <img
                    alt="user avatar"
                    src={photo}
                    className="w-24 h-24 rounded-full border-2  opacity-90 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white mt-10"
                  />
                ) : (
                  <Image
                    placeholder="blur"
                    alt="user avatar"
                    src={isLogOutAvatar}
                    width={96}
                    height={96}
                    className="rounded-full border-2  opacity-90 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white mt-10"
                  />
                )}

                <div className="text-3xl font-bold mt-8">
                  {user.profile.name}
                </div>
                <div className="text-lg tracking-wide mt-2">
                  {user.profile.email}
                </div>
                <button
                  onClick={() => handleSignOut(auth)}
                  className="w-1/2 h-16 text-white font-bold text-lg border-2 border-white backdrop-brightness-0 opacity-80 rounded-full mt-10"
                >
                  Sign out
                </button>
              </div>
            ) : isSignUp ? (
              <div className="w-full h-full flex flex-col  items-center">
                <form
                  name="sign in"
                  onSubmit={handleSignInSubmit}
                  className="w-full flex flex-col items-center"
                >
                  <Image
                    alt="user avatar"
                    src={isLogOutAvatar}
                    className="w-24 h-24 rounded-full border-2 grayscale opacity-30 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white mt-20"
                  />
                  <input
                    name="sign in email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-full focus:outline-none mt-8 px-8"
                  ></input>
                  <input
                    name="sign in password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-full focus:outline-none mt-4 px-8"
                  ></input>
                  <button
                    type="submit"
                    className="w-2/3 h-12 text-white bg-rose-900 font-bold text-md border-2 border-white   rounded-full mt-4"
                  >
                    Sign In
                  </button>
                </form>
                <button
                  onClick={() => handleGoogleSignIn(auth)}
                  className="relative w-2/3 h-12 flex justify-center items-center shadow-[0_0px_50px_-10px_rgba(255,255,255,0.1)] shadow-white drop-shadow-sm
                 bg-slate-900  	backdrop-brightness-0 border-2 border-white rounded-full mt-4 px-8"
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
                <div className="flex items-center mt-4">
                  <div className="text-rose-900 opacity-50">
                    Don't have an account?
                  </div>
                  <div
                    onClick={() => setIsSignUp((prev) => !prev)}
                    className="cursor-pointer font-bold text-rose-900 ml-4"
                  >
                    Sign Up
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col  items-center">
                <form
                  name="sign up"
                  onSubmit={handleSignUpSubmit}
                  className="w-full flex flex-col items-center"
                >
                  <Image
                    alt="user avatar"
                    src={isLogOutAvatar}
                    className="w-24 h-24 rounded-full border-2 grayscale opacity-30 shadow-[0_0px_30px_0px_rgba(255,255,255,1)] shadow-white mt-20"
                  />
                  <input
                    name="sign up name"
                    placeholder="name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-full focus:outline-none mt-8 px-8"
                  ></input>
                  <input
                    name="sign up email"
                    type="email"
                    placeholder="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-full focus:outline-none mt-4 px-8"
                  ></input>
                  <input
                    name="sign up password"
                    type="password"
                    placeholder="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    className="w-2/3 h-12 border-2 border-white backdrop-brightness-0 bg-slate-50 rounded-full focus:outline-none mt-4 px-8"
                  ></input>
                  <button
                    type="submit"
                    className="w-2/3 h-12 text-white bg-rose-900 font-bold text-md border-2 border-white rounded-full mt-4"
                  >
                    Sign Up
                  </button>
                </form>
                <div className="flex items-center mt-4">
                  <div className="text-rose-900 opacity-50">
                    Already have an account?
                  </div>
                  <div
                    onClick={() => setIsSignUp((prev) => !prev)}
                    className="cursor-pointer font-bold text-rose-900 ml-4"
                  >
                    Sign In
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
}
