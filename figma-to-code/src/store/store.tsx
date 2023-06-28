import { configureStore } from "@reduxjs/toolkit";
import frameSliceReducer from "./frameSlice";
import pagesSliceReducer from "./pagesSlice";
import currentPageSliceReducer from "./currentPageSlice";
import frameImagesSliceReducer from "./frameImagesSlice";
import currentFrameSliceReducer from "./currentFrameSlice";
import imagesSliceReducer from "./imagesSlice";

const store = configureStore({
  reducer: {
    initialFrame: frameSliceReducer,
    currentFrame: currentFrameSliceReducer,
    pages: pagesSliceReducer,
    currentPage: currentPageSliceReducer,
    frameImages: frameImagesSliceReducer,
    images: imagesSliceReducer,
  },
});

export default store;
