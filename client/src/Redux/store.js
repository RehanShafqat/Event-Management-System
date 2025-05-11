import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authentication/authSlice";
import competitionReducer from "./features/competitionSlice";
import participationReducer from "./features/participationSlice";

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    competitions: competitionReducer,
    participation: participationReducer,
  },
});

export default store;
