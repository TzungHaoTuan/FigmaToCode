"use client";
import { Provider } from "react-redux";
import store from "@/store/store";

import Header from "@/components/header";
import SearchForm from "@/components/searchForm";
import ImageSlider from "@/components/imageSlider";
import CodeBlock from "@/components/codeBlock";
import FrameScaled from "@/components/frameScaled";
import ConvertedArea from "@/components/convertedArea";

import Collect from "@/components/collect";

import Link from "next/link";

const Home: React.FC = () => {
  // const [frameIsScaled, setFrameIsScaled] = useState(false);
  // function toggleScaled() {
  //   setFrameIsScaled(!frameIsScaled);
  // }
  return (
    <Provider store={store}>
      <SearchForm />
      <ConvertedArea />
    </Provider>
  );
};
export default Home;
