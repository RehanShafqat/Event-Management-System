// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/auth";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(
        credentials.email,
        credentials.password
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyMfa = createAsyncThunk(
  "auth/verifyMfa",
  async ({ userId, code }, { rejectWithValue }) => {
    try {
      const response = await api.auth.verifyMfa(userId, code);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  success: false,
  user: JSON.parse(localStorage.getItem("user")) || {
    id: null,
    name: null,
    email: null,
    role: null,
  },
  setupMfa: false,
  mfaRequired: false,
  qrCode: null,
  secret: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout: (state) => {
      state.success = false;
      state.user = {
        id: null,
        name: null,
        email: null,
        role: null,
      };
      state.setupMfa = false;
      state.mfaRequired = false;
      state.qrCode = null;
      state.secret = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.success = action.payload.success;

        // INFO: This is the case where mfa is enabled and you have to write the code to verify yourself
        if (action.payload.mfaRequired) {
          state.mfaRequired = action.payload.mfaRequired;
          state.user.id = action.payload.userId;
        } else {
          if (action.payload.user) {
            state.user = action.payload.user;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
          state.setupMfa = action.payload.setupMfa;
          state.mfaRequired = action.payload.mfaRequired;
          state.qrCode = action.payload.qrCode;
          state.secret = action.payload.secret;
          state.loading = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Login failed";
        state.loading = false;
      })
      .addCase(verifyMfa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMfa.fulfilled, (state, action) => {
        state.success = action.payload.success;
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
        state.mfaRequired = false;
        state.loading = false;
      })
      .addCase(verifyMfa.rejected, (state, action) => {
        state.error = action.payload?.message || "MFA verification failed";
        state.loading = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
