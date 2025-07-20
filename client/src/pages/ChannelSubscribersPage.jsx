// videotube-frontend/src/pages/ChannelSubscribersPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserChannelSubscribers } from '../features/subscription/subscriptionSlice.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ChannelSubscribersPage = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const { subscribers, loading, error } = useSelector((state) => state.subscription);
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && channelId) {
      dispatch(getUserChannelSubscribers(channelId));
    }
  }, [channelId, dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="text-red-500 text-center text-xl mt-8">Please login to view channel subscribers.</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading subscribers: {error}</div>;
  }

  if (subscribers.length === 0 && !loading) {
    return <div className="text-gray-400 text-center text-xl mt-8">This channel has no subscribers yet.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Channel Subscribers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribers.map((subscriber) => (
          <Link
            to={`/channel/${subscriber.userName}`}
            key={subscriber._id}
            className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={subscriber.avatar?.url || "https://via.placeholder.com/80"}
              alt={subscriber.fullName}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-gray-600"
            />
            <h3 className="text-xl font-semibold text-white truncate w-full text-center">{subscriber.fullName}</h3>
            <p className="text-gray-400 text-sm">@{subscriber.userName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChannelSubscribersPage;