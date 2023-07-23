import React from "react";

import CodeBlock from "./codeBlock";
import ImageSlider from "./imageSlider";

export default function ConvertedArea() {
  return (
    <div>
      <div className="w-full h-screen flex justify-between items-center pt-28">
        <ImageSlider />
        <CodeBlock />
      </div>
    </div>
  );
}
