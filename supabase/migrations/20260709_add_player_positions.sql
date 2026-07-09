-- ============================================================================
-- PLAYER POSITIONS TABLE - Store multiple positions per player with coordinates
-- ============================================================================
CREATE TABLE IF NOT EXISTS player_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position_name TEXT NOT NULL CHECK (position_name IN ('GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CM', 'LM', 'RM', 'CAM', 'CF', 'ST', 'LW', 'RW', 'LF', 'RF', 'FWD', 'MID', 'DEF', 'AM')),
  x_coordinate DECIMAL(5,2) NOT NULL,
  y_coordinate DECIMAL(5,2) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_player_positions_player ON player_positions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_positions_primary ON player_positions(player_id, is_primary);

-- Enable RLS on player_positions
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Player positions are viewable by everyone" ON player_positions FOR SELECT USING (true);

-- Admin write access (service role)
CREATE POLICY "Service role can modify player positions" ON player_positions FOR ALL WITH CHECK (true);
