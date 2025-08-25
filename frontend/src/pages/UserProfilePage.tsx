import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    // Add other editable fields here e.g., department, position
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // The user object in context needs to be updated after this call.
      // A full implementation would involve refetching the user or updating the context manually.
      await api.patch('/users/me/', formData);
      alert('Profile updated successfully! Changes will be reflected on next login.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {!isEditing ? (
          <div>
            <p className="mb-2"><strong>Username:</strong> {user.username}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-4"><strong>Full Name:</strong> {user.full_name || 'Not provided'}</p>
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Edit Profile
            </button>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {/* Add other form fields here */}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Save Changes
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
