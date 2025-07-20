// videotube-frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedLayout from './layouts/ProtectedLayout.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';

// Protected Pages
import VideoDetail from './features/video/VideoDetail.jsx';
import UploadVideo from './features/video/UploadVideo.jsx';
import ChannelPage from './pages/ChannelPage.jsx';
import LikedVideosPage from './pages/LikedVideosPage.jsx';
import WatchHistoryPage from './pages/WatchHistoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UpdateAccountPage from './features/auth/UpdateAccountPage.jsx';
import ChangePasswordPage from './features/auth/ChangePasswordPage.jsx';
import UserVideosPage from './pages/UserVideosPage.jsx';
import SubscribedChannelsPage from './pages/SubscribedChannelsPage.jsx';
import ChannelSubscribersPage from './pages/ChannelSubscribersPage.jsx';
import CreatePlaylistPage from './features/playlist/CreatePlaylistPage.jsx';
import UserPlaylistsPage from './pages/UserPlaylistsPage.jsx';
import PlaylistDetailPage from './features/playlist/PlaylistDetailPage.jsx';
import UserTweetsPage from './pages/UserTweetsPage.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes - Uses MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Public video detail route for unauthenticated users, if desired */}
        <Route path="watch/:videoId" element={<VideoDetail />} />
        {/* Public channel profile routes */}
        <Route path="channel/:userName" element={<ChannelPage />} />
        <Route path="channel/:userName/videos" element={<UserVideosPage />} />
        <Route path="subscribed-to/:userName" element={<SubscribedChannelsPage />} />
        <Route path="tweets/:userName" element={<UserTweetsPage />} />
        <Route path="playlists/:userName" element={<UserPlaylistsPage />} />
        <Route path="playlist/:playlistId" element={<PlaylistDetailPage />} /> {/* Public or restricted by playlist settings */}
      </Route>

      {/* Protected Routes - Uses ProtectedLayout */}
      <Route element={<ProtectedLayout />}>
        {/* Specific Video Actions */}
        <Route path="upload" element={<UploadVideo />} />
        {/* User Account Settings */}
        <Route path="update-account" element={<UpdateAccountPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        {/* User Content & History */}
        <Route path="liked-videos" element={<LikedVideosPage />} />
        <Route path="history" element={<WatchHistoryPage />} />
        {/* Channel Management */}
        <Route path="dashboard/:userName" element={<DashboardPage />} />
        <Route path="channel-subscribers/:channelId" element={<ChannelSubscribersPage />} />
        {/* Playlist Management */}
        <Route path="create-playlist" element={<CreatePlaylistPage />} />
        {/* Placeholder for Update Video/Delete Video/Toggle Publish Status pages */}
        {/* Placeholder for Add/Update/Delete Comment, Tweet, Like actions */}
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-3xl font-bold">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;