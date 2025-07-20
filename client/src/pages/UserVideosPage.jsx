// videotube-frontend/src/pages/UserVideosPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import VideoCard from '../components/VideoCard.jsx';

const UserVideosPage = () => {
  const { userName } = useParams();
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/users/c/${userName}/videos`);
        setUserVideos(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchUserVideos();
    }
  }, [userName]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading videos: {error}</div>;
  }

  if (userVideos.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">@{userName} has not uploaded any videos yet.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Videos by @{userName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default UserVideosPage;