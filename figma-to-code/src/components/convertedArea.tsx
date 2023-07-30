import React from "react";

import CodeBlock from "./codeBlock";
import ImageSlider from "./imageSlider";
import Collect from "./collect";

export default function ConvertedArea() {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center">
      <div className="w-[270px] sm:w-3/4 md:w-4/5 flex flex-col xl:flex-row pt-56">
        <div className="w-full  xl:w-1/2  flex flex-col justify-between items-center mb-16 sm:mb-16 xl:mb-0 xl:pr-3">
          <ImageSlider />
          <Collect />
        </div>
        <CodeBlock />
      </div>
    </div>
  );
}
