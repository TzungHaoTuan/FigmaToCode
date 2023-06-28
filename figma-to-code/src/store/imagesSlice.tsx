import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  images: [],
};

// Redux slice
const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setImages(state, action) {
      state.images = action.payload;
    },
  },
});

// Export actions
export const { setImages } = imagesSlice.actions;

// Export reducer
export default imagesSlice.reducer;
