"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";

import Header from "@/components/header";
import SearchForm from "@/components/searchForm";
import ImageSlider from "@/components/imageSlider";
import CodeBlock from "@/components/codeBlock";
import FrameScaled from "@/components/frameScaled";
import ConvertedArea from "@/components/convertedArea";

import Collect from "@/components/collect";

const Home: React.FC = () => {
  const [frameIsScaled, setFrameIsScaled] = useState(false);
  function toggleScaled() {
    setFrameIsScaled(!frameIsScaled);
  }
  return (
    <Provider store={store}>
      <Header />
      <SearchForm />
      <ImageSlider />
      <Collect />
      {frameIsScaled && <FrameScaled />}
      <CodeBlock />
      <FrameScaled />
      <CodeBlock />
    </Provider>
  );
};
export default Home;
