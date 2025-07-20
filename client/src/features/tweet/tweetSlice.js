// videotube-frontend/src/features/tweet/tweetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const createTweet = createAsyncThunk(
  'tweet/createTweet',
  async (content, { rejectWithValue }) => {
    try {
      const response = await api.post('/tweets/', { content });
      return response.data.data; // Returns the new tweet object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserTweets = createAsyncThunk(
  'tweet/getUserTweets',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tweets/c/${userName}`);
      return response.data.data; // Returns an array of tweets
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTweet = createAsyncThunk(
  'tweet/updateTweet',
  async ({ tweetId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tweets/${tweetId}`, { content });
      return response.data.data; // Returns the updated tweet object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTweet = createAsyncThunk(
  'tweet/deleteTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await api.delete(`/tweets/${tweetId}`);
      return tweetId; // Returns the ID of the deleted tweet
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweet',
  initialState: {
    tweets: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTweets: (state) => {
      state.tweets = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Tweet
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets.unshift(action.payload); // Add new tweet to the top
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Tweets
      .addCase(getUserTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tweets = [];
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Tweet
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = state.tweets.map((tweet) =>
          tweet._id === action.payload._id ? action.payload : tweet
        );
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Tweet
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = state.tweets.filter((tweet) => tweet._id !== action.payload);
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTweets } = tweetSlice.actions;
export default tweetSlice.reducer;