// videotube-frontend/src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-16 h-16 border-4 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;