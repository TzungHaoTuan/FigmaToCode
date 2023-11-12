import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  page: "Pages",
};

// Redux slice
const currentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.page = action.payload;
    },
  },
});

// Export actions
export const { setCurrentPage } = currentPageSlice.actions;

// Export reducer
export default currentPageSlice.reducer;
