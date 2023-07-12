"use client";
import React, { useState, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import Link from "next/link";
import HeadShot from "./headShot";

export default function Header() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsScrolling(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const element: any = elementRef.current;
    if (isScrolling && scrollPosition > 0) {
      // Change the background color of the element here
      element.classList.add("bg-slate-900/90");
    } else {
      // Reset the background color if not scrolling or at the top
      element.classList.remove("bg-slate-900/90");
    }
  }, [isScrolling, scrollPosition]);

  return (
    <Provider store={store}>
      <div className="fixed w-screen h-24 z-20">
        <div
          ref={elementRef}
          className="w-full h-full flex items-center text-slate-100 font-semibold  transition-all duration-500  ease-in-out px-24"
        >
          {/* <Link
            href="/"
            className="text-3xl font-black    bg-gradient-to-r from-[#f24d18] via-[#a358ff] to-[#13bdfe] text-transparent bg-clip-text bg-300% animate-gradient"
          >
            Figma to Code
          </Link> */}
          <Link href="/collection" className="ml-auto ">
            Collection
          </Link>
          <HeadShot />
        </div>
      </div>
    </Provider>
  );
}
