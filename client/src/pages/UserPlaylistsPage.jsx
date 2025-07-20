// videotube-frontend/src/pages/UserPlaylistsPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPlaylists, clearUserPlaylists } from '../features/playlist/playlistSlice.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const UserPlaylistsPage = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { userPlaylists, loading, error } = useSelector((state) => state.playlist);

  useEffect(() => {
    if (userName) {
      dispatch(getUserPlaylists(userName));
    }
    return () => {
      dispatch(clearUserPlaylists()); // Clear playlists on unmount
    };
  }, [userName, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading playlists: {error}</div>;
  }

  if (userPlaylists.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">@{userName} has no playlists yet.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Playlists by @{userName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userPlaylists.map((playlist) => (
          <Link
            to={`/playlist/${playlist._id}`}
            key={playlist._id}
            className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full aspect-video bg-gray-700 flex items-center justify-center">
              {playlist.videos && playlist.videos.length > 0 && playlist.videos[0]?.thumbnail?.url ? (
                <img
                  src={playlist.videos[0].thumbnail.url}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No thumbnail</span>
              )}
              {playlist.videos && playlist.videos.length > 0 && (
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
                  {playlist.videos.length} Videos
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{playlist.description || 'No description'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserPlaylistsPage;