import CodeBlock from "./codeBlock";
import ImageSlider from "./imageSlider";
import Collect from "./collect";

export default function ConvertedArea() {
  return (
    <div className="w-screen min-h-screen xl:h-screen bg-slate-900 flex flex-col items-center xl:justify-end">
      <div className="w-full xl:h-[calc(100%-144px)] flex flex-col xl:flex-row xl:pt-0 xl:gap-8 px-12 sm:px-24 lg:px-36">
        <div className="w-full xl:w-1/2 h-screen xl:h-4/5 flex flex-col items-center justify-center xl:justify-between pt-[180px] sm:pt-36 xl:pt-0 pb-16 xl:pb-0">
          <ImageSlider />
          <Collect />
        </div>
        <CodeBlock />
      </div>
    </div>
  );
}
