import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "./features/authentication/authSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationSlice,
  },
});

export default store;
