import { supabase } from './supabaseClient';

// Create a new user profile
export const createProfile = async (userId, username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating profile:', error.message);
    return { success: false, error: error.message };
  }
};

// Get profile by user ID
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return { success: false, error: error.message };
  }
};

// Get profile by username
export const getProfileByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching profile by username:', error.message);
    return { success: false, error: error.message };
  }
};

// Update profile
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete profile
export const deleteProfile = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting profile:', error.message);
    return { success: false, error: error.message };
  }
};

// Check if username is available
export const checkUsernameAvailable = async (username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      return { success: true, available: true };
    }
    
    return { success: true, available: false };
  } catch (error) {
    console.error('Error checking username:', error.message);
    return { success: false, error: error.message };
  }
};
