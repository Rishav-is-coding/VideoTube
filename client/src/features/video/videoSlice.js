// videotube-frontend/src/features/video/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const getAllVideos = createAsyncThunk(
  'video/getAllVideos',
  async ({ page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/videos?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}&sortType=${sortType}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const publishVideo = createAsyncThunk(
  'video/publishVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('videoFile', videoData.videoFile);
      formData.append('thumbnail', videoData.thumbnail);

      const response = await api.post('/videos/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getVideoById = createAsyncThunk(
  'video/getVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateVideo = createAsyncThunk(
  'video/updateVideo',
  async ({ videoId, title, description, thumbnailFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const response = await api.patch(`/videos/update/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await api.delete(`/videos/delete/${videoId}`);
      return videoId; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  'video/togglePublishStatus',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/videos/toggle/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getRecommendedVideos = createAsyncThunk(
  'video/getRecommendedVideos',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/videos/recommendation/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    currentVideo: null,
    recommendedVideos: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      totalDocs: 0,
      hasNextPage: false,
      hasPrevPage: false,
      totalPages: 1,
    },
  },
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
      state.recommendedVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Videos
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload; // Backend returns an array, adjust if paginated object is expected
        // If your backend for getAllVideos sends pagination metadata:
        // state.videos = action.payload.docs;
        // state.pagination = { ...action.payload };
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Publish Video
      .addCase(publishVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload); // Add new video to top of list
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Video By Id
      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentVideo = null; // Clear previous video
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Video
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload; // Update current video if it's the one being watched
        state.videos = state.videos.map(video =>
          video._id === action.payload._id ? action.payload : video
        );
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Video
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter(video => video._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Publish Status
      .addCase(togglePublishStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.map(video =>
          video._id === action.payload._id ? action.payload : video
        );
        if (state.currentVideo?._id === action.payload._id) {
          state.currentVideo = action.payload;
        }
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Recommended Videos
      .addCase(getRecommendedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.recommendedVideos = [];
      })
      .addCase(getRecommendedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedVideos = action.payload;
      })
      .addCase(getRecommendedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;