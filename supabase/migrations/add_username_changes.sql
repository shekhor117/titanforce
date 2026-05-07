-- Add username change tracking
-- Allows users to change their username/user_id up to 3 times

-- Add username change columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username_changes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_username_change_at TIMESTAMPTZ;

-- Add username change columns to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE players ADD COLUMN IF NOT EXISTS username_changes INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS last_username_change_at TIMESTAMPTZ;

-- Add username change columns to fans table
ALTER TABLE fans ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE fans ADD COLUMN IF NOT EXISTS username_changes INTEGER DEFAULT 0;
ALTER TABLE fans ADD COLUMN IF NOT EXISTS last_username_change_at TIMESTAMPTZ;

-- Add username change columns to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS username_changes INTEGER DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS last_username_change_at TIMESTAMPTZ;

-- Create a function to check if user can change username
CREATE OR REPLACE FUNCTION can_change_username(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(username_changes, 0) < 3 
    FROM profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to change username
CREATE OR REPLACE FUNCTION change_username(user_id UUID, new_username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_can_change BOOLEAN;
  v_changes INTEGER;
BEGIN
  -- Check if user can change username
  v_can_change := can_change_username(user_id);
  
  IF NOT v_can_change THEN
    RETURN FALSE;
  END IF;
  
  -- Get current changes count
  SELECT COALESCE(username_changes, 0) INTO v_changes FROM profiles WHERE id = user_id;
  
  -- Update profiles table
  UPDATE profiles 
  SET username = new_username,
      username_changes = v_changes + 1,
      last_username_change_at = NOW(),
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
