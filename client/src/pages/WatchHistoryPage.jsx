// videotube-frontend/src/pages/WatchHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api.js'; // Direct API call as watch history is a user-specific endpoint
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import VideoCard from '../components/VideoCard.jsx';

const WatchHistoryPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please login to view your watch history.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/users/history');
        setHistoryVideos(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="text-red-500 text-center text-xl mt-8">Please login to view your watch history.</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading watch history: {error}</div>;
  }

  if (historyVideos.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">Your watch history is empty.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Your Watch History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {historyVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default WatchHistoryPage;