import { configureStore } from "@reduxjs/toolkit";
import frameSliceReducer from "./frameSlice";
import pagesSliceReducer from "./pagesSlice";
import currentPageSliceReducer from "./currentPageSlice";
import frameImagesSliceReducer from "./imagesSlice";
import currentFrameSliceReducer from "./currentFrameSlice";

const store = configureStore({
  reducer: {
    initialFrame: frameSliceReducer,
    currentFrame: currentFrameSliceReducer,
    pages: pagesSliceReducer,
    currentPage: currentPageSliceReducer,
    frameImages: frameImagesSliceReducer,
  },
});

export default store;
