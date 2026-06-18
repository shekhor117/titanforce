-- Create events table for matches and tournaments
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('match', 'tournament', 'training', 'other')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  location_coordinates POINT,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'cancelled')),
  capacity INTEGER,
  registration_open BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Match specific fields
  opponent_name TEXT,
  match_time TIME,
  home_team TEXT,
  away_team TEXT,
  score_home INTEGER,
  score_away INTEGER,
  result TEXT CHECK (result IS NULL OR result IN ('won', 'lost', 'draw')),
  -- Tournament specific fields
  tournament_name TEXT,
  round TEXT
);

-- Create indexes for faster queries
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published upcoming events
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (status = 'published');

-- Admin can view all events
CREATE POLICY "Admin can view all events" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can create events
CREATE POLICY "Admin can create events" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can update events
CREATE POLICY "Admin can update events" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can delete events
CREATE POLICY "Admin can delete events" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_update_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();
