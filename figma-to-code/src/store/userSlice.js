import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    name: "",
    email: "",
    login: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLogin(state, action) {
      const { name, email } = action.payload;
      state.profile = {
        name,
        email,
        login: true,
      };
    },
    setLogout(state) {
      state.profile = { ...initialState.profile };
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
