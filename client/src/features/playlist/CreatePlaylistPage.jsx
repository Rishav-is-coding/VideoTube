// videotube-frontend/src/features/playlist/CreatePlaylistPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylist } from './playlistSlice.js';
import { useNavigate } from 'react-router-dom';

const CreatePlaylistPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.playlist);
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!name.trim()) {
      setMessage('Playlist name is required.');
      return;
    }

    const resultAction = await dispatch(createPlaylist({ name, description }));
    if (createPlaylist.fulfilled.match(resultAction)) {
      setMessage('Playlist created successfully!');
      setName('');
      setDescription('');
      // Optionally navigate to the new playlist's detail page or user's playlists
      navigate(`/playlist/${resultAction.payload._id}`);
    } else {
      setMessage(error || 'Failed to create playlist.');
    }
  };

  if (!currentUser) {
    return <div className="text-red-500 text-center text-xl mt-8">Please login to create a playlist.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Create New Playlist</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Playlist Name
          </label>
          <input
            type="text"
            id="name"
            className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows="3"
            className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {message && (
          <p className={`text-center text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylistPage;