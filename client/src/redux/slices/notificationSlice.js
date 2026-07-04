import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/read/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notification');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotificationLocally: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.readStatus) {
        state.unreadCount++;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.notifications.filter(n => !n.readStatus).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload.notification;
        state.notifications = state.notifications.map(n => 
          n._id === updated._id ? updated : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  }
});

export const { addNotificationLocally } = notificationSlice.actions;
export default notificationSlice.reducer;
