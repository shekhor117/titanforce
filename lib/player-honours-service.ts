'use client'

import { createClient } from '@/lib/supabase/client'
import type { Honour } from '@/lib/honour-data-service'

export interface PlayerHonour {
  id: string
  playerId: string
  honourId: string
  awardedYear?: number
  honour?: Honour
}

class PlayerHonoursService {
  // Get all honours for a specific player
  async getPlayerHonours(playerId: string): Promise<Honour[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('player_honours')
        .select(`
          honour_id,
          honours (
            id,
            name,
            year,
            category,
            description,
            icon,
            runners_up,
            image_url,
            featured
          )
        `)
        .eq('player_id', playerId)
        .order('honours(year)', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching player honours:', error)
        return []
      }

      if (!data) return []

      return data
        .filter(item => item.honours)
        .map(item => ({
          id: item.honours.id,
          name: item.honours.name,
          year: item.honours.year,
          category: item.honours.category,
          description: item.honours.description,
          icon: item.honours.icon || '🏆',
          runners_up: item.honours.runners_up,
          image_url: item.honours.image_url,
          featured: item.honours.featured,
        }))
    } catch (error) {
      console.error('[v0] Error in getPlayerHonours:', error)
      return []
    }
  }

  // Add honour to a player
  async addHonourToPlayer(playerId: string, honourId: string, awardedYear?: number): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('player_honours')
        .insert({
          player_id: playerId,
          honour_id: honourId,
          awarded_year: awardedYear,
        })

      if (error) {
        console.error('[v0] Error adding honour to player:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('[v0] Error in addHonourToPlayer:', error)
      return false
    }
  }

  // Remove honour from a player
  async removeHonourFromPlayer(playerId: string, honourId: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('player_honours')
        .delete()
        .eq('player_id', playerId)
        .eq('honour_id', honourId)

      if (error) {
        console.error('[v0] Error removing honour from player:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('[v0] Error in removeHonourFromPlayer:', error)
      return false
    }
  }

  // Get honours count for a player by category
  async getPlayerHonoursStats(playerId: string): Promise<{ total: number; byCategory: Record<string, number> }> {
    try {
      const honours = await this.getPlayerHonours(playerId)
      const stats = { total: honours.length, byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 } }

      honours.forEach(h => {
        if (h.category in stats.byCategory) {
          stats.byCategory[h.category as keyof typeof stats.byCategory]++
        }
      })

      return stats
    } catch (error) {
      console.error('[v0] Error in getPlayerHonoursStats:', error)
      return { total: 0, byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 } }
    }
  }

  // Get all players who have a specific honour
  async getPlayersWithHonour(honourId: string): Promise<{ id: string; name: string; num: number }[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('player_honours')
        .select(`
          player_id,
          players (
            id,
            name,
            full_name,
            num
          )
        `)
        .eq('honour_id', honourId)

      if (error) {
        console.error('[v0] Error fetching players with honour:', error)
        return []
      }

      if (!data) return []

      return data
        .filter(item => item.players)
        .map(item => ({
          id: item.players.id,
          name: item.players.full_name || item.players.name,
          num: item.players.num,
        }))
    } catch (error) {
      console.error('[v0] Error in getPlayersWithHonour:', error)
      return []
    }
  }
}

export default new PlayerHonoursService()
