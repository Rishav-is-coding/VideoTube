// videotube-frontend/src/features/video/UploadVideo.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { publishVideo } from './videoSlice';
import { useNavigate } from 'react-router-dom';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.video);

  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!title || !description || !videoFile || !thumbnailFile) {
      setMessage('All fields including video and thumbnail are required.');
      return;
    }

    const videoData = {
      title,
      description,
      videoFile,
      thumbnail: thumbnailFile,
    };

    const resultAction = await dispatch(publishVideo(videoData));
    if (publishVideo.fulfilled.match(resultAction)) {
      setMessage('Video uploaded and published successfully!');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      e.target.reset(); // Clear form inputs
      // Optionally navigate to the new video's detail page or user's video list
      navigate(`/watch/${resultAction.payload._id}`);
    } else {
      setMessage(error || 'Failed to upload video.');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Upload New Video</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300 mb-1">
            Video File
          </label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            onChange={handleVideoFileChange}
            required
          />
          {videoFile && <p className="mt-2 text-xs text-gray-400">Selected: {videoFile.name}</p>}
        </div>
        <div>
          <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-300 mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            id="thumbnailFile"
            accept="image/*"
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            onChange={handleThumbnailFileChange}
            required
          />
          {thumbnailFile && <p className="mt-2 text-xs text-gray-400">Selected: {thumbnailFile.name}</p>}
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
          {loading ? 'Publishing...' : 'Publish Video'}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;