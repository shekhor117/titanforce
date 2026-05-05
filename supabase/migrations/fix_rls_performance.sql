-- Supabase RLS Performance Optimization Migration
-- Replaces auth.uid() with (select auth.uid()) to prevent re-evaluation for each row
-- This significantly improves query performance at scale

-- ============================================================================
-- player_profiles table
-- ============================================================================
DROP POLICY IF EXISTS player_profiles_insert_own ON public.player_profiles;
CREATE POLICY player_profiles_insert_own ON public.player_profiles
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS player_profiles_update_own ON public.player_profiles;
CREATE POLICY player_profiles_update_own ON public.player_profiles
  FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS player_profiles_delete_own ON public.player_profiles;
CREATE POLICY player_profiles_delete_own ON public.player_profiles
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================================
-- matches table
-- ============================================================================
DROP POLICY IF EXISTS matches_insert_auth ON public.matches;
CREATE POLICY matches_insert_auth ON public.matches
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS matches_update_own ON public.matches;
CREATE POLICY matches_update_own ON public.matches
  FOR UPDATE USING (created_by = (select auth.uid()));

DROP POLICY IF EXISTS matches_delete_own ON public.matches;
CREATE POLICY matches_delete_own ON public.matches
  FOR DELETE USING (created_by = (select auth.uid()));

-- ============================================================================
-- profiles table
-- ============================================================================
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (id = (select auth.uid()));

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = (select auth.uid()));

-- ============================================================================
-- player_stats table
-- ============================================================================
DROP POLICY IF EXISTS player_stats_update_own ON public.player_stats;
CREATE POLICY player_stats_update_own ON public.player_stats
  FOR UPDATE USING (user_id = (select auth.uid()));

-- ============================================================================
-- team_formations table
-- ============================================================================
DROP POLICY IF EXISTS team_formations_insert_own ON public.team_formations;
CREATE POLICY team_formations_insert_own ON public.team_formations
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS team_formations_update_own ON public.team_formations;
CREATE POLICY team_formations_update_own ON public.team_formations
  FOR UPDATE USING (created_by = (select auth.uid()));

-- ============================================================================
-- match_events table
-- ============================================================================
DROP POLICY IF EXISTS match_events_insert_own ON public.match_events;
CREATE POLICY match_events_insert_own ON public.match_events
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));

-- ============================================================================
-- news_posts table
-- ============================================================================
DROP POLICY IF EXISTS news_posts_select_own_draft ON public.news_posts;
CREATE POLICY news_posts_select_own_draft ON public.news_posts
  FOR SELECT USING (status = 'published' OR created_by = (select auth.uid()));

DROP POLICY IF EXISTS news_posts_insert_auth ON public.news_posts;
CREATE POLICY news_posts_insert_auth ON public.news_posts
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS news_posts_update_own ON public.news_posts;
CREATE POLICY news_posts_update_own ON public.news_posts
  FOR UPDATE USING (created_by = (select auth.uid()));

DROP POLICY IF EXISTS news_posts_delete_own ON public.news_posts;
CREATE POLICY news_posts_delete_own ON public.news_posts
  FOR DELETE USING (created_by = (select auth.uid()));

-- ============================================================================
-- news_comments table
-- ============================================================================
DROP POLICY IF EXISTS news_comments_insert_auth ON public.news_comments;
CREATE POLICY news_comments_insert_auth ON public.news_comments
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS news_comments_update_own ON public.news_comments;
CREATE POLICY news_comments_update_own ON public.news_comments
  FOR UPDATE USING (created_by = (select auth.uid()));

DROP POLICY IF EXISTS news_comments_delete_own ON public.news_comments;
CREATE POLICY news_comments_delete_own ON public.news_comments
  FOR DELETE USING (created_by = (select auth.uid()));

-- ============================================================================
-- fan_accounts table
-- ============================================================================
DROP POLICY IF EXISTS fan_accounts_select_own ON public.fan_accounts;
CREATE POLICY fan_accounts_select_own ON public.fan_accounts
  FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS fan_accounts_insert_own ON public.fan_accounts;
CREATE POLICY fan_accounts_insert_own ON public.fan_accounts
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS fan_accounts_update_own ON public.fan_accounts;
CREATE POLICY fan_accounts_update_own ON public.fan_accounts
  FOR UPDATE USING (user_id = (select auth.uid()));
