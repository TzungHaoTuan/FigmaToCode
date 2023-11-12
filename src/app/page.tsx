// "use client";
import { Provider } from "react-redux";
import store from "@/store/store";

import SearchForm from "@/components/searchForm";
import ConvertedArea from "@/components/convertedArea";

const Home: React.FC = () => {
  return (
    <>
      <SearchForm />
      <ConvertedArea />
    </>
    // <Provider store={store}>

    // </Provider>
  );
};
export default Home;
