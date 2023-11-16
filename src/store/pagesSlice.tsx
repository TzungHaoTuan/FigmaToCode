import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  pages: [],
};

// Redux slice
const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setPages(state, action) {
      state.pages = action.payload;
    },
  },
});

// Export actions
export const { setPages } = pagesSlice.actions;

// Export reducer
export default pagesSlice.reducer;
