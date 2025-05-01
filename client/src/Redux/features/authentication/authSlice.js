import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  role: "",
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccessful: (state, action) => {
      state.currentUser = action.payload.currentUser;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.role = "";
    },
  },
});

export const { loginStarted, loginSuccessful, loginFailure, logout } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
