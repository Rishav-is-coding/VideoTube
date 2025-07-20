// videotube-frontend/src/layouts/ProtectedLayout.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../utils/api.js';
import { setUser, clearAuth } from '../features/auth/authSlice.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx'; // Assuming you have this component
import Header from '../components/Header.jsx'; // Include header for consistent layout
import Footer from '../components/Footer.jsx';
import Sidebar from '../components/Sidebar.jsx';

const ProtectedLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/users/current-user');
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        dispatch(clearAuth()); // Clear user if token is invalid or expired
        navigate('/login');
      } finally {
        setLoadingInitial(false);
      }
    };

    // Only fetch if not already authenticated and user data is missing
    if (!isAuthenticated && !user) {
      fetchCurrentUser();
    } else {
      setLoadingInitial(false);
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  if (loadingInitial) {
    return <LoadingSpinner />;
  }

  // If after initial check, user is not authenticated, redirect
  if (!isAuthenticated) {
    // This redirect might happen again if the first fetchCurrentUser() also fails,
    // but it ensures the user lands on login if not authorized.
    navigate('/login');
    return null;
  }

  // Render children (Outlet) if authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;