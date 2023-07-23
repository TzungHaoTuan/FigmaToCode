import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed w-screen h-24">
      <div className="w-full h-full flex items-center text-white font-semibold bg-white bg-opacity-10 px-16">
        <Link href="/" className="text-2xl font-extrabold">
          Figma to Code
        </Link>
        <Link href="/pages/collection" className="ml-auto ">
          Collection
        </Link>
        <Link
          href="/pages/profile"
          className="ml-16 w-8 h-8 border-2 border-white rounded-full px-4"
        >
          P
        </Link>
      </div>
    </div>
  );
}
