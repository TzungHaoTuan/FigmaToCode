import { configureStore } from "@reduxjs/toolkit";
import pagesSliceReducer from "./pagesSlice";
import currentPageSliceReducer from "./currentPageSlice";
import frameImagesSliceReducer from "./frameImagesSlice";
import currentFrameSliceReducer from "./currentFrameSlice";
import imagesSliceReducer from "./imagesSlice";
import figmaDataSliceReducer from "./figmaDataSlice";

const store = configureStore({
  reducer: {
    figmaData: figmaDataSliceReducer,
    currentFrame: currentFrameSliceReducer,
    pages: pagesSliceReducer,
    currentPage: currentPageSliceReducer,
    frameImages: frameImagesSliceReducer,
    images: imagesSliceReducer,
  },
});

export default store;
