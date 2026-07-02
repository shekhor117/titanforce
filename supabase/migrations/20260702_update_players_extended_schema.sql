-- Update players table with all required columns for extended schema
-- Check if players table exists and add missing columns

-- First, let's ensure the extended players table with all columns exists
CREATE TABLE IF NOT EXISTS players_v2 AS
SELECT 
  id,
  email,
  name,
  avatar_url,
  position,
  jersey_number as num,
  phone,
  age,
  height,
  weight,
  preferred_foot as foot,
  experience,
  status,
  approved_by,
  approved_at,
  created_at,
  updated_at,
  -- Extended columns with defaults
  COALESCE(0, NULL) as full_name,
  COALESCE('player', NULL) as category,
  COALESCE('', NULL) as hometown,
  COALESCE('Right', NULL) as goals,
  COALESCE(0, NULL) as assists,
  COALESCE('', NULL) as image_url,
  COALESCE('', NULL) as bio,
  COALESCE(0, NULL) as clean_sheets,
  COALESCE(0, NULL) as appearances,
  COALESCE(0, NULL) as minutes_played,
  COALESCE(0, NULL) as pass_accuracy,
  COALESCE(0, NULL) as chances_created,
  COALESCE(0, NULL) as premier_matches,
  COALESCE(0, NULL) as cup_matches,
  COALESCE(0, NULL) as yellow_cards,
  COALESCE(0, NULL) as red_cards,
  COALESCE(0, NULL) as man_of_the_match,
  COALESCE(0, NULL) as average_rating,
  COALESCE(0, NULL) as pace,
  COALESCE(0, NULL) as shooting,
  COALESCE(0, NULL) as passing,
  COALESCE(0, NULL) as dribbling,
  COALESCE(0, NULL) as defending,
  COALESCE(0, NULL) as physical,
  COALESCE(NULL, NULL) as date_of_birth,
  COALESCE(NULL, NULL) as join_date,
  COALESCE('2024-2025', NULL) as season_year,
  COALESCE('Titan Force FC', NULL) as club,
  COALESCE('Bangladesh', NULL) as nationality
FROM players;

-- Drop old players table if it exists
DROP TABLE IF EXISTS players CASCADE;

-- Rename new table to players
ALTER TABLE players_v2 RENAME TO players;

-- Set primary key
ALTER TABLE players ADD PRIMARY KEY (id);

-- Add foreign key constraint
ALTER TABLE players ADD CONSTRAINT players_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Anyone can view approved players" ON players
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Players can view own record" ON players
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Players can update own record" ON players
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage players" ON players
  FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
CREATE INDEX IF NOT EXISTS idx_players_num ON players(num);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_players_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_players_updated_at_trigger ON players;
CREATE TRIGGER update_players_updated_at_trigger BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_players_updated_at();
