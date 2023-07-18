import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
  style: "Tailwind",
  isToggle: false,
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
    setCodeToggle(state) {
      state.isToggle = !state.isToggle;
    },
  },
});

export const { setCodeState, setCodeStyle, setCodeToggle } =
  codeStateSlice.actions;

export default codeStateSlice.reducer;
