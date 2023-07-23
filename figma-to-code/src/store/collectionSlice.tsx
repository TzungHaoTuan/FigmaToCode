import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  frames: [],
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollection(state, action) {
      state.frames = action.payload;
    },
  },
});

export const { setCollection } = collectionSlice.actions;

export default collectionSlice.reducer;
