// videotube-frontend/src/features/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      // If already authenticated, redirect to home.
      // Use a small timeout to allow any Redux state updates to settle,
      // though typically not strictly necessary here.
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 50);
      return () => clearTimeout(redirectTimer); // Cleanup timeout
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // <--- THIS IS CRUCIAL: Prevents default browser form submission (page reload)

    const credentials = {
      email: emailOrUsername.includes('@') ? emailOrUsername : undefined,
      userName: !emailOrUsername.includes('@') ? emailOrUsername : undefined,
      password,
    };
    // Clean up undefined fields to avoid sending them if not applicable
    Object.keys(credentials).forEach(key => credentials[key] === undefined && delete credentials[key]);

    console.log("Attempting login with credentials:", credentials); // Log credentials being sent

    const resultAction = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Login successful:", resultAction.payload);
      // On successful login, navigate.
      // A small delay can sometimes help ensure Redux state is fully propagated
      // before navigating, though React Router is usually fast enough.
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 100);
      return () => clearTimeout(redirectTimer); // Cleanup timeout
    } else {
      // Login failed. The 'error' state from Redux should now be updated.
      console.error("Login failed. Error from Redux state:", error);
      // The error message will be displayed by the JSX below.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to VideoTube</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-300 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Display error message prominently */}
          {error && (
            <p className="text-red-500 text-sm text-center p-2 border border-red-700 bg-red-900 bg-opacity-30 rounded-md">
              Error: {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:text-purple-500 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;