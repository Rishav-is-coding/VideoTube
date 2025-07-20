// videotube-frontend/src/features/subscription/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/subscriptions/c/${channelId}`);
      return response.data.data; // Expects { subscribers: number, isSubscribed: boolean }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserChannelSubscribers = createAsyncThunk(
  'subscription/getUserChannelSubscribers',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subscriptions/c/subscribers/${channelId}`);
      return response.data.data; // Expects { subscribersCount: number, subscribers: [] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSubscribedChannels = createAsyncThunk(
  'subscription/getSubscribedChannels',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subscriptions/c/subscribed-to/${userName}`);
      return response.data.data; // Expects an array of channels subscribed to
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscribers: [],
    subscribedChannels: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSubscriptions: (state) => {
      state.subscribers = [];
      state.subscribedChannels = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Toggle Subscription
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        // Logic to update ChannelPage's subscription status and count would typically be
        // handled in ChannelPage.jsx directly after dispatching this thunk,
        // or by updating the `currentVideo.owner.isSubscribed` in videoSlice if on video page.
        // The payload { subscribers: number, isSubscribed: boolean } is returned.
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Channel Subscribers
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscribers = [];
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.subscribers; // Assuming payload.subscribers is the array
      })
      .addCase(getUserChannelSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Subscribed Channels
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscribedChannels = [];
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;