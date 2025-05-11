import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiCalls";
import { ROLES } from "../../utils/roles";

// Fetch AVPs
export const fetchAVPs = createAsyncThunk(
  "competitions/fetchAVPs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.getUsersByRole(ROLES.AVP);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch AVPs"
      );
    }
  }
);

// Fetch all competitions
export const fetchCompetitions = createAsyncThunk(
  "competitions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.competition.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competitions"
      );
    }
  }
);

// Fetch single competition
export const fetchCompetition = createAsyncThunk(
  "competitions/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.competition.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competition"
      );
    }
  }
);

// Create competition
export const createCompetition = createAsyncThunk(
  "competitions/create",
  async (competitionData, { rejectWithValue }) => {
    try {
      const response = await api.competition.create(competitionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create competition"
      );
    }
  }
);

// Update competition
export const updateCompetition = createAsyncThunk(
  "competitions/update",
  async ({ id, competitionData }, { rejectWithValue }) => {
    try {
      const response = await api.competition.update(id, competitionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update competition"
      );
    }
  }
);

// Delete competition
export const deleteCompetition = createAsyncThunk(
  "competitions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.competition.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete competition"
      );
    }
  }
);

export const fetchCompetitionParticipants = createAsyncThunk(
  "competitions/fetchParticipants",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.competition.getParticipants(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch participants"
      );
    }
  }
);

export const fetchCompetitionTeams = createAsyncThunk(
  "competitions/fetchTeams",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.competition.getTeams(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teams"
      );
    }
  }
);

export const confirmTeamPayment = createAsyncThunk(
  "competition/confirmTeamPayment",
  async ({ registrationId, paymentProofUrl }, { rejectWithValue }) => {
    try {
      const response = await api.competition.confirmTeamPayment(
        registrationId,
        paymentProofUrl
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to confirm payment"
      );
    }
  }
);

const initialState = {
  competitions: null,
  currentCompetition: null,
  avps: null,
  participants: [],
  teams: [],
  loading: false,
  error: null,
};

const competitionSlice = createSlice({
  name: "competitions",
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
      // Fetch AVPs
      .addCase(fetchAVPs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAVPs.fulfilled, (state, action) => {
        state.loading = false;
        state.avps = action.payload;
      })
      .addCase(fetchAVPs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all competitions
      .addCase(fetchCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = action.payload;
      })
      .addCase(fetchCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single competition
      .addCase(fetchCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompetition = action.payload;
      })
      .addCase(fetchCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create competition
      .addCase(createCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompetition.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions.push(action.payload);
      })
      .addCase(createCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update competition
      .addCase(updateCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompetition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.currentCompetition?._id === action.payload._id) {
          state.currentCompetition = action.payload;
        }
      })
      .addCase(updateCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete competition
      .addCase(deleteCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompetition.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = state.competitions.filter(
          (c) => c._id !== action.payload
        );
        if (state.currentCompetition?._id === action.payload) {
          state.currentCompetition = null;
        }
      })
      .addCase(deleteCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompetitionParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(fetchCompetitionParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompetitionTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchCompetitionTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmTeamPayment.pending, (state) => {
        // Don't set global loading state for payment confirmation
        state.error = null;
      })
      .addCase(confirmTeamPayment.fulfilled, (state, action) => {
        // Don't set global loading state for payment confirmation
        const teamIndex = state.teams.findIndex(
          (team) => team._id === action.payload.data._id
        );
        if (teamIndex !== -1) {
          state.teams[teamIndex] = action.payload.data;
        }
        if (state.currentCompetition) {
          const competitionTeamIndex =
            state.currentCompetition.teams?.findIndex(
              (team) => team._id === action.payload.data._id
            );
          if (competitionTeamIndex !== -1) {
            state.currentCompetition.teams[competitionTeamIndex] =
              action.payload.data;
          }
        }
      })
      .addCase(confirmTeamPayment.rejected, (state, action) => {
        // Don't set global loading state for payment confirmation
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCompetition } = competitionSlice.actions;
export default competitionSlice.reducer;
