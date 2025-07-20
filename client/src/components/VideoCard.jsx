// videotube-frontend/src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  if (!video) return null;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
    <Link to={`/watch/${video._id}`} className="block w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-video">
        <img
          src={video.thumbnail?.url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{video.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{video.views} views • {timeSincePublished(video.createdAt)}</p>
        {video.owner && (
          <div className="flex items-center mt-3">
            <img
              src={video.owner.avatar?.url || "https://via.placeholder.com/30"}
              alt={video.owner.fullName}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <p className="text-gray-300 text-sm">{video.owner.fullName || video.owner.userName}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;