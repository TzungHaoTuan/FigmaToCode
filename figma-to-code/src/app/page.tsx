"use client";
import { Provider } from "react-redux";
import store from "@/store/store";
import SearchForm from "@/components/searchForm";
import ImageSlider from "@/components/imageSlider";
import CodeBlock from "@/components/codeBlock";
import FrameScaled from "@/components/frameScaled";

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <SearchForm />
      <ImageSlider />
      <FrameScaled />
      <CodeBlock />
      <FrameScaled />
      <CodeBlock />
    </Provider>
  );
};
export default Home;
