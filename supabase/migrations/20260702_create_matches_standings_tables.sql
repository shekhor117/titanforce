-- Create matches table for Titan Force FC
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home TEXT NOT NULL,
  away TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  date TEXT NOT NULL,
  time TEXT,
  venue TEXT,
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
  result TEXT CHECK (result IN ('W', 'L', 'D', NULL)) DEFAULT NULL,
  season_year TEXT,
  notes TEXT,
  lineup_data JSONB DEFAULT '{}',
  statistics_data JSONB DEFAULT '{}',
  goals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create standings table for Titan Force FC
CREATE TABLE IF NOT EXISTS standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  season_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

-- Matches policies
CREATE POLICY "Anyone can view matches" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage matches" ON matches
  FOR ALL USING (true);

-- Standings policies
CREATE POLICY "Anyone can view standings" ON standings
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage standings" ON standings
  FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_standings_position ON standings(position);
CREATE INDEX IF NOT EXISTS idx_standings_season ON standings(season_year);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_standings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_matches_updated_at_trigger BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_matches_updated_at();

CREATE TRIGGER update_standings_updated_at_trigger BEFORE UPDATE ON standings
  FOR EACH ROW EXECUTE FUNCTION update_standings_updated_at();
