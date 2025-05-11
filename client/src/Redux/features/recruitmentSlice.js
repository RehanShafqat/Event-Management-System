import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiCalls";

// Fetch all applications
export const fetchApplications = createAsyncThunk(
  "recruitment/fetchApplications",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.recruitment.getApplications(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

// Fetch single application
export const fetchApplication = createAsyncThunk(
  "recruitment/fetchApplication",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.recruitment.getApplication(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch application"
      );
    }
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  "recruitment/updateStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await api.recruitment.updateApplicationStatus(
        id,
        statusData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  }
);

// Delete application
export const deleteApplication = createAsyncThunk(
  "recruitment/deleteApplication",
  async (id, { rejectWithValue }) => {
    try {
      await api.recruitment.deleteApplication(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete application"
      );
    }
  }
);

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
};

const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single application
      .addCase(fetchApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(
          (app) => app._id === action.payload._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.currentApplication?._id === action.payload._id) {
          state.currentApplication = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete application
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload
        );
        if (state.currentApplication?._id === action.payload) {
          state.currentApplication = null;
        }
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentApplication } = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
