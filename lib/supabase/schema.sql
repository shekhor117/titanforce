-- Titanforce Database Schema
-- This file contains all necessary table definitions and configurations

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- OTP Codes Table
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- App Users Table
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'player', 'fan', 'partner', 'user')) DEFAULT 'user',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'banned')) DEFAULT 'active',
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Standings Table
CREATE TABLE IF NOT EXISTS public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  points INT DEFAULT 0,
  goal_difference INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INT,
  away_score INT,
  status TEXT CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')) DEFAULT 'scheduled',
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  league TEXT,
  venue TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON public.otp_codes(code);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON public.app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_auth_id ON public.app_users(auth_id);

CREATE INDEX IF NOT EXISTS idx_standings_position ON public.standings(position);
CREATE INDEX IF NOT EXISTS idx_standings_team_name ON public.standings(team_name);

CREATE INDEX IF NOT EXISTS idx_matches_match_date ON public.matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_league ON public.matches(league);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- OTP Codes RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow service role full access on otp_codes"
  ON public.otp_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Contact Messages RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public to insert contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow service role full access on contact_messages"
  ON public.contact_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- App Users RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public to view active users"
  ON public.app_users
  FOR SELECT
  USING (status = 'active');

CREATE POLICY IF NOT EXISTS "Allow users to view own profile"
  ON public.app_users
  FOR SELECT
  USING (auth_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Allow service role full access on app_users"
  ON public.app_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Standings RLS
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public to view standings"
  ON public.standings
  FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow service role to manage standings"
  ON public.standings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Matches RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public to view matches"
  ON public.matches
  FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow service role to manage matches"
  ON public.matches
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 4. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_otp_codes_updated_at ON public.otp_codes;
CREATE TRIGGER update_otp_codes_updated_at
  BEFORE UPDATE ON public.otp_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_users_updated_at ON public.app_users;
CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_standings_updated_at ON public.standings;
CREATE TRIGGER update_standings_updated_at
  BEFORE UPDATE ON public.standings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-cleanup function for expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. GRANTS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_users TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.standings TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_otps() TO anon, authenticated, service_role;
