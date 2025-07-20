// videotube-frontend/src/features/comment/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const getVideoComments = createAsyncThunk(
  'comment/getVideoComments',
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/${videoId}?page=${page}&limit=${limit}`);
      return response.data.data; // Expects { comments: [], totalComments: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${videoId}`, { content });
      return response.data.data; // Returns the new comment object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/comments/c/${commentId}`, { content });
      return response.data.data; // Returns the updated comment object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/c/${commentId}`);
      return commentId; // Returns the ID of the deleted comment
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    totalComments: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.totalComments = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Video Comments
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.totalComments = action.payload.totalComments;
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload); // Add new comment to the top
        state.totalComments += 1;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
        state.totalComments -= 1;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;