"use client";
import React, { useState, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";

import store from "@/store/store";
import Link from "next/link";
import HeadShot from "./headShot";
import CollectCategory from "./collectCategory";

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
      element.classList.add(`bg-slate-900/90`);
    } else {
      // Reset the background color if not scrolling or at the top
      element.classList.remove(`bg-slate-900/90`);
    }
  }, [isScrolling, scrollPosition]);

  return (
    <Provider store={store}>
      <div
        ref={elementRef}
        className="fixed w-screen sm:h-36 flex justify-center items-center z-20"
      >
        <div
          className="w-[270px] sm:w-3/4 md:w-4/5 flex flex-col sm:flex-row  justify-between items-center 
           text-slate-100 font-semibold pt-16 sm:pt-0"
        >
          <Link
            href="/"
            className="text-4xl sm:text-3xl font-black bg-gradient-to-r from-[#f24d18] via-[#a358ff] to-[#13bdfe] text-transparent bg-clip-text bg-300% animate-gradient"
          >
            Figma to Code
          </Link>
          <div className="flex flex-col-reverse justify-center sm:flex-row items-center mt-8 sm:mt-0">
            <CollectCategory />
            <HeadShot />
          </div>
        </div>
        {/* <div className="absolute top-[64px] w-full h-12 blur bg-slate-900"></div> */}
      </div>
    </Provider>
  );
}
