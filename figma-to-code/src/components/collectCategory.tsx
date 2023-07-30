import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setCollected } from "@/store/collectSlice";

export default function CollectCategory() {
  const isCollected = useSelector((state: any) => state.collect.collected);
  const dispatch = useDispatch();

  return (
    <Link
      href="/collection"
      className="ml-0 mt-2 sm:ml-auto sm:mt-0 relative"
      onClick={() => {
        dispatch(setCollected(false));
      }}
    >
      <div
        className={`${
          isCollected ? "opacity-100" : "opacity-0"
        } absolute right-3 top-0 w-3 h-3 rounded-full bg-pink-600`}
      ></div>
      Collection
    </Link>
  );
}
