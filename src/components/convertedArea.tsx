import CodeBlock from "./codeBlock";
import ImageSlider from "./imageSlider";
import Collect from "./collect";

export default function ConvertedArea() {
  return (
    <div className="w-full min-h-screen xl:h-screen bg-slate-900 flex flex-col items-center xl:justify-end">
      <div className="w-[270px] sm:w-3/4 md:w-4/5 xl:h-[calc(100%-144px)] flex flex-col xl:flex-row  xl:pt-0 xl:gap-8">
        <div className="w-full xl:w-1/2 h-screen xl:h-full">
          <div className="w-full h-[calc(100%-48px)] xl:h-4/5 flex flex-col items-center xl:justify-between pt-56 sm:pt-36 xl:pt-0">
            <ImageSlider />
            <Collect />
          </div>
        </div>
        <CodeBlock />
      </div>
    </div>
  );
}
