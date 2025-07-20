// videotube-frontend/src/pages/ChannelPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import VideoCard from '../components/VideoCard.jsx'; // To display user's videos
import { useSelector, useDispatch } from 'react-redux';
import { toggleSubscription } from '../features/subscription/subscriptionSlice.js'; // Assuming this slice

const ChannelPage = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [channelData, setChannelData] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannelData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch channel profile
      const channelProfileRes = await api.get(`/users/c/${userName}`);
      setChannelData(channelProfileRes.data.data);

      // Fetch channel videos
      const channelVideosRes = await api.get(`/users/c/${userName}/videos`);
      setChannelVideos(channelVideosRes.data.data);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchChannelData();
    }
  }, [userName, currentUser]); // Refetch if currentUser changes (e.g., login/logout)

  const handleSubscribeToggle = async () => {
    if (!currentUser) {
      alert('Please login to subscribe!');
      return;
    }
    if (channelData?.isSubscribed === undefined) {
      // Prevent action if subscription status isn't loaded yet
      return;
    }

    const resultAction = await dispatch(toggleSubscription(channelData._id));
    if (toggleSubscription.fulfilled.match(resultAction)) {
      // Update local state to reflect new subscription status and count
      setChannelData(prev => ({
        ...prev,
        isSubscribed: resultAction.payload.isSubscribed,
        subscribersCount: resultAction.payload.subscribers,
      }));
    } else {
      alert(resultAction.payload || "Failed to toggle subscription");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error: {error}</div>;
  }

  if (!channelData) {
    return <div className="text-gray-400 text-center text-xl mt-8">Channel not found.</div>;
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  return (
    <div className="container mx-auto p-4">
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden mb-6">
        {channelData.coverImage && (
          <img
            src={channelData.coverImage}
            alt="Channel Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      </div>

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between px-4 -mt-16 md:-mt-12 mb-6">
        <div className="flex items-center text-center md:text-left">
          <img
            src={channelData.avatar}
            alt={channelData.fullName}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-900 shadow-lg"
          />
          <div className="ml-4 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-white">{channelData.fullName}</h1>
            <p className="text-gray-400">@{channelData.userName}</p>
            <p className="text-gray-400">{formatNumber(channelData.subscribersCount)} Subscribers</p>
          </div>
        </div>

        {/* Subscribe Button */}
        {currentUser && currentUser._id !== channelData._id && (
          <button
            onClick={handleSubscribeToggle}
            className={`mt-4 md:mt-0 px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-200 ${
              channelData.isSubscribed ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            disabled={loading}
          >
            {channelData.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      {/* Channel Navigation (Videos, Playlists, Tweets, etc.) */}
      <nav className="border-b border-gray-700 mb-6">
        <ul className="flex space-x-8 text-lg font-medium text-gray-400">
          <li className="pb-2 border-b-2 border-purple-500 text-white">Videos</li>
          {/* Add more nav items: e.g., <Link to={`/channel/${userName}/playlists`}>Playlists</Link> */}
          <li><Link to={`/playlists/${userName}`} className="hover:text-white">Playlists</Link></li>
          <li><Link to={`/tweets/${userName}`} className="hover:text-white">Tweets</Link></li>
          {/* etc. */}
        </ul>
      </nav>

      {/* Channel Videos */}
      <h2 className="text-2xl font-bold text-white mb-4">Uploaded Videos</h2>
      {channelVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channelVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">This channel has no videos yet.</p>
      )}
    </div>
  );
};

export default ChannelPage;
