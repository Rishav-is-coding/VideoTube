// videotube-frontend/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// Interceptor for handling token refresh or unauthorized access
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and it's not a retry attempt
    // Also, ensure it's not the logout request itself, to avoid infinite loops
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/users/logout') {
      originalRequest._retry = true; // Mark as retried

      try {
        // Attempt to refresh the access token using the refresh-token endpoint
        const refreshResponse = await api.post('/users/refresh-token');

        if (refreshResponse.status === 200) {
          // Token refreshed successfully, retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed or refresh token expired:", refreshError);
        // If refresh fails, clear authentication and redirect to login
        // This assumes your Redux store has a way to clear auth state
        // You might need to dispatch an action here or handle it in ProtectedLayout
        window.location.href = '/login'; // Force redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;