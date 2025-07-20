// videotube-frontend/src/features/auth/UpdateAccountPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountDetails, updateAvatar, updateCoverImage } from './authSlice';

const UpdateAccountPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setMessage('');
    const resultAction = await dispatch(updateAccountDetails({ fullName, email }));
    if (updateAccountDetails.fulfilled.match(resultAction)) {
      setMessage('Account details updated successfully!');
    } else {
      setMessage(error || 'Failed to update account details.');
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!avatarFile) {
      setMessage('Please select an avatar file.');
      return;
    }
    const resultAction = await dispatch(updateAvatar(avatarFile));
    if (updateAvatar.fulfilled.match(resultAction)) {
      setMessage('Avatar updated successfully!');
      setAvatarFile(null); // Clear file input
      e.target.reset();
    } else {
      setMessage(error || 'Failed to update avatar.');
    }
  };

  const handleUpdateCoverImage = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!coverImageFile) {
      setMessage('Please select a cover image file.');
      return;
    }
    const resultAction = await dispatch(updateCoverImage(coverImageFile));
    if (updateCoverImage.fulfilled.match(resultAction)) {
      setMessage('Cover image updated successfully!');
      setCoverImageFile(null); // Clear file input
      e.target.reset();
    } else {
      setMessage(error || 'Failed to update cover image.');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Account Settings</h2>

      {message && (
        <p className={`text-center text-base ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      {loading && <p className="text-center text-blue-400">Updating...</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Update Full Name and Email */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-white">Update Profile Details</h3>
        <form onSubmit={handleUpdateDetails} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            Update Details
          </button>
        </form>
      </div>

      {/* Update Avatar */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-white">Update Avatar</h3>
        {user?.avatar && (
          <div className="mb-4 text-center">
            <p className="text-gray-400 text-sm mb-2">Current Avatar:</p>
            <img src={user.avatar} alt="Current Avatar" className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-600" />
          </div>
        )}
        <form onSubmit={handleUpdateAvatar} className="space-y-4">
          <div>
            <label htmlFor="avatarFile" className="block text-sm font-medium text-gray-300 mb-1">
              New Avatar
            </label>
            <input
              type="file"
              id="avatarFile"
              accept="image/*"
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            Update Avatar
          </button>
        </form>
      </div>

      {/* Update Cover Image */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-white">Update Cover Image</h3>
        {user?.coverImage && (
          <div className="mb-4 text-center">
            <p className="text-gray-400 text-sm mb-2">Current Cover Image:</p>
            <img src={user.coverImage} alt="Current Cover" className="w-full h-32 object-cover rounded-md mx-auto border-2 border-gray-600" />
          </div>
        )}
        <form onSubmit={handleUpdateCoverImage} className="space-y-4">
          <div>
            <label htmlFor="coverImageFile" className="block text-sm font-medium text-gray-300 mb-1">
              New Cover Image
            </label>
            <input
              type="file"
              id="coverImageFile"
              accept="image/*"
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
              onChange={(e) => setCoverImageFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            Update Cover Image
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccountPage;