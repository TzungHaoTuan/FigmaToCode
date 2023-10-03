"use client";
import { Provider } from "react-redux";
import store from "@/store/store";

import SearchForm from "@/components/searchForm";
import ConvertedArea from "@/components/convertedArea";

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <SearchForm />
      <ConvertedArea />
    </Provider>
  );
};
export default Home;
