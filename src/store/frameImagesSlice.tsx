import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  images: [],
};

// Redux slice
const frameImagesSlice = createSlice({
  name: "frameImages",
  initialState,
  reducers: {
    setFrameImages(state, action) {
      state.images = action.payload;
    },
  },
});

// Export actions
export const { setFrameImages } = frameImagesSlice.actions;

// Export reducer
export default frameImagesSlice.reducer;
