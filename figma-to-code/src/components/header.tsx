import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <Link
        href="/pages/collection"
        className="border-2 border-black rounded-xl text-black px-4"
      >
        Collection
      </Link>
      <Link
        href="/pages/profile"
        className="border-2 border-black rounded-xl text-black px-4"
      >
        Profile
      </Link>
    </div>
  );
}
