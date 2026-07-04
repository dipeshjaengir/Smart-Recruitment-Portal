import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyOTPCode = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP Verification failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
    }
  }
);

const initialState = {
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  profile: null,
  loading: false,
  error: null,
  isRegistered: false,
  registeredEmail: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.profile = null;
      state.isRegistered = false;
      state.registeredEmail = '';
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateProfileLocally: (state, action) => {
      state.profile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = true;
        state.registeredEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOTPCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPCode.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isRegistered = false;
        state.registeredEmail = '';
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(verifyOTPCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.profile = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  }
});

export const { logout, clearAuthError, updateProfileLocally } = authSlice.actions;
export default authSlice.reducer;
