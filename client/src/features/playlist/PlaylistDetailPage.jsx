// videotube-frontend/src/features/playlist/PlaylistDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  clearCurrentPlaylist
} from './playlistSlice.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import VideoCard from '../../components/VideoCard.jsx'; // For displaying videos within the playlist
import api from '../../utils/api.js'; // For searching videos to add

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPlaylist, loading, error } = useSelector((state) => state.playlist);

  console.log('PlaylistDetailPage rendering');
  console.log('currentPlaylist from Redux:', currentPlaylist);
  console.log('Loading state:', loading);
  console.log('Error state:', error);
  
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showMessage, setShowMessage] = useState('');

  const [searchVideoQuery, setSearchVideoQuery] = useState('');
  const [foundVideos, setFoundVideos] = useState([]);
  const [searchingVideos, setSearchingVideos] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
    return () => {
      dispatch(clearCurrentPlaylist()); // Clear playlist on unmount
    };
  }, [playlistId, dispatch]);

  useEffect(() => {
    if (currentPlaylist) {
      setEditName(currentPlaylist.name);
      setEditDescription(currentPlaylist.description);
    }
  }, [currentPlaylist]);

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    setShowMessage('');
    const resultAction = await dispatch(updatePlaylist({ playlistId, name: editName, description: editDescription }));
    if (updatePlaylist.fulfilled.match(resultAction)) {
      setShowMessage('Playlist updated successfully!');
      setIsEditing(false);
    } else {
      setShowMessage(error || 'Failed to update playlist.');
    }
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      const resultAction = await dispatch(deletePlaylist(playlistId));
      if (deletePlaylist.fulfilled.match(resultAction)) {
        alert('Playlist deleted successfully!');
        navigate(`/playlists/${currentUser.userName}`); // Redirect to user's playlists
      } else {
        alert(error || 'Failed to delete playlist.');
      }
    }
  };

  const handleSearchVideos = async (e) => {
    e.preventDefault();
    setSearchingVideos(true);
    setSearchError(null);
    try {
      // Use the general video search endpoint
      const response = await api.get(`/videos?query=${searchVideoQuery}&limit=5`);
      // Filter out videos already in the current playlist
      const videosNotInPlaylist = response.data.data.filter(
        (video) => !currentPlaylist.videos.some(pv => pv._id === video._id)
      );
      setFoundVideos(videosNotInPlaylist);
    } catch (err) {
      setSearchError(err.response?.data?.message || err.message);
    } finally {
      setSearchingVideos(false);
    }
  };

  const handleAddVideo = async (videoId) => {
    setShowMessage('');
    const resultAction = await dispatch(addVideoToPlaylist({ playlistId, videoId }));
    if (addVideoToPlaylist.fulfilled.match(resultAction)) {
      setShowMessage('Video added to playlist!');
      setSearchVideoQuery('');
      setFoundVideos([]); // Clear search results
      // Re-fetch playlist to get updated video list
      dispatch(getPlaylistById(playlistId));
    } else {
      setShowMessage(error || 'Failed to add video to playlist.');
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to remove this video from the playlist?')) {
      setShowMessage('');
      const resultAction = await dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
      if (removeVideoFromPlaylist.fulfilled.match(resultAction)) {
        setShowMessage('Video removed from playlist!');
        // Re-fetch playlist to get updated video list
        dispatch(getPlaylistById(playlistId));
      } else {
        setShowMessage(error || 'Failed to remove video from playlist.');
      }
    }
  };

  if (loading && !currentPlaylist) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error: {error}</div>;
  }

  if (!currentPlaylist) {
    return <div className="text-gray-400 text-center text-xl mt-8">Playlist not found.</div>;
  }

  const isOwner = currentUser?._id === currentPlaylist.owner?._id;

  return (
    <div className="container mx-auto p-4">
      {showMessage && (
        <p className={`text-center text-base mb-4 ${showMessage.includes('success') || showMessage.includes('added') || showMessage.includes('removed') ? 'text-green-500' : 'text-red-500'}`}>
          {showMessage}
        </p>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        {isEditing ? (
          <form onSubmit={handleUpdatePlaylist} className="space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-3xl font-bold focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <textarea
              rows="3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors duration-200"
                disabled={loading}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-2">{currentPlaylist.name}</h1>
            <p className="text-gray-300 text-lg mb-4">{currentPlaylist.description || 'No description provided.'}</p>
            <Link to={`/channel/${currentPlaylist.owner?.userName}`} className="flex items-center text-gray-400 hover:text-white mb-4">
              <img
                src={currentPlaylist.owner?.avatar || "https://via.placeholder.com/30"}
                alt={currentPlaylist.owner?.fullName}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span>{currentPlaylist.owner?.fullName || currentPlaylist.owner?.userName}</span>
            </Link>
            {isOwner && (
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors duration-200"
                >
                  Edit Playlist
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors duration-200"
                  disabled={loading}
                >
                  Delete Playlist
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isOwner && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Add Videos to Playlist</h2>
          <form onSubmit={handleSearchVideos} className="flex space-x-3 mb-4">
            <input
              type="text"
              placeholder="Search videos to add..."
              value={searchVideoQuery}
              onChange={(e) => setSearchVideoQuery(e.target.value)}
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors duration-200"
              disabled={searchingVideos}
            >
              {searchingVideos ? 'Searching...' : 'Search'}
            </button>
          </form>
          {searchError && <p className="text-red-500 text-sm mb-4">{searchError}</p>}
          {foundVideos.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              {foundVideos.map((video) => (
                <div key={video._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div className="flex items-center">
                    <img src={video.thumbnail?.url} alt={video.title} className="w-16 h-10 object-cover rounded-sm mr-3" />
                    <span className="text-white text-sm truncate max-w-xs">{video.title}</span>
                  </div>
                  <button
                    onClick={() => handleAddVideo(video._id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
          {foundVideos.length === 0 && searchVideoQuery && !searchingVideos && !searchError && (
            <p className="text-gray-400 text-sm">No videos found matching your search.</p>
          )}
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-4">Videos in this Playlist ({currentPlaylist.videos?.length || 0})</h2>
      {currentPlaylist.videos && currentPlaylist.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentPlaylist.videos.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove from playlist"
                  disabled={loading}
                >
                  ✖️
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-xl mt-8">This playlist is empty.</p>
      )}
    </div>
  );
};

export default PlaylistDetailPage;