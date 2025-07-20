// videotube-frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import videoReducer from '../features/video/videoSlice.js';
import commentReducer from '../features/comment/commentSlice.js';
import likeReducer from '../features/like/likeSlice.js';
import subscriptionReducer from '../features/subscription/subscriptionSlice.js';
import playlistReducer from '../features/playlist/playlistSlice.js';
import tweetReducer from '../features/tweet/tweetSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    comment: commentReducer,
    like: likeReducer,
    subscription: subscriptionReducer,
    playlist: playlistReducer,
    tweet: tweetReducer,
  },
  // Redux DevTools are enabled by default in development
});