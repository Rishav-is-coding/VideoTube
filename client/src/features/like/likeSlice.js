// videotube-frontend/src/features/like/likeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const toggleVideoLike = createAsyncThunk(
  'like/toggleVideoLike',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/likes/toggle/v/${videoId}`);
      return response.data.data; // Expects { isLiked: boolean, likes: number }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'like/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/likes/toggle/c/${commentId}`);
      return response.data.data; // Expects { isLiked: boolean, likes: number }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  'like/toggleTweetLike',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/likes/toggle/t/${tweetId}`);
      return response.data.data; // Expects { isLiked: boolean, likes: number }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getLikedVideos = createAsyncThunk(
  'like/getLikedVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/likes/videos');
      return response.data.data; // Expects an array of liked video objects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const likeSlice = createSlice({
  name: 'like',
  initialState: {
    likedVideos: [],
    loading: false,
    error: null,
    // Add temporary states for tracking like status on specific items if needed in UI
  },
  reducers: {
    // Reducers to update likes in UI without refetching all data
    updateVideoLikeStatus: (state, action) => {
      const { videoId, isLiked, likes } = action.payload;
      // This reducer is for when you're on a video detail page and want to update its specific like status
      // You'd typically update the currentVideo in videoSlice or manage local state in VideoDetail.jsx
      // This is a placeholder for demonstrating how to handle it if needed
      console.log(`Video ${videoId} like status updated to ${isLiked} with ${likes} likes`);
    },
    updateCommentLikeStatus: (state, action) => {
      const { commentId, isLiked, likes } = action.payload;
      // Similar to video, for comment detail/list
      console.log(`Comment ${commentId} like status updated to ${isLiked} with ${likes} likes`);
    },
    updateTweetLikeStatus: (state, action) => {
      const { tweetId, isLiked, likes } = action.payload;
      // Similar to video, for tweet detail/list
      console.log(`Tweet ${tweetId} like status updated to ${isLiked} with ${likes} likes`);
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Video Like
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.loading = false;
        // The UI (e.g., VideoDetail.jsx) should handle updating its state based on this payload
        // You might dispatch a custom action here or handle the update directly in the component
        // based on the result.
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Comment Like
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Tweet Like
      .addCase(toggleTweetLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Liked Videos
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.likedVideos = [];
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateVideoLikeStatus, updateCommentLikeStatus, updateTweetLikeStatus } = likeSlice.actions;
export default likeSlice.reducer;