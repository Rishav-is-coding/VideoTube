// videotube-frontend/src/pages/UserTweetsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTweets, createTweet, updateTweet, deleteTweet, clearTweets } from '../features/tweet/tweetSlice.js';
import { toggleTweetLike } from '../features/like/likeSlice.js'; // Assuming this slice and action
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const UserTweetsPage = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { tweets, loading, error } = useSelector((state) => state.tweet);
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);

  const [newTweetContent, setNewTweetContent] = useState('');
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editingTweetContent, setEditingTweetContent] = useState('');

  useEffect(() => {
    if (userName) {
      dispatch(getUserTweets(userName));
    }
    return () => {
      dispatch(clearTweets()); // Clear tweets on unmount
    };
  }, [userName, dispatch]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to create a tweet.');
      return;
    }
    if (!newTweetContent.trim()) {
      alert('Tweet content cannot be empty.');
      return;
    }
    await dispatch(createTweet(newTweetContent));
    setNewTweetContent('');
    // Re-fetch user tweets to update the list
    dispatch(getUserTweets(userName));
  };

  const handleEditTweet = (tweet) => {
    setEditingTweetId(tweet._id);
    setEditingTweetContent(tweet.content);
  };

  const handleUpdateTweet = async (e, tweetId) => {
    e.preventDefault();
    if (!editingTweetContent.trim()) {
      alert('Tweet content cannot be empty.');
      return;
    }
    await dispatch(updateTweet({ tweetId, content: editingTweetContent }));
    setEditingTweetId(null);
    setEditingTweetContent('');
    // Re-fetch user tweets to update the list
    dispatch(getUserTweets(userName));
  };

  const handleDeleteTweet = async (tweetId) => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      await dispatch(deleteTweet(tweetId));
      // Re-fetch user tweets to update the list
      dispatch(getUserTweets(userName));
    }
  };

  const handleToggleLikeTweet = async (tweetId) => {
    if (!isAuthenticated) {
      alert('Please login to like tweets.');
      return;
    }
    await dispatch(toggleTweetLike(tweetId));
    // Re-fetch user tweets to update like counts/status
    dispatch(getUserTweets(userName));
  };

  const timeSincePosted = (dateString) => {
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


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error loading tweets: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Tweets by @{userName}</h1>

      {/* Create New Tweet Section (only if current user is viewing their own page) */}
      {currentUser?.userName === userName && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Create a New Tweet</h2>
          <form onSubmit={handleCreateTweet} className="flex flex-col space-y-3">
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows="4"
              placeholder="What's on your mind?"
              value={newTweetContent}
              onChange={(e) => setNewTweetContent(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="self-end px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Tweeting...' : 'Tweet'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      )}

      {/* Tweets List */}
      {tweets.length > 0 ? (
        <div className="space-y-6">
          {tweets.map((tweet) => (
            <div key={tweet._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={tweet.owner?.avatar?.url || "https://via.placeholder.com/40"}
                  alt={tweet.owner?.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <span className="font-semibold text-white">{tweet.owner?.fullName}</span>
                  <span className="text-gray-400 text-sm ml-2">@{tweet.owner?.userName}</span>
                  <span className="text-gray-500 text-xs ml-2"> • {timeSincePosted(tweet.createdAt)}</span>
                </div>
              </div>
              {editingTweetId === tweet._id ? (
                <form onSubmit={(e) => handleUpdateTweet(e, tweet._id)} className="space-y-2">
                  <textarea
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={editingTweetContent}
                    onChange={(e) => setEditingTweetContent(e.target.value)}
                  ></textarea>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTweetId(null)}
                      className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{tweet.content}</p>
              )}

              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <button
                  onClick={() => handleToggleLikeTweet(tweet._id)}
                  className={`flex items-center hover:text-white transition-colors duration-200 ${tweet.isLiked ? 'text-blue-400' : ''}`}
                >
                  <span className="mr-1">{tweet.isLiked ? '❤️' : '👍'}</span> {tweet.likesCount}
                </button>
                {currentUser?._id === tweet.owner?._id && (
                  <>
                    <button onClick={() => handleEditTweet(tweet)} className="hover:text-white transition-colors duration-200">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTweet(tweet._id)} className="hover:text-red-400 transition-colors duration-200">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-xl mt-8">@{userName} has no tweets yet.</p>
      )}
    </div>
  );
};

export default UserTweetsPage;