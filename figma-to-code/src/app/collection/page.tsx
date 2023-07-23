"use client";
import { Provider } from "react-redux";
import store from "@/store/store";
import Grid from "./component/grid";

export default function Collection() {
  return (
    <Provider store={store}>
      <Grid />
    </Provider>
  );
}
