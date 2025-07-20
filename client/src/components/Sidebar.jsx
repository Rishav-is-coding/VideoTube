// videotube-frontend/src/components/Sidebar.jsx
import React, { useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { getSubscribedChannels, clearSubscriptions } from '../features/subscription/subscriptionSlice.js'; // Import thunk and action

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Get user as well
  const { subscribedChannels, loading: subscriptionsLoading, error: subscriptionsError } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (isAuthenticated && user?.userName) {
      dispatch(getSubscribedChannels(user.userName));
    } else {
      // Clear subscriptions if user logs out
      dispatch(clearSubscriptions());
    }
  }, [isAuthenticated, user, dispatch]); // Re-run when auth status or user changes

  return (
    <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700 h-full overflow-y-auto hidden md:block custom-scrollbar"> {/* Added custom-scrollbar class */}
      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md">
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/upload" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md">
              <span className="text-xl">⬆️</span>
              <span>Upload</span>
            </Link>
            <Link to="/liked-videos" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md">
              <span className="text-xl">👍</span>
              <span>Liked Videos</span>
            </Link>
            <Link to="/history" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md">
              <span className="text-xl">🕒</span>
              <span>Watch History</span>
            </Link>
            <Link to="/create-playlist" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md">
              <span className="text-xl">➕</span>
              <span>Create Playlist</span>
            </Link>
            {/* Add more specific links here based on user data */}
          </>
        )}
        <hr className="border-gray-700 my-4" /> {/* Added margin for better separation */}
        <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase">Subscriptions</h3>

        {isAuthenticated ? (
          subscriptionsLoading ? (
            <p className="text-gray-500 text-sm">Loading subscriptions...</p>
          ) : subscriptionsError ? (
            <p className="text-red-400 text-sm">Error loading subscriptions.</p>
          ) : subscribedChannels.length > 0 ? (
            <div className="space-y-2">
              {subscribedChannels.map((channel) => (
                <Link
                  to={`/channel/${channel.userName}`}
                  key={channel._id}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                >
                  <img
                    src={channel.avatar?.url || "https://via.placeholder.com/24"}
                    alt={channel.fullName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{channel.fullName}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No subscriptions yet.</p>
          )
        ) : (
          <p className="text-gray-500 text-sm">Login to see subscriptions</p>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;