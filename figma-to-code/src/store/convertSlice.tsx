import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isConverting: false,
};

// Redux slice
const convertSlice = createSlice({
  name: "convert",
  initialState,
  reducers: {
    setConvert(state) {
      state.isConverting = !state.isConverting;
    },
  },
});

// Export actions
export const { setConvert } = convertSlice.actions;

// Export reducer
export default convertSlice.reducer;
