import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authentication/authSlice";
import competitionReducer from "./features/competitionSlice";

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    competitions: competitionReducer,
  },
});

export default store;
