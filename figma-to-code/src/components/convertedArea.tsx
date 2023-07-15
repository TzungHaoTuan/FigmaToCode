import React from "react";

import CodeBlock from "./codeBlock";
import ImageSlider from "./imageSlider";
import Collect from "./collect";

export default function ConvertedArea() {
  return (
    <div className="w-full h-screen min-h-screen">
      <div className="w-full h-full bg-slate-900 flex justify-between items-center pt-16">
        <div className="w-1/2 h-full flex flex-col items-center">
          <ImageSlider />
          <Collect />
        </div>
        <CodeBlock />
      </div>
      <div className="footer h-4 bg-gradient-to-r from-pink-600 to-purple-600"></div>
    </div>
  );
}
