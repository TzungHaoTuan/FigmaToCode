import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    name: "",
    age: 0,
    login: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLogin(state, action) {
      state.profile = { ...state.profile, login: true };
    },
    setLogout(state) {
      state.profile = { ...state.profile, login: false };
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
