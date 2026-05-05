-- ============================================================================
-- TITAN FORCE - SUPABASE SQL SCHEMA
-- Complete database setup with RLS policies for secure user data isolation
-- ============================================================================

-- ============================================================================
-- 1. PLAYER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  jersey INT UNIQUE NOT NULL,
  position TEXT NOT NULL, -- "GK", "CB", "RB", "LB", "CM", "CAM", "CDM", "RW", "LW", "ST", "CF"
  age INT NOT NULL,
  address TEXT,
  foot TEXT NOT NULL DEFAULT 'Right', -- "Left", "Right", "Both"
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  clean_sheets INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_profiles_select_all" ON public.player_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "player_profiles_insert_own" ON public.player_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "player_profiles_update_own" ON public.player_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "player_profiles_delete_own" ON public.player_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 2. MATCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID, -- Optional: for multi-team support
  opponent TEXT NOT NULL,
  match_date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- "upcoming", "completed", "cancelled"
  titan_force_goals INT DEFAULT 0,
  opponent_goals INT DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_all" ON public.matches
  FOR SELECT USING (TRUE);

CREATE POLICY "matches_insert_auth" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "matches_update_own" ON public.matches
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "matches_delete_own" ON public.matches
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================================
-- 3. PLAYER STATISTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  season TEXT NOT NULL DEFAULT '2024-2025',
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  appearances INT DEFAULT 0,
  minutes_played INT DEFAULT 0,
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_stats_select_all" ON public.player_stats
  FOR SELECT USING (TRUE);

CREATE POLICY "player_stats_update_own" ON public.player_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TEAM FORMATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.team_formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
  formation TEXT NOT NULL DEFAULT '4-3-3', -- "4-3-3", "4-2-3-1", "3-5-2", "5-3-2", "4-4-2"
  starting_lineup JSONB, -- Array of player IDs in formation order
  substitutions JSONB, -- Array of substitution objects
  tactics TEXT, -- Tactical description/notes
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.team_formations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_formations_select_all" ON public.team_formations
  FOR SELECT USING (TRUE);

CREATE POLICY "team_formations_insert_own" ON public.team_formations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "team_formations_update_own" ON public.team_formations
  FOR UPDATE USING (auth.uid() = created_by);

-- ============================================================================
-- 5. MATCH EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'card', 'substitution', 'milestone')),
  player_id UUID REFERENCES public.profiles(id),
  minute INT NOT NULL,
  description TEXT,
  metadata JSONB, -- Additional event details
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "match_events_select_all" ON public.match_events
  FOR SELECT USING (TRUE);

CREATE POLICY "match_events_insert_own" ON public.match_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ============================================================================
-- 6. NEWS POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_posts_select_published" ON public.news_posts
  FOR SELECT USING (published = TRUE);

CREATE POLICY "news_posts_select_own_draft" ON public.news_posts
  FOR SELECT USING (admin_id = auth.uid());

CREATE POLICY "news_posts_insert_auth" ON public.news_posts
  FOR INSERT WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "news_posts_update_own" ON public.news_posts
  FOR UPDATE USING (auth.uid() = admin_id);

CREATE POLICY "news_posts_delete_own" ON public.news_posts
  FOR DELETE USING (auth.uid() = admin_id);

-- ============================================================================
-- 7. NEWS COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.news_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_comments_select_all" ON public.news_comments
  FOR SELECT USING (TRUE);

CREATE POLICY "news_comments_insert_auth" ON public.news_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "news_comments_update_own" ON public.news_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "news_comments_delete_own" ON public.news_comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 8. FAN ACCOUNTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.fan_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  favorite_player_id UUID REFERENCES public.profiles(id),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.fan_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fan_accounts_select_own" ON public.fan_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "fan_accounts_insert_own" ON public.fan_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fan_accounts_update_own" ON public.fan_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 9. FAN FAVORITES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.fan_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(fan_user_id, player_user_id)
);

ALTER TABLE public.fan_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fan_favorites_select_own" ON public.fan_favorites
  FOR SELECT USING (auth.uid() = fan_user_id);

CREATE POLICY "fan_favorites_insert_own" ON public.fan_favorites
  FOR INSERT WITH CHECK (auth.uid() = fan_user_id);

CREATE POLICY "fan_favorites_delete_own" ON public.fan_favorites
  FOR DELETE USING (auth.uid() = fan_user_id);

-- ============================================================================
-- 10. SAVED MATCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

ALTER TABLE public.saved_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_matches_select_own" ON public.saved_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_matches_insert_own" ON public.saved_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_matches_delete_own" ON public.saved_matches
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Player lookups
CREATE INDEX idx_player_profiles_user_id ON public.player_profiles(user_id);
CREATE INDEX idx_player_profiles_position ON public.player_profiles(position);

-- Match lookups
CREATE INDEX idx_matches_created_by ON public.matches(created_by);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_date ON public.matches(match_date);

-- Stats lookups
CREATE INDEX idx_player_stats_user_id ON public.player_stats(user_id);
CREATE INDEX idx_player_stats_season ON public.player_stats(season);

-- Formation lookups
CREATE INDEX idx_team_formations_match_id ON public.team_formations(match_id);

-- Match events lookups
CREATE INDEX idx_match_events_match_id ON public.match_events(match_id);
CREATE INDEX idx_match_events_player_id ON public.match_events(player_id);
CREATE INDEX idx_match_events_event_type ON public.match_events(event_type);

-- News lookups
CREATE INDEX idx_news_posts_published ON public.news_posts(published);
CREATE INDEX idx_news_posts_admin_id ON public.news_posts(admin_id);
CREATE INDEX idx_news_comments_post_id ON public.news_comments(post_id);
CREATE INDEX idx_news_comments_user_id ON public.news_comments(user_id);

-- Fan data lookups
CREATE INDEX idx_fan_favorites_fan_user_id ON public.fan_favorites(fan_user_id);
CREATE INDEX idx_fan_favorites_player_user_id ON public.fan_favorites(player_user_id);
CREATE INDEX idx_saved_matches_user_id ON public.saved_matches(user_id);
CREATE INDEX idx_saved_matches_match_id ON public.saved_matches(match_id);

-- ============================================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================================
-- 
-- 1. RLS Policies Explained:
--    - SELECT USING (TRUE) = Anyone can read public data
--    - INSERT/UPDATE/DELETE WITH CHECK (auth.uid() = user_id) = User can only modify their own data
--    - Only admins should have INSERT privileges on certain tables (enforce in application layer)
--
-- 2. For admin-only operations:
--    - Check user role in application before allowing table modifications
--    - Consider adding an admin_users table if needed for fine-grained control
--
-- 3. JSONB Fields (starting_lineup, metadata):
--    - Store structured data that doesn't fit single columns
--    - Query with -> and @> operators in PostgreSQL
--    - Example: WHERE metadata->>'type' = 'own_goal'
--
-- 4. Cascading Deletes:
--    - ON DELETE CASCADE ensures orphaned records are removed automatically
--    - When a user is deleted, all their related data is removed
--
-- ============================================================================
