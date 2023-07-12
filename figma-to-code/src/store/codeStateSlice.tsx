import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
};

const codeStateSlice = createSlice({
  name: "codeState",
  initialState,
  reducers: {
    setCodeState(state, action) {
      state.state = action.payload;
    },
  },
});

export const { setCodeState } = codeStateSlice.actions;

export default codeStateSlice.reducer;
