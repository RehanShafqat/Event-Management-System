import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiCalls";
import { toast } from "sonner";

// Async thunks
export const fetchMeetings = createAsyncThunk(
  "meetings/fetchMeetings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.meeting.getAll(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch meetings"
      );
    }
  }
);

export const createMeeting = createAsyncThunk(
  "meetings/createMeeting",
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await api.meeting.create(meetingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create meeting"
      );
    }
  }
);

export const updateMeeting = createAsyncThunk(
  "meetings/updateMeeting",
  async ({ id, meetingData }, { rejectWithValue }) => {
    try {
      const response = await api.meeting.update(id, meetingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update meeting"
      );
    }
  }
);

export const cancelMeeting = createAsyncThunk(
  "meetings/cancelMeeting",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.meeting.cancel(id, reason);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel meeting"
      );
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (id, { rejectWithValue }) => {
    try {
      await api.meeting.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete meeting"
      );
    }
  }
);

const initialState = {
  meetings: [],
  loading: false,
  error: null,
  selectedMeeting: null,
};

const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setSelectedMeeting: (state, action) => {
      state.selectedMeeting = action.payload;
    },
    clearSelectedMeeting: (state) => {
      state.selectedMeeting = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Create meeting
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings.push(action.payload);
        toast.success("Meeting created successfully");
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update meeting
      .addCase(updateMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(
          (meeting) => meeting._id === action.payload._id
        );
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
        toast.success("Meeting updated successfully");
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Cancel meeting
      .addCase(cancelMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(
          (meeting) => meeting._id === action.payload._id
        );
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
        toast.success("Meeting cancelled successfully");
      })
      .addCase(cancelMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Delete meeting
      .addCase(deleteMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = state.meetings.filter(
          (meeting) => meeting._id !== action.payload
        );
        toast.success("Meeting deleted successfully");
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { setSelectedMeeting, clearSelectedMeeting } =
  meetingSlice.actions;
export default meetingSlice.reducer;
