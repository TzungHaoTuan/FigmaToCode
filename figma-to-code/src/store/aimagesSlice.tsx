import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  images: [],
};

// Redux slice
const AimagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setImages(state, action) {
      state.images = action.payload;
    },
  },
});

// Export actions
export const { setImages } = AimagesSlice.actions;

// Export reducer
export default AimagesSlice.reducer;
