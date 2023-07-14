import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
  style: "Tailwind",
};

const codeStateSlice = createSlice({
  name: "codeState",
  initialState,
  reducers: {
    setCodeState(state, action) {
      state.state = action.payload;
    },
    setCodeStyle(state, action) {
      state.style = action.payload;
    },
  },
});

export const { setCodeState, setCodeStyle } = codeStateSlice.actions;

export default codeStateSlice.reducer;
