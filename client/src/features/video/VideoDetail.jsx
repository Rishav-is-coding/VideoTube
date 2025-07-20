// videotube-frontend/src/features/video/VideoDetail.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoById, clearCurrentVideo, getRecommendedVideos } from './videoSlice';
import { toggleVideoLike } from '../like/likeSlice.js'; // Assuming you create this
import { toggleSubscription } from '../subscription/subscriptionSlice.js'; // Assuming you create this
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import CommentSection from '../comment/CommentSection.jsx'; // Assuming you create this

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading, error, recommendedVideos } = useSelector((state) => state.video);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
      dispatch(getRecommendedVideos(videoId)); // Fetch recommendations
    }
    return () => {
      dispatch(clearCurrentVideo()); // Clean up on unmount
    };
  }, [videoId, dispatch]);

  const handleLikeToggle = () => {
    if (currentUser) {
      dispatch(toggleVideoLike(videoId));
    } else {
      alert('Please login to like videos!');
    }
  };

  const handleSubscribeToggle = () => {
    if (currentUser && currentVideo?.owner?._id) {
      dispatch(toggleSubscription(currentVideo.owner._id));
    } else {
      alert('Please login to subscribe!');
    }
  };

  if (loading && !currentVideo) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error: {error}</div>;
  }

  if (!currentVideo) {
    return <div className="text-gray-400 text-center text-xl mt-8">Video not found.</div>;
  }

  // Helper to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const timeSincePublished = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <div className="lg:w-2/3">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            controls
            src={currentVideo.videoFile?.url}
            poster={currentVideo.thumbnail?.url}
            className="w-full h-full object-contain"
          ></video>
        </div>

        {/* Video Info */}
        <h1 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h1>
        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
          <p>{formatNumber(currentVideo.views)} views • {timeSincePublished(currentVideo.createdAt)}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center px-3 py-1 rounded-full text-sm ${
                currentVideo.isLiked ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{currentVideo.isLiked ? '❤️' : '👍'}</span> {formatNumber(currentVideo.likesCount)}
            </button>
            {/* Share, Save (Playlist) buttons can be added here */}
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between border-t border-b border-gray-700 py-4 mb-4">
          <Link to={`/channel/${currentVideo.owner?.userName}`} className="flex items-center">
            <img
              src={currentVideo.owner?.avatar?.url || "https://via.placeholder.com/50"}
              alt={currentVideo.owner?.fullName}
              className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-600"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{currentVideo.owner?.fullName || currentVideo.owner?.userName}</h3>
              <p className="text-gray-400 text-sm">
                {formatNumber(currentVideo.owner?.subscriberCount)} subscribers
              </p>
            </div>
          </Link>
          {currentUser?._id !== currentVideo.owner?._id && (
            <button
              onClick={handleSubscribeToggle}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                currentVideo.owner?.isSubscribed ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {currentVideo.owner?.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* Video Description */}
        <div className="bg-gray-700 p-4 rounded-lg text-gray-300 text-sm mb-6">
          <p className="whitespace-pre-wrap">{currentVideo.description}</p>
        </div>

        {/* Comments Section */}
        {/* Pass videoId to CommentSection to fetch comments */}
        <CommentSection videoId={videoId} />
      </div>

      {/* Recommended Videos */}
      <div className="lg:w-1/3">
        <h2 className="text-xl font-bold text-white mb-4">Recommended Videos</h2>
        <div className="space-y-4">
          {recommendedVideos.length > 0 ? (
            recommendedVideos.map((video) => (
              <Link to={`/watch/${video._id}`} key={video._id} className="flex items-start bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
                <img
                  src={video.thumbnail?.url}
                  alt={video.title}
                  className="w-32 h-20 object-cover flex-shrink-0"
                />
                <div className="p-3">
                  <h4 className="text-white text-md font-semibold line-clamp-2">{video.title}</h4>
                  <p className="text-gray-400 text-sm">{video.owner?.fullName || video.owner?.userName}</p>
                  <p className="text-gray-500 text-xs">{formatNumber(video.views)} views</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">No recommended videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;