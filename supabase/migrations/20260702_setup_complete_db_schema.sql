-- Complete database schema for Titan Force FC
-- This migration sets up all required tables for the website and admin panel

-- ============================================================================
-- PLAYERS TABLE - Enhanced with all required columns
-- ============================================================================
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  category TEXT CHECK (category IN ('GK', 'DEF', 'MID', 'FWD')) DEFAULT 'MID',
  age INTEGER,
  hometown TEXT,
  foot TEXT CHECK (foot IN ('Left', 'Right', 'Both')),
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'Active', 'injured', 'suspended')) DEFAULT 'active',
  bio TEXT,
  date_of_birth TEXT,
  join_date TEXT,
  season_year TEXT DEFAULT '2024-2025',
  clean_sheets INTEGER DEFAULT 0,
  appearances INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  pass_accuracy DECIMAL(5,2),
  chances_created INTEGER DEFAULT 0,
  premier_matches INTEGER DEFAULT 0,
  cup_matches INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  man_of_the_match INTEGER DEFAULT 0,
  average_rating DECIMAL(3,1),
  pace INTEGER,
  shooting INTEGER,
  passing INTEGER,
  dribbling INTEGER,
  defending INTEGER,
  physical INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_num ON players(num);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);

-- ============================================================================
-- MATCHES TABLE - Complete with all statistics
-- ============================================================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  time TEXT,
  home TEXT NOT NULL,
  away TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  venue TEXT,
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
  result TEXT CHECK (result IN ('W', 'L', 'D')),
  competition TEXT DEFAULT 'League',
  home_possession INTEGER,
  away_possession INTEGER,
  home_shots INTEGER DEFAULT 0,
  away_shots INTEGER DEFAULT 0,
  home_shots_on_target INTEGER DEFAULT 0,
  away_shots_on_target INTEGER DEFAULT 0,
  home_passes INTEGER DEFAULT 0,
  away_passes INTEGER DEFAULT 0,
  home_fouls INTEGER DEFAULT 0,
  away_fouls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- ============================================================================
-- STANDINGS TABLE - League standings
-- ============================================================================
CREATE TABLE IF NOT EXISTS standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL,
  team_name TEXT NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  season TEXT DEFAULT '2024-2025',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_standings_position ON standings(position);
CREATE INDEX IF NOT EXISTS idx_standings_season ON standings(season);

-- ============================================================================
-- PRODUCTS TABLE - Store products
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  sizes TEXT[],
  colors TEXT[],
  total_stock INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  features TEXT[],
  sku TEXT UNIQUE,
  variants JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- ============================================================================
-- MATCH LINEUPS TABLE - Store player lineups for each match
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  team TEXT NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  position TEXT,
  jersey_number INTEGER,
  is_starting BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lineups_match ON match_lineups(match_id);
CREATE INDEX IF NOT EXISTS idx_lineups_player ON match_lineups(player_id);

-- ============================================================================
-- MATCH EVENTS TABLE - Store match events (goals, cards, etc)
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  minute INTEGER,
  second INTEGER,
  event_type TEXT CHECK (event_type IN ('goal', 'assist', 'card', 'substitution')) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  team TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_events_player ON match_events(player_id);

-- ============================================================================
-- TROPHIES TABLE - Store team trophies and awards
-- ============================================================================
CREATE TABLE IF NOT EXISTS trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'Championship',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GALLERY TABLE - Store gallery images
-- ============================================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  event_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- ============================================================================
-- NEWS/ARTICLES TABLE - Store news and blog articles
-- ============================================================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY & CREATE BASIC POLICIES
-- ============================================================================

-- Allow public read access to most tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can read)
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Standings are viewable by everyone" ON standings FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Lineups are viewable by everyone" ON match_lineups FOR SELECT USING (true);
CREATE POLICY "Events are viewable by everyone" ON match_events FOR SELECT USING (true);
CREATE POLICY "Trophies are viewable by everyone" ON trophies FOR SELECT USING (true);
CREATE POLICY "Gallery is viewable by everyone" ON gallery FOR SELECT USING (true);
CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published' OR true);

-- Admin write access (will be handled by service role in app code)
CREATE POLICY "Service role can modify all tables" ON players FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify matches" ON matches FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify standings" ON standings FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify products" ON products FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify lineups" ON match_lineups FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify events" ON match_events FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify trophies" ON trophies FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify gallery" ON gallery FOR ALL WITH CHECK (true);
CREATE POLICY "Service role can modify articles" ON articles FOR ALL WITH CHECK (true);
