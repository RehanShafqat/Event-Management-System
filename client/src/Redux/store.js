import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authentication/authSlice";
import competitionReducer from "./features/competitionSlice";
import recruitmentReducer from "./features/recruitmentSlice";
import participationReducer from "./features/participationSlice";
import taskReducer from "./features/taskSlice";
import meetingReducer from "./features/meetingSlice";

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    competitions: competitionReducer,
    recruitment: recruitmentReducer,
    participation: participationReducer,
    tasks: taskReducer,
    meetings: meetingReducer,
  },
});

export default store;
