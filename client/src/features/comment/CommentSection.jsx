// videotube-frontend/src/features/comment/CommentSection.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoComments, addComment, updateComment, deleteComment, clearComments } from './commentSlice.js';
import { toggleCommentLike } from '../like/likeSlice.js'; // Assuming you have this slice and action
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, totalComments, loading, error } = useSelector((state) => state.comment);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoComments({ videoId }));
    }
    return () => {
      dispatch(clearComments()); // Clear comments when leaving video
    };
  }, [videoId, dispatch]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to add a comment.');
      return;
    }
    if (!newCommentContent.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    await dispatch(addComment({ videoId, content: newCommentContent }));
    setNewCommentContent('');
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (!editingCommentContent.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    await dispatch(updateComment({ commentId, content: editingCommentContent }));
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await dispatch(deleteComment(commentId));
    }
  };

  const handleToggleLikeComment = async (commentId) => {
    if (!currentUser) {
      alert('Please login to like comments.');
      return;
    }
    // Dispatch action to toggle like on comment
    await dispatch(toggleCommentLike(commentId));
    // Re-fetch comments to update like counts/status (or implement optimistic update in slice)
    dispatch(getVideoComments({ videoId }));
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


  return (
    <div className="comment-section bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">{totalComments} Comments</h2>

      {/* Add New Comment */}
      {currentUser && (
        <form onSubmit={handleAddComment} className="flex flex-col mb-6 space-y-3">
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            rows="3"
            placeholder="Add a comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="self-end px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Comment'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <LoadingSpinner />
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-4 bg-gray-700 p-4 rounded-lg shadow">
              <img
                src={comment.owner?.avatar?.url || "https://via.placeholder.com/40"}
                alt={comment.owner?.fullName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-600"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-white">{comment.owner?.fullName || comment.owner?.userName}</span>
                  <span className="text-gray-400 text-xs">{timeSincePosted(comment.createdAt)}</span>
                </div>
                {editingCommentId === comment._id ? (
                  <form onSubmit={(e) => handleUpdateComment(e, comment._id)} className="space-y-2">
                    <textarea
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
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
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                )}

                <div className="flex items-center space-x-4 mt-2 text-gray-400 text-sm">
                  <button
                    onClick={() => handleToggleLikeComment(comment._id)}
                    className={`flex items-center hover:text-white transition-colors duration-200 ${comment.isLiked ? 'text-blue-400' : ''}`}
                  >
                    <span className="mr-1">{comment.isLiked ? '❤️' : '👍'}</span> {comment.likesCount}
                  </button>
                  {currentUser?._id === comment.owner?._id && (
                    <>
                      <button onClick={() => handleEditComment(comment)} className="hover:text-white transition-colors duration-200">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-400 transition-colors duration-200">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;