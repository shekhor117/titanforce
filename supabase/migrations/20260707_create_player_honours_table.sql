-- Create player_honours junction table for many-to-many relationship
-- This allows players to have multiple honours and honours to be awarded to multiple players

CREATE TABLE IF NOT EXISTS honours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT CHECK (category IN ('league', 'cup', 'championship', 'tournament')) DEFAULT 'league',
  description TEXT,
  icon TEXT DEFAULT '🏆',
  runners_up TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_honours_year ON honours(year);
CREATE INDEX IF NOT EXISTS idx_honours_category ON honours(category);
CREATE INDEX IF NOT EXISTS idx_honours_featured ON honours(featured);

-- Junction table for player-honours relationship
CREATE TABLE IF NOT EXISTS player_honours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  honour_id UUID NOT NULL REFERENCES honours(id) ON DELETE CASCADE,
  awarded_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, honour_id)
);

CREATE INDEX IF NOT EXISTS idx_player_honours_player ON player_honours(player_id);
CREATE INDEX IF NOT EXISTS idx_player_honours_honour ON player_honours(honour_id);

-- Enable Row Level Security for player_honours
ALTER TABLE player_honours ENABLE ROW LEVEL SECURITY;
ALTER TABLE honours ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to read honours
CREATE POLICY "Allow public to read honours" ON honours FOR SELECT USING (true);

-- RLS Policy: Allow public to read player_honours
CREATE POLICY "Allow public to read player_honours" ON player_honours FOR SELECT USING (true);
