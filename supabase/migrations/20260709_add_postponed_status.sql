-- Add 'postponed' status option to matches table
-- Drop the existing constraint
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_status_check;

-- Add new constraint with postponed status
ALTER TABLE matches ADD CONSTRAINT matches_status_check CHECK (status IN ('upcoming', 'live', 'completed', 'postponed'));
