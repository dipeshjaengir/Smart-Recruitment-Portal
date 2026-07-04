import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const submitJobApplication = createAsyncThunk(
  'applications/submit',
  async ({ jobId, coverLetter }, { rejectWithValue }) => {
    try {
      const response = await api.post('/applications/apply', { jobId, coverLetter });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

export const fetchCandidateApplications = createAsyncThunk(
  'applications/fetchCandidate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications/candidate');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load applications history');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load applicants listing');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/applications/status/${id}`, { status, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
  }
);

const initialState = {
  applications: [],
  applicants: [],
  loading: false,
  error: null
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitJobApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
      })
      .addCase(submitJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCandidateApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(fetchCandidateApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload.applications;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload.application;
        state.applications = state.applications.map(app => 
          app._id === updated._id ? { ...app, status: updated.status, logs: updated.logs } : app
        );
        state.applicants = state.applicants.map(app => 
          app._id === updated._id ? { ...app, status: updated.status, logs: updated.logs } : app
        );
      });
  }
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
