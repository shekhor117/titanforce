import { createClient } from '@/lib/supabase/client'

export interface PlayerRanking {
  id: string
  num: number
  name: string
  full_name: string
  position: string
  category: string
  ranking: number
  goals: number
  assists: number
  appearances: number
  average_rating: number
  man_of_the_match: number
  status: string
  image_url?: string
}

class PlayerRankingService {
  async getPlayerRankings(
    sortBy: 'ranking' | 'goals' | 'assists' = 'ranking',
    position: string = 'all'
  ): Promise<PlayerRanking[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      let query = supabase
        .from('players')
        .select('*')
        .eq('status', 'Active')

      // Filter by position if specified
      if (position !== 'all') {
        query = query.eq('category', position.toUpperCase())
      }

      // Sort by the specified metric
      if (sortBy === 'ranking') {
        query = query.order('ranking', { ascending: false })
      } else if (sortBy === 'goals') {
        query = query.order('goals', { ascending: false })
      } else {
        query = query.order('assists', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id?.toString() || '',
        num: p.num || 0,
        name: p.name || '',
        full_name: p.full_name || '',
        position: p.position || '',
        category: p.category || 'MID',
        ranking: p.ranking || 7.5,
        goals: p.goals || 0,
        assists: p.assists || 0,
        appearances: p.appearances || 0,
        average_rating: p.average_rating || 7.5,
        man_of_the_match: p.man_of_the_match || 0,
        status: p.status || 'active',
        image_url: p.image_url,
      }))
    } catch (error) {
      console.error('[v0] Error fetching player rankings:', error)
      return []
    }
  }

  async getTopRankedPlayers(limit: number = 3): Promise<PlayerRanking[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('status', 'Active')
        .order('ranking', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id?.toString() || '',
        num: p.num || 0,
        name: p.name || '',
        full_name: p.full_name || '',
        position: p.position || '',
        category: p.category || 'MID',
        ranking: p.ranking || 7.5,
        goals: p.goals || 0,
        assists: p.assists || 0,
        appearances: p.appearances || 0,
        average_rating: p.average_rating || 7.5,
        man_of_the_match: p.man_of_the_match || 0,
        status: p.status || 'active',
        image_url: p.image_url,
      }))
    } catch (error) {
      console.error('[v0] Error fetching top ranked players:', error)
      return []
    }
  }

  async updatePlayerRanking(playerId: string, ranking: number): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      // Clamp ranking between 0 and 10
      const clampedRanking = Math.min(10, Math.max(0, ranking))

      const { error } = await supabase
        .from('players')
        .update({ ranking: clampedRanking, updated_at: new Date().toISOString() })
        .eq('id', playerId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('[v0] Error updating player ranking:', error)
      return false
    }
  }

  async updateMultipleRankings(updates: { playerId: string; ranking: number }[]): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      for (const update of updates) {
        const clampedRanking = Math.min(10, Math.max(0, update.ranking))
        const { error } = await supabase
          .from('players')
          .update({ ranking: clampedRanking, updated_at: new Date().toISOString() })
          .eq('id', update.playerId)

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('[v0] Error updating multiple rankings:', error)
      return false
    }
  }

  async getRankingStats() {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('players')
        .select('ranking')
        .eq('status', 'Active')

      if (error) throw error

      const rankings = (data || []).map(p => p.ranking || 7.5)
      const average = rankings.length > 0 ? rankings.reduce((a, b) => a + b, 0) / rankings.length : 0

      return {
        average_ranking: parseFloat(average.toFixed(2)),
        highest_ranking: Math.max(...rankings),
        lowest_ranking: Math.min(...rankings),
        total_ranked_players: rankings.length,
      }
    } catch (error) {
      console.error('[v0] Error getting ranking stats:', error)
      return null
    }
  }
}

export default new PlayerRankingService()
