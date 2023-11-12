import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isCollecting: false,
  collected: false,
};

// Redux slice
const collectSlice = createSlice({
  name: "collect",
  initialState,
  reducers: {
    setCollect(state) {
      state.isCollecting = !state.isCollecting;
    },
    setCollected(state, action) {
      state.collected = action.payload;
    },
  },
});

// Export actions
export const { setCollect, setCollected } = collectSlice.actions;

// Export reducer
export default collectSlice.reducer;
