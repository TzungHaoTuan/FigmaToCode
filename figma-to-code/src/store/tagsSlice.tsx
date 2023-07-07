import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  tags: {},
};

// Redux slice
const tagsSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    setTag(state, action) {
      state.tags = action.payload;
    },
  },
});

// Export actions
export const { setTag } = tagsSlice.actions;

// Export reducer
export default tagsSlice.reducer;
