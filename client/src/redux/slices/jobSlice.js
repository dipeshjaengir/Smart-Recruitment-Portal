import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filterParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/jobs', { params: filterParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Job details loading failed');
    }
  }
);

export const createNewJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJobDetails = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJobListing = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const fetchRecruiterJobs = createAsyncThunk(
  'jobs/fetchRecruiter',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/jobs/recruiter');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load recruiter jobs');
    }
  }
);

const initialState = {
  jobs: [],
  recruiterJobs: [],
  selectedJob: null,
  totalJobs: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalJobs = action.payload.total;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload.job;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs = action.payload.jobs;
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNewJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewJob.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs.unshift(action.payload.job);
      })
      .addCase(createNewJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteJobListing.fulfilled, (state, action) => {
        state.recruiterJobs = state.recruiterJobs.filter(j => j._id !== action.payload);
      });
  }
});

export const { clearJobError, clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
