import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    name: "",
    email: "",
    photo: "",
    uid: "",
    login: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLogin(state, action) {
      const { name, email, photo, uid } = action.payload;
      state.profile = {
        name,
        email,
        photo,
        uid,
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
