import { configureStore } from "@reduxjs/toolkit";
import pagesSliceReducer from "./pagesSlice";
import currentPageSliceReducer from "./currentPageSlice";
import frameImagesSliceReducer from "./frameImagesSlice";
import currentFrameSliceReducer from "./currentFrameSlice";
import imagesSliceReducer from "./imagesSlice";
import figmaDataSliceReducer from "./figmaDataSlice";
import collectionSliceReducer from "./collectionSlice";

const store = configureStore({
  reducer: {
    figmaData: figmaDataSliceReducer,
    currentFrame: currentFrameSliceReducer,
    pages: pagesSliceReducer,
    currentPage: currentPageSliceReducer,
    frameImages: frameImagesSliceReducer,
    images: imagesSliceReducer,
    collection: collectionSliceReducer,
  },
});

export default store;
