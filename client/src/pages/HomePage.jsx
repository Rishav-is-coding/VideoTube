// videotube-frontend/src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '../features/video/videoSlice.js';
import VideoCard from '../components/VideoCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const HomePage = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getAllVideos({})); // Fetch all videos on component mount
  }, [dispatch]);

  if (loading && videos.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading videos: {error}</div>;
  }

  if (videos.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">No videos available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Explore Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;