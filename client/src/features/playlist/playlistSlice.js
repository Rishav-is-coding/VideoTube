// videotube-frontend/src/features/playlist/playlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await api.post('/playlists/', { name, description });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await api.get(`/playlists/user/${userName}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  'playlist/getPlaylistById',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data.data; // <-- CHANGE THIS LINE
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  'playlist/addVideoToPlaylist',
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/playlists/add/${videoId}/${playlistId}`);
      return response.data.data; // Returns updated playlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  'playlist/removeVideoFromPlaylist',
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
      return response.data.data; // Returns updated playlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      await api.delete(`/playlists/${playlistId}`);
      return playlistId; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  'playlist/updatePlaylist',
  async ({ playlistId, name, description }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/playlists/${playlistId}`, { name, description });
      return response.data.data; // Returns updated playlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    userPlaylists: [],
    currentPlaylist: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
    clearUserPlaylists: (state) => {
      state.userPlaylists = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists.unshift(action.payload); // Add new playlist to the list
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Playlists
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userPlaylists = [];
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Playlist By Id
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPlaylist = null;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylist = action.payload;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Video To Playlist
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload; // Update current if it's the one modified
        }
        state.userPlaylists = state.userPlaylists.map(playlist =>
          playlist._id === action.payload._id ? action.payload : playlist
        );
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Video From Playlist
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
        state.userPlaylists = state.userPlaylists.map(playlist =>
          playlist._id === action.payload._id ? action.payload : playlist
        );
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists = state.userPlaylists.filter(playlist => playlist._id !== action.payload);
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null;
        }
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
        state.userPlaylists = state.userPlaylists.map(playlist =>
          playlist._id === action.payload._id ? action.payload : playlist
        );
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPlaylist, clearUserPlaylists } = playlistSlice.actions;
export default playlistSlice.reducer;