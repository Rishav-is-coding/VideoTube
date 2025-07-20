// videotube-frontend/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice.js';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <header className="bg-gray-800 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          VideoTube
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 hidden sm:inline">Welcome, {user?.fullName || user?.userName}!</span>
              <Link to="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                Upload Video
              </Link>
              <div className="relative group">
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"} // Placeholder for user avatar
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-gray-600 group-hover:border-purple-500 transition-colors"
                />
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block transition-all duration-200 ease-out origin-top-right scale-95 group-hover:scale-100">
                  <Link to={`/channel/${user?.userName}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    Your Channel
                  </Link>
                  <Link to="/liked-videos" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    Liked Videos
                  </Link>
                  <Link to="/history" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    Watch History
                  </Link>
                  <Link to={`/dashboard/${user?.userName}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    Dashboard
                  </Link>
                  <Link to="/update-account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 border-t border-gray-600 mt-1 pt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-200">
                Login
              </Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;