// videotube-frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const DashboardPage = () => {
  const { userName } = useParams();
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !currentUser || currentUser.userName !== userName) {
        setLoading(false);
        setError('Unauthorized access. You can only view your own dashboard.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/users/c/${userName}/dashboard`);
        setDashboardData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userName, isAuthenticated, currentUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-gray-400 text-center text-xl mt-8">No dashboard data available.</div>;
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard for @{userName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-gray-400 text-lg mb-2">Total Views</h3>
          <p className="text-white text-4xl font-bold">{formatNumber(dashboardData.totalViews)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-gray-400 text-lg mb-2">Total Subscribers</h3>
          <p className="text-white text-4xl font-bold">{formatNumber(dashboardData.totalSubscribers)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-gray-400 text-lg mb-2">Total Videos</h3>
          <p className="text-white text-4xl font-bold">{dashboardData.totalVideos?.length || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-gray-400 text-lg mb-2">Total Likes</h3>
          <p className="text-white text-4xl font-bold">{formatNumber(dashboardData.totalLikes)}</p>
        </div>
      </div>

      {/* You can add more detailed charts or lists here */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Your Videos Overview</h2>
        {dashboardData.totalVideos && dashboardData.totalVideos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Published
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {dashboardData.totalVideos.map((video) => (
                  <tr key={video._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex items-center">
                        <img src={video.thumbnail?.url} alt={video.title} className="w-16 h-10 object-cover rounded-md mr-3" />
                        <span className="truncate max-w-xs">{video.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatNumber(video.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {video.isPublished ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-600 mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">You haven't uploaded any videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;