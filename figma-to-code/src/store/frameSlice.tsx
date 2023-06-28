import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  frame: "",
};

// Redux slice
const frameSlice = createSlice({
  name: "initialFrame",
  initialState,
  reducers: {
    setFrame(state, action) {
      state.frame = action.payload;
    },
  },
});

// Export actions
export const { setFrame } = frameSlice.actions;

// Export reducer
export default frameSlice.reducer;
