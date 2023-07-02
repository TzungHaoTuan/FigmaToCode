"use client";
import { Provider } from "react-redux";
import store from "@/store/store";

import Header from "@/components/header";
import SearchForm from "@/components/searchForm";
import ImageSlider from "@/components/imageSlider";
import CodeBlock from "@/components/codeBlock";
import FrameScaled from "@/components/frameScaled";

import Collect from "@/components/collect";

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <Header />
      <SearchForm />
      <ImageSlider />
      <Collect />
      <FrameScaled />
      <CodeBlock />
    </Provider>
  );
};
export default Home;
