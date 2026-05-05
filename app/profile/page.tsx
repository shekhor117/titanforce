'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/supabaseClient';
import { getProfile, updateProfile } from '@/src/profileService';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to view your profile');
        return;
      }

      const result = await getProfile(user.id);
      if (result.success) {
        setProfile(result.data);
        setFormData({ username: result.data.username });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const result = await updateProfile(user.id, { username: formData.username });
      if (result.success) {
        setProfile(result.data[0]);
        setEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      {!editing ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="text-gray-600 font-semibold">User ID:</label>
            <p className="text-lg text-gray-900">{profile.id}</p>
          </div>

          <div>
            <label className="text-gray-600 font-semibold">Username:</label>
            <p className="text-lg text-gray-900">{profile.username}</p>
          </div>

          <div>
            <label className="text-gray-600 font-semibold">Created:</label>
            <p className="text-lg text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({ username: profile.username });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
