import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  frame: {
    name: "Frames",
  },
};

const currentFrameSlice = createSlice({
  name: "currentFrame",
  initialState,
  reducers: {
    setCurrentFrame(state, action) {
      state.frame = action.payload;
    },
  },
});

export const { setCurrentFrame } = currentFrameSlice.actions;

export default currentFrameSlice.reducer;
