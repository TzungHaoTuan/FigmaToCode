import { configureStore } from "@reduxjs/toolkit";

import userSliceReducer from "./userSlice";
import pagesSliceReducer from "./pagesSlice";
import currentPageSliceReducer from "./currentPageSlice";
import frameImagesSliceReducer from "./frameImagesSlice";
import currentFrameSliceReducer from "./currentFrameSlice";
import imagesSliceReducer from "./imagesSlice";
import figmaDataSliceReducer from "./figmaDataSlice";
import collectionSliceReducer from "./collectionSlice";
import tagNameSliceReducer from "./tagsSlice";

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    figmaData: figmaDataSliceReducer,
    currentFrame: currentFrameSliceReducer,
    pages: pagesSliceReducer,
    currentPage: currentPageSliceReducer,
    frameImages: frameImagesSliceReducer,
    images: imagesSliceReducer,
    collection: collectionSliceReducer,
    tag: tagNameSliceReducer,
  },
});

export default store;
