/**
 * Supabase Database Utilities
 * Common functions for Create, Read, Update, Delete operations
 * Used across the Titan Force app
 */

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// ========== PLAYERS ==========

export async function getPlayers() {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .select(`
        id,
        user_id,
        jersey,
        position,
        age,
        address,
        foot,
        height,
        weight,
        experience,
        photo_url,
        profiles:user_id(id, email, first_name, last_name)
      `)
      .order('jersey', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching players:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch players' }
  }
}

export async function getPlayerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .select(`
        id,
        user_id,
        jersey,
        position,
        age,
        address,
        foot,
        height,
        weight,
        experience,
        photo_url,
        profiles:user_id(id, email, first_name, last_name)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching player:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch player' }
  }
}

export async function updatePlayer(id: string, updates: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error updating player:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update player' }
  }
}

export async function deletePlayer(id: string) {
  try {
    const { error } = await supabase
      .from('player_profiles')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('[v0] Error deleting player:', error)
    return { error: error instanceof Error ? error.message : 'Failed to delete player' }
  }
}

// ========== MATCHES ==========

export async function getMatches() {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching matches:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch matches' }
  }
}

export async function getMatchById(id: string) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching match:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch match' }
  }
}

export async function createMatch(matchData: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error creating match:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create match' }
  }
}

export async function updateMatch(id: string, updates: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error updating match:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update match' }
  }
}

export async function deleteMatch(id: string) {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('[v0] Error deleting match:', error)
    return { error: error instanceof Error ? error.message : 'Failed to delete match' }
  }
}

// ========== NEWS ==========

export async function getPublishedNews() {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select(`
        id,
        admin_id,
        title,
        content,
        image_url,
        published,
        created_at,
        updated_at
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching news:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch news' }
  }
}

export async function getNewsComments(postId: string) {
  try {
    const { data, error } = await supabase
      .from('news_comments')
      .select(`
        id,
        post_id,
        user_id,
        content,
        created_at,
        profiles:user_id(id, email, first_name)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching comments:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch comments' }
  }
}

export async function addNewsComment(postId: string, content: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('news_comments')
      .insert([{ post_id: postId, user_id: user.id, content }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error adding comment:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to add comment' }
  }
}

// ========== PLAYER STATS ==========

export async function getPlayerStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching stats:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch stats' }
  }
}

export async function getAllPlayerStats() {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .order('goals', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching all stats:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch stats' }
  }
}

// ========== FAN FEATURES ==========

export async function getFanFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from('fan_favorites')
      .select(`
        id,
        player_user_id,
        player_profiles:player_user_id(jersey, position, profiles:user_id(first_name, last_name))
      `)
      .eq('fan_user_id', userId)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching favorites:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch favorites' }
  }
}

export async function addFanFavorite(userId: string, playerUserId: string) {
  try {
    const { data, error } = await supabase
      .from('fan_favorites')
      .insert([{ fan_user_id: userId, player_user_id: playerUserId }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error adding favorite:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to add favorite' }
  }
}

export async function removeFanFavorite(userId: string, playerUserId: string) {
  try {
    const { error } = await supabase
      .from('fan_favorites')
      .delete()
      .eq('fan_user_id', userId)
      .eq('player_user_id', playerUserId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('[v0] Error removing favorite:', error)
    return { error: error instanceof Error ? error.message : 'Failed to remove favorite' }
  }
}

export async function getSavedMatches(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_matches')
      .select(`
        id,
        match_id,
        matches:match_id(id, title, opponent, date, status)
      `)
      .eq('user_id', userId)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching saved matches:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch saved matches' }
  }
}

export async function saveMatch(userId: string, matchId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_matches')
      .insert([{ user_id: userId, match_id: matchId }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error saving match:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to save match' }
  }
}

export async function unsaveMatch(userId: string, matchId: string) {
  try {
    const { error } = await supabase
      .from('saved_matches')
      .delete()
      .eq('user_id', userId)
      .eq('match_id', matchId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('[v0] Error unsaving match:', error)
    return { error: error instanceof Error ? error.message : 'Failed to unsave match' }
  }
}
