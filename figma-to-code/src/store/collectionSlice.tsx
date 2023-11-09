import { createSlice } from "@reduxjs/toolkit";
import { CollectionFrames } from "@/types";

const initialState: { frames: CollectionFrames | null } = {
  frames: null,
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
