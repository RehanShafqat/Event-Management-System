import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authentication/authSlice";
import competitionReducer from "./features/competitionSlice";
import recruitmentReducer from "./features/recruitmentSlice";

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    competitions: competitionReducer,
    recruitment: recruitmentReducer,
  },
});

export default store;
