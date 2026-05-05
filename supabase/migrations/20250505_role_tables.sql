-- Role-based tables for Titan Force FC
-- This migration creates separate tables for players, fans, and partners
-- with approval workflow support

-- Profiles table (main user table)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('player', 'fan', 'partner')) DEFAULT 'fan',
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  position TEXT,
  jersey_number INTEGER,
  phone TEXT,
  age INTEGER,
  height TEXT,
  weight TEXT,
  preferred_foot TEXT,
  experience TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fans table
CREATE TABLE IF NOT EXISTS fans (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  favorite_player UUID REFERENCES players(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved', -- Fans auto-approved
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  partnership_type TEXT CHECK (partnership_type IN ('sponsor', 'media', 'equipment', 'other')),
  website TEXT,
  phone TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Players policies
CREATE POLICY "Anyone can view approved players" ON players
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Players can view own record" ON players
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Players can update own record" ON players
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert players" ON players
  FOR INSERT WITH CHECK (true);

-- Fans policies
CREATE POLICY "Fans can view own record" ON fans
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Fans can update own record" ON fans
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert fans" ON fans
  FOR INSERT WITH CHECK (true);

-- Partners policies
CREATE POLICY "Anyone can view approved partners" ON partners
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Partners can view own record" ON partners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update own record" ON partners
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert partners" ON partners
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fans_updated_at BEFORE UPDATE ON fans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
