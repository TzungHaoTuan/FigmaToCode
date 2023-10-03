import React from "react";
import { useSelector } from "react-redux";
import { State } from "@/types";
export default function CodeSkeleton() {
  const isCoverting = useSelector((state: State) => state.convert.isConverting);

  return (
    <div
      role="status"
      className={`space-y-8 ${isCoverting ? "animate-pulse" : ""}
       md:space-y-0 md:space-x-8 md:flex md:items-center`}
    >
      <div className="w-full pt-4 px-2">
        <div className="h-2.5 bg-slate-200 rounded-full dark:bg-slate-700 w-40 mb-2.5"></div>
        <div className="h-2.5 bg-slate-200 rounded-full dark:bg-slate-700 w-36 mb-4"></div>
        <div className="h-2 bg-slate-200 rounded-full dark:bg-slate-700 w-56 mb-2.5"></div>
        <div className="h-2 bg-slate-200 rounded-full dark:bg-slate-700 w-52 mb-2.5"></div>
        <div className="h-2 bg-slate-200 rounded-full dark:bg-slate-700 w-40 mb-2.5"></div>
        <div className="h-2 bg-slate-200 rounded-full dark:bg-slate-700 w-48 mb-2.5"></div>
        <div className="h-2 bg-slate-200 rounded-full dark:bg-slate-700 w-32"></div>
      </div>
    </div>
  );
}
