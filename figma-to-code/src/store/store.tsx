import { configureStore } from "@reduxjs/toolkit";
import frameSliceReducer from "./frameSlice";
import pagesSliceReducer from "./pagesSlice";
import frameImagesSliceReducer from "./imagesSlice";

const store = configureStore({
  reducer: {
    initialFrame: frameSliceReducer,
    pages: pagesSliceReducer,
    frameImages: frameImagesSliceReducer,
  },
});

export default store;
