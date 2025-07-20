// videotube-frontend/src/pages/SubscribedChannelsPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscribedChannels } from '../features/subscription/subscriptionSlice.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const SubscribedChannelsPage = () => {
  const { userName } = useParams(); // This userName refers to the user whose subscriptions we are viewing
  const dispatch = useDispatch();
  const { subscribedChannels, loading, error } = useSelector((state) => state.subscription);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // This route is public in backend, so no isAuthenticated check needed here, but you might want to show a message if user is not logged in
    if (userName) {
      dispatch(getSubscribedChannels(userName));
    }
  }, [userName, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading subscribed channels: {error}</div>;
  }

  if (subscribedChannels.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">@{userName} is not subscribed to any channels.</div>;
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Channels @{userName} Subscribed To</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribedChannels.map((channel) => (
          <Link
            to={`/channel/${channel.userName}`}
            key={channel._id}
            className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={channel.avatar?.url || "https://via.placeholder.com/80"}
              alt={channel.fullName}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-gray-600"
            />
            <h3 className="text-xl font-semibold text-white truncate w-full text-center">{channel.fullName}</h3>
            <p className="text-gray-400 text-sm">@{channel.userName}</p>
            <p className="text-gray-400 text-sm mt-1">{formatNumber(channel.subscriberCount)} Subscribers</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubscribedChannelsPage;