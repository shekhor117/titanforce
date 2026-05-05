// ============================================================================
// SUPABASE CRUD UTILITIES FOR TITAN FORCE
// Complete helper functions for all database operations
// ============================================================================

import { createClient } from '@/lib/supabase/client'

// ============================================================================
// PLAYER PROFILES - CRUD Operations
// ============================================================================

interface Player {
  id: string
  user_id: string
  jersey: number
  position: string
  age: number
  address?: string
  foot: string
  goals?: number
  assists?: number
  clean_sheets?: number
}

// Get all players
export async function getPlayers() {
  const supabase = createClient()
  return supabase
    .from('player_profiles')
    .select('*')
    .order('jersey', { ascending: true })
}

// Get single player by ID
export async function getPlayerById(playerId: string) {
  const supabase = createClient()
  return supabase
    .from('player_profiles')
    .select('*')
    .eq('id', playerId)
    .single()
}

// Create new player
export async function createPlayer(playerData: Omit<Player, 'id'>) {
  const supabase = createClient()
  return supabase
    .from('player_profiles')
    .insert([playerData])
    .select()
}

// Update player
export async function updatePlayer(playerId: string, updates: Partial<Player>) {
  const supabase = createClient()
  return supabase
    .from('player_profiles')
    .update(updates)
    .eq('id', playerId)
    .select()
}

// Delete player
export async function deletePlayer(playerId: string) {
  const supabase = createClient()
  return supabase
    .from('player_profiles')
    .delete()
    .eq('id', playerId)
}

// ============================================================================
// MATCHES - CRUD Operations
// ============================================================================

interface Match {
  id: string
  opponent: string
  match_date: string
  location: string
  status: 'upcoming' | 'completed' | 'cancelled'
  titan_force_goals?: number
  opponent_goals?: number
  created_by: string
  created_at: string
  updated_at: string
}

// Get all matches
export async function getMatches() {
  const supabase = createClient()
  return supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: false })
}

// Get single match
export async function getMatchById(matchId: string) {
  const supabase = createClient()
  return supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()
}

// Create match
export async function createMatch(matchData: Omit<Match, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  return supabase
    .from('matches')
    .insert([matchData])
    .select()
}

// Update match
export async function updateMatch(matchId: string, updates: Partial<Match>) {
  const supabase = createClient()
  return supabase
    .from('matches')
    .update(updates)
    .eq('id', matchId)
    .select()
}

// Delete match
export async function deleteMatch(matchId: string) {
  const supabase = createClient()
  return supabase
    .from('matches')
    .delete()
    .eq('id', matchId)
}

// ============================================================================
// PLAYER STATS - CRUD Operations
// ============================================================================

interface PlayerStats {
  id: string
  user_id: string
  season: string
  goals: number
  assists: number
  appearances: number
  minutes_played: number
  yellow_cards: number
  red_cards: number
}

// Get stats for single player
export async function getPlayerStats(userId: string) {
  const supabase = createClient()
  return supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .single()
}

// Get all player stats
export async function getAllPlayerStats() {
  const supabase = createClient()
  return supabase
    .from('player_stats')
    .select('*')
}

// Update player stats
export async function updatePlayerStats(userId: string, updates: Partial<PlayerStats>) {
  const supabase = createClient()
  return supabase
    .from('player_stats')
    .update(updates)
    .eq('user_id', userId)
    .select()
}

// ============================================================================
// NEWS - CRUD Operations
// ============================================================================

interface NewsPost {
  id: string
  admin_id: string
  title: string
  content: string
  image_url?: string
  published: boolean
  created_at: string
  updated_at: string
}

// Get published news
export async function getPublishedNews() {
  const supabase = createClient()
  return supabase
    .from('news_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
}

// Get all news (including drafts for admin)
export async function getAllNews() {
  const supabase = createClient()
  return supabase
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false })
}

// Create news post
export async function createNewsPost(postData: Omit<NewsPost, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  return supabase
    .from('news_posts')
    .insert([postData])
    .select()
}

// Update news post
export async function updateNewsPost(postId: string, updates: Partial<NewsPost>) {
  const supabase = createClient()
  return supabase
    .from('news_posts')
    .update(updates)
    .eq('id', postId)
    .select()
}

// Delete news post
export async function deleteNewsPost(postId: string) {
  const supabase = createClient()
  return supabase
    .from('news_posts')
    .delete()
    .eq('id', postId)
}

// ============================================================================
// NEWS COMMENTS - CRUD Operations
// ============================================================================

interface NewsComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

// Get comments for a post
export async function getNewsComments(postId: string) {
  const supabase = createClient()
  return supabase
    .from('news_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
}

// Add comment to news
export async function addNewsComment(postId: string, content: string, userId: string) {
  const supabase = createClient()
  return supabase
    .from('news_comments')
    .insert([{ post_id: postId, content, user_id: userId }])
    .select()
}

// Delete comment
export async function deleteNewsComment(commentId: string) {
  const supabase = createClient()
  return supabase
    .from('news_comments')
    .delete()
    .eq('id', commentId)
}

// ============================================================================
// TEAM FORMATIONS - CRUD Operations
// ============================================================================

interface TeamFormation {
  id: string
  match_id: string
  formation: string
  starting_lineup?: unknown[]
  substitutions?: unknown[]
  tactics?: string
}

// Get formation for a match
export async function getFormationByMatchId(matchId: string) {
  const supabase = createClient()
  return supabase
    .from('team_formations')
    .select('*')
    .eq('match_id', matchId)
    .single()
}

// Create formation
export async function createFormation(formationData: Omit<TeamFormation, 'id'> & { created_by: string }) {
  const supabase = createClient()
  return supabase
    .from('team_formations')
    .insert([formationData])
    .select()
}

// Update formation
export async function updateFormation(formationId: string, updates: Partial<TeamFormation>) {
  const supabase = createClient()
  return supabase
    .from('team_formations')
    .update(updates)
    .eq('id', formationId)
    .select()
}

// ============================================================================
// MATCH EVENTS - CRUD Operations
// ============================================================================

interface MatchEvent {
  id: string
  match_id: string
  event_type: 'goal' | 'card' | 'substitution' | 'milestone'
  player_id?: string
  minute: number
  description?: string
  metadata?: Record<string, unknown>
}

// Get events for a match
export async function getMatchEvents(matchId: string) {
  const supabase = createClient()
  return supabase
    .from('match_events')
    .select('*')
    .eq('match_id', matchId)
    .order('minute', { ascending: true })
}

// Add match event
export async function addMatchEvent(eventData: Omit<MatchEvent, 'id'> & { created_by: string }) {
  const supabase = createClient()
  return supabase
    .from('match_events')
    .insert([eventData])
    .select()
}

// Delete match event
export async function deleteMatchEvent(eventId: string) {
  const supabase = createClient()
  return supabase
    .from('match_events')
    .delete()
    .eq('id', eventId)
}

// ============================================================================
// FAN FEATURES - CRUD Operations
// ============================================================================

// Get user's favorite players
export async function getFanFavorites(userId: string) {
  const supabase = createClient()
  return supabase
    .from('fan_favorites')
    .select('*')
    .eq('fan_user_id', userId)
}

// Add player to favorites
export async function addFanFavorite(userId: string, playerUserId: string) {
  const supabase = createClient()
  return supabase
    .from('fan_favorites')
    .insert([{ fan_user_id: userId, player_user_id: playerUserId }])
    .select()
}

// Remove from favorites
export async function removeFanFavorite(userId: string, playerUserId: string) {
  const supabase = createClient()
  return supabase
    .from('fan_favorites')
    .delete()
    .eq('fan_user_id', userId)
    .eq('player_user_id', playerUserId)
}

// Get saved matches for user
export async function getSavedMatches(userId: string) {
  const supabase = createClient()
  return supabase
    .from('saved_matches')
    .select('match_id, matches(*)')
    .eq('user_id', userId)
}

// Save a match
export async function saveMatch(userId: string, matchId: string) {
  const supabase = createClient()
  return supabase
    .from('saved_matches')
    .insert([{ user_id: userId, match_id: matchId }])
    .select()
}

// Unsave a match
export async function unsaveMatch(userId: string, matchId: string) {
  const supabase = createClient()
  return supabase
    .from('saved_matches')
    .delete()
    .eq('user_id', userId)
    .eq('match_id', matchId)
}

// ============================================================================
// END OF UTILITIES
// ============================================================================
