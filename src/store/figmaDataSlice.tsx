import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  data: {},
};

// Redux slice
const figmaDataSlice = createSlice({
  name: "figmaData",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

// Export actions
export const { setData } = figmaDataSlice.actions;

// Export reducer
export default figmaDataSlice.reducer;
