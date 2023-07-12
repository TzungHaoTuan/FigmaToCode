"use client";
import { Provider } from "react-redux";
import store from "@/store/store";

import React from "react";
import Link from "next/link";

import Grid from "./component/grid";

export default function Collection() {
  return (
    <Provider store={store}>
      <Grid />
      {/* <div>{data && data.document.children}</div> */}
    </Provider>
  );
}
