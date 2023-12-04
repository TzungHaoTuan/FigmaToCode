"use client";

import ReduxProvider from "@/redux/reduxProvider";
import { useState, FormEvent, useEffect } from "react";
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
import { useRouter, useSearchParams, redirect } from "next/navigation";

import { State } from "@/types";

export default function Profile() {
  const auth = getAuth(app);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPage = searchParams.get("redirect");

  const [isSignUp, setIsSignUp] = useState(true);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("user@gmail.com");
  const [signInPassword, setSignInPassword] = useState("user12345");

  const user = useSelector((state: State) => state.user);
  const photo = user.profile.photo;
  const isLogin = user.profile.login;

  useEffect(() => {
    if (isLogin && redirectPage) {
      redirect(`/${redirectPage}`);
    }
  }, [isLogin]);

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
    <div className="w-screen min-h-screen  bg-slate-900 flex justify-center pt-[180px] pb-40 px-8">
      <div
        className="w-full sm:w-[500px] h-full bg-opacity-10 rounded-xl
       border-2 border-indigo-600 shadow-[0_0_100px_-30px_rgba(79,70,229,1)]
        px-8 py-8"
      >
        {isLogin ? (
          <div className="w-full h-full text-white font-medium flex flex-col justify-center items-center ">
            {photo ? (
              <img
                alt="user avatar"
                src={photo}
                className="w-16 h-16 rounded-full border-2 border-indigo-600 shadow-[0_0_50px_-10px_rgba(79,70,229,1)]"
              />
            ) : (
              <Image
                alt="user avatar"
                src={isLogOutAvatar}
                width={96}
                height={96}
                className="w-32 h-32 rounded-full border-2 border-indigo-600 shadow-[0_0_100px_-30px_rgba(79,70,229,1)]"
              />
            )}

            <div className="text-3xl font-bold mt-8">{user.profile.name}</div>
            <div className="text-lg tracking-wide mt-2">
              {user.profile.email}
            </div>
            <button
              onClick={() => handleSignOut(auth)}
              className="w-full h-12 text-white hover:text-indigo-600
              border-2 border-indigo-600 hover:border-0
              hover:bg-white font-bold text-lg rounded-xl mt-10 px-8"
            >
              Sign out
            </button>
          </div>
        ) : isSignUp ? (
          <div className="w-full h-full flex flex-col items-center">
            <form
              name="sign in"
              onSubmit={handleSignInSubmit}
              className="w-full flex flex-col items-center"
            >
              <Image
                alt="user avatar"
                src={isLogOutAvatar}
                className="w-16 h-16 rounded-full border-2 border-indigo-600 shadow-[0_0_50px_-10px_rgba(79,70,229,1)]"
              />
              <input
                name="sign in email"
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
                className="w-full h-12 text-white bg-slate-900 border-2 border-indigo-600 rounded-xl focus:outline-none mt-4 px-8"
              ></input>
              <input
                name="sign in password"
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-12 text-white bg-slate-900 border-2 border-indigo-600 rounded-xl focus:outline-none mt-4 px-8"
              ></input>
              <button
                type="submit"
                className="w-full h-12 text-white hover:text-indigo-600
                bg-indigo-600 hover:bg-white font-bold text-sm sm:text-lg rounded-xl mt-4 px-8"
              >
                Sign In
              </button>
            </form>
            <button
              onClick={() => handleGoogleSignIn(auth)}
              className="relative flex justify-center items-center w-full h-12
               text-white hover:text-violet-600
               bg-slate-900 hover:bg-white
               border-2 hover:border-0 border-violet-600 
                font-bold text-sm sm:text-lg rounded-xl mt-4 px-8"
            >
              <Image
                alt="google icon"
                src={GoogleIcon}
                className="absolute left-4 sm:left-20 w-5 h-5"
              />
              <div className="font-bold text-md">Sign in with Google</div>
            </button>
            <div className="flex flex-col sm:flex-row items-center mt-4">
              <div className="text-pink-600 opacity-60">
                Don't have an account?
              </div>
              <div
                onClick={() => setIsSignUp((prev) => !prev)}
                className="cursor-pointer font-bold text-pink-600 ml-0 sm:ml-4"
              >
                Sign Up
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            <form
              name="sign up"
              onSubmit={handleSignUpSubmit}
              className="w-full flex flex-col items-center"
            >
              <Image
                alt="user avatar"
                src={isLogOutAvatar}
                className="w-16 h-16 rounded-full border-2 border-indigo-600 shadow-[0_0_50px_-10px_rgba(79,70,229,1)]"
              />
              <input
                name="sign up name"
                placeholder="name"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                required
                className="w-full h-12 text-white bg-slate-900
                 border-2 border-indigo-600 caret-indigo-600
                 rounded-xl focus:outline-none mt-4 px-8"
              ></input>
              <input
                name="sign up email"
                type="email"
                placeholder="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
                className="w-full h-12 text-white bg-slate-900
                border-2 border-indigo-600 caret-indigo-600
                rounded-xl focus:outline-none mt-4 px-8"
              ></input>
              <input
                name="sign up password"
                type="password"
                placeholder="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
                className="w-full h-12 text-white bg-slate-900
                border-2 border-indigo-600 caret-indigo-600
                rounded-xl focus:outline-none mt-4 px-8"
              ></input>
              <button
                type="submit"
                className="w-full h-12 text-white hover:text-indigo-600
                bg-indigo-600 hover:bg-white font-bold text-lg rounded-xl mt-4 px-8"
              >
                Sign Up
              </button>
            </form>
            <div className="flex flex-col sm:flex-row items-center mt-4">
              <div className="text-pink-600 opacity-60">
                Already have an account?
              </div>
              <div
                onClick={() => setIsSignUp((prev) => !prev)}
                className="cursor-pointer font-bold text-pink-600 sm:ml-4"
              >
                Sign In
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
