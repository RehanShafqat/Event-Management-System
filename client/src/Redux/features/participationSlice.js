import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/apiCalls";

// Async thunks
export const fetchPublicCompetitions = createAsyncThunk(
  "participation/fetchPublicCompetitions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.participation.getAllPublicCompetitions();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competitions"
      );
    }
  }
);

export const fetchPublicCompetitionById = createAsyncThunk(
  "participation/fetchPublicCompetitionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.participation.getPublicCompetitionById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competition details"
      );
    }
  }
);

export const registerTeam = createAsyncThunk(
  "participation/registerTeam",
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await api.participation.registerTeam(teamData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register team"
      );
    }
  }
);

const initialState = {
  competitions: [],
  currentCompetition: null,
  loading: false,
  error: null,
};

const participationSlice = createSlice({
  name: "participation",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCompetition: (state) => {
      state.currentCompetition = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all public competitions
      .addCase(fetchPublicCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicCompetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = action.payload;
      })
      .addCase(fetchPublicCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single public competition
      .addCase(fetchPublicCompetitionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicCompetitionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompetition = action.payload;
      })
      .addCase(fetchPublicCompetitionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register team
      .addCase(registerTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCompetition } =
  participationSlice.actions;
export default participationSlice.reducer;
