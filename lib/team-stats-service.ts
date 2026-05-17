'use client'

import { createClient } from '@/lib/supabase/client'

export interface TeamStats {
  total_players: number
  active_players: number
  injured_players: number
  total_goals: number
  total_assists: number
  avg_team_rating: number
  goalkeepers: number
  defenders: number
  midfielders: number
  forwards: number
}

class TeamStatsService {
  async getTeamStats(): Promise<TeamStats> {
    try {
      const supabase = createClient()
      if (!supabase) return this.getDefaultStats()

      const { data, error } = await supabase
        .rpc('get_team_stats')
        .single()

      if (error) {
        console.error('Error fetching team stats via RPC:', error)
        // Fallback to direct query
        return await this.getTeamStatsFromQuery()
      }

      return data || this.getDefaultStats()
    } catch (error) {
      console.error('Error getting team stats:', error)
      return this.getDefaultStats()
    }
  }

  async getTeamStatsFromQuery(): Promise<TeamStats> {
    try {
      const supabase = createClient()
      if (!supabase) return this.getDefaultStats()

      const { data, error } = await supabase
        .from('players')
        .select('status, category, goals, assists, average_rating')

      if (error) throw error

      const players = data || []
      const total_goals = players.reduce((sum, p) => sum + (p.goals || 0), 0)
      const total_assists = players.reduce((sum, p) => sum + (p.assists || 0), 0)
      const avg_rating = players.length > 0
        ? players.reduce((sum, p) => sum + (parseFloat(p.average_rating) || 0), 0) / players.length
        : 0

      return {
        total_players: players.length,
        active_players: players.filter(p => p.status === 'Active').length,
        injured_players: players.filter(p => p.status === 'Injured').length,
        total_goals,
        total_assists,
        avg_team_rating: parseFloat(avg_rating.toFixed(2)),
        goalkeepers: players.filter(p => p.category === 'GK').length,
        defenders: players.filter(p => p.category === 'DEF').length,
        midfielders: players.filter(p => p.category === 'MID').length,
        forwards: players.filter(p => p.category === 'FWD').length
      }
    } catch (error) {
      console.error('Error getting team stats from query:', error)
      return this.getDefaultStats()
    }
  }

  async getTopScorers(limit: number = 5) {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('id, name, num, goals, category, image_url')
        .eq('status', 'Active')
        .order('goals', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching top scorers:', error)
      return []
    }
  }

  async getTopAssists(limit: number = 5) {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('id, name, num, assists, category, image_url')
        .eq('status', 'Active')
        .order('assists', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching top assists:', error)
      return []
    }
  }

  async getTopRatedPlayers(limit: number = 5) {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('id, name, num, average_rating, category, image_url')
        .eq('status', 'Active')
        .order('average_rating', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching top rated players:', error)
      return []
    }
  }

  async getTeamFormation() {
    try {
      const stats = await this.getTeamStats()
      return {
        formation: `${stats.defenders}-${stats.midfielders}-${stats.forwards}`,
        gk: stats.goalkeepers,
        def: stats.defenders,
        mid: stats.midfielders,
        fwd: stats.forwards
      }
    } catch (error) {
      console.error('Error getting team formation:', error)
      return { formation: '4-2-3', gk: 1, def: 4, mid: 2, fwd: 3 }
    }
  }

  private getDefaultStats(): TeamStats {
    return {
      total_players: 0,
      active_players: 0,
      injured_players: 0,
      total_goals: 0,
      total_assists: 0,
      avg_team_rating: 0,
      goalkeepers: 0,
      defenders: 0,
      midfielders: 0,
      forwards: 0
    }
  }
}

export default new TeamStatsService()
