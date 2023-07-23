import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// create slice

const name = "auth";
const initialState = createInitialState();
const reducers = createReducers();
// const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

// exports

// export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
  const storedValue = localStorage.getItem("auth");
  const parsedValue = storedValue ? JSON.parse(storedValue) : null;
  return {
    // initialize state from local storage to enable user to stay logged in

    value: parsedValue,
  };
}

function createReducers() {
  return {
    setAuth,
  };

  function setAuth(state: any, action: any) {
    state.value = action.payload;
  }
}

// function createExtraActions() {
//   return {
//     login: login(),
//     logout: logout(),
//   };

//   function login() {
//     return createAsyncThunk(`${name}/login`, async function ({ dispatch }:any) {
//       try {
//         // set auth user in redux state
//         dispatch(authActions.setAuth(user));

//         // store user details and jwt token in local storage to keep user logged in between page refreshes
//         localStorage.setItem("auth", JSON.stringify(user));
//       } catch (error) {}
//     });
//   }

//   function logout() {
//     return createAsyncThunk(`${name}/logout`, function (arg, { dispatch }) {
//       dispatch(authActions.setAuth(null));
//       localStorage.removeItem("auth");
//     });
//   }
// }
