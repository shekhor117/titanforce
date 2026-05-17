'use client'

import { createClient } from '@/lib/supabase/client'

export interface Match {
  id: string
  home: string
  away: string
  date: string
  time: string
  venue: string
  home_score: number | null
  away_score: number | null
  status: 'upcoming' | 'live' | 'completed'
  result: 'W' | 'L' | 'D' | null
  tournament?: string
  match_type?: string
  referee?: string
  attendance?: number
  weather?: string
  man_of_the_match?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

class MatchDataService {
  async getMatches(): Promise<Match[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      return (data || []).map(m => ({
        id: m.id,
        home: m.home,
        away: m.away,
        date: m.date,
        time: m.time,
        venue: m.venue,
        home_score: m.home_score,
        away_score: m.away_score,
        status: m.status as 'upcoming' | 'live' | 'completed',
        result: m.result as 'W' | 'L' | 'D' | null,
        tournament: m.tournament,
        match_type: m.match_type,
        referee: m.referee,
        attendance: m.attendance,
        weather: m.weather,
        man_of_the_match: m.man_of_the_match,
        notes: m.notes,
        created_at: m.created_at,
        updated_at: m.updated_at
      }))
    } catch (error) {
      console.error('Error fetching matches:', error)
      return []
    }
  }

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        home: data.home,
        away: data.away,
        date: data.date,
        time: data.time,
        venue: data.venue,
        home_score: data.home_score,
        away_score: data.away_score,
        status: data.status as 'upcoming' | 'live' | 'completed',
        result: data.result as 'W' | 'L' | 'D' | null,
        tournament: data.tournament,
        match_type: data.match_type,
        referee: data.referee,
        attendance: data.attendance,
        weather: data.weather,
        man_of_the_match: data.man_of_the_match,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error fetching match:', error)
      return null
    }
  }

  async getUpcomingMatches(limit: number = 5): Promise<Match[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'upcoming')
        .order('date', { ascending: true })
        .limit(limit)

      if (error) throw error

      return (data || []).map(m => ({
        id: m.id,
        home: m.home,
        away: m.away,
        date: m.date,
        time: m.time,
        venue: m.venue,
        home_score: m.home_score,
        away_score: m.away_score,
        status: m.status as 'upcoming' | 'live' | 'completed',
        result: m.result as 'W' | 'L' | 'D' | null,
        tournament: m.tournament,
        match_type: m.match_type,
        referee: m.referee,
        attendance: m.attendance,
        weather: m.weather,
        man_of_the_match: m.man_of_the_match,
        notes: m.notes,
        created_at: m.created_at,
        updated_at: m.updated_at
      }))
    } catch (error) {
      console.error('Error fetching upcoming matches:', error)
      return []
    }
  }

  async getCompletedMatches(limit: number = 10): Promise<Match[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'completed')
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(m => ({
        id: m.id,
        home: m.home,
        away: m.away,
        date: m.date,
        time: m.time,
        venue: m.venue,
        home_score: m.home_score,
        away_score: m.away_score,
        status: m.status as 'upcoming' | 'live' | 'completed',
        result: m.result as 'W' | 'L' | 'D' | null,
        tournament: m.tournament,
        match_type: m.match_type,
        referee: m.referee,
        attendance: m.attendance,
        weather: m.weather,
        man_of_the_match: m.man_of_the_match,
        notes: m.notes,
        created_at: m.created_at,
        updated_at: m.updated_at
      }))
    } catch (error) {
      console.error('Error fetching completed matches:', error)
      return []
    }
  }

  async addMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('matches')
        .insert([
          {
            home: match.home,
            away: match.away,
            date: match.date,
            time: match.time,
            venue: match.venue,
            home_score: match.home_score,
            away_score: match.away_score,
            status: match.status,
            result: match.result,
            tournament: match.tournament,
            match_type: match.match_type,
            referee: match.referee,
            attendance: match.attendance,
            weather: match.weather,
            man_of_the_match: match.man_of_the_match,
            notes: match.notes
          }
        ])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        home: data.home,
        away: data.away,
        date: data.date,
        time: data.time,
        venue: data.venue,
        home_score: data.home_score,
        away_score: data.away_score,
        status: data.status,
        result: data.result,
        tournament: data.tournament,
        match_type: data.match_type,
        referee: data.referee,
        attendance: data.attendance,
        weather: data.weather,
        man_of_the_match: data.man_of_the_match,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error adding match:', error)
      return null
    }
  }

  async updateMatch(id: string, match: Partial<Match>): Promise<Match | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const updateData: Record<string, any> = {}
      if (match.home) updateData.home = match.home
      if (match.away) updateData.away = match.away
      if (match.date) updateData.date = match.date
      if (match.time) updateData.time = match.time
      if (match.venue) updateData.venue = match.venue
      if (match.home_score !== undefined) updateData.home_score = match.home_score
      if (match.away_score !== undefined) updateData.away_score = match.away_score
      if (match.status) updateData.status = match.status
      if (match.result) updateData.result = match.result
      if (match.tournament) updateData.tournament = match.tournament
      if (match.match_type) updateData.match_type = match.match_type
      if (match.referee) updateData.referee = match.referee
      if (match.attendance) updateData.attendance = match.attendance
      if (match.weather) updateData.weather = match.weather
      if (match.man_of_the_match) updateData.man_of_the_match = match.man_of_the_match
      if (match.notes) updateData.notes = match.notes

      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        home: data.home,
        away: data.away,
        date: data.date,
        time: data.time,
        venue: data.venue,
        home_score: data.home_score,
        away_score: data.away_score,
        status: data.status,
        result: data.result,
        tournament: data.tournament,
        match_type: data.match_type,
        referee: data.referee,
        attendance: data.attendance,
        weather: data.weather,
        man_of_the_match: data.man_of_the_match,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error updating match:', error)
      return null
    }
  }

  async deleteMatch(id: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting match:', error)
      return false
    }
  }

  async getMatchStats() {
    try {
      const supabase = createClient()
      if (!supabase) return { total: 0, upcoming: 0, live: 0, completed: 0, wins: 0, losses: 0, draws: 0 }

      const { data, error } = await supabase
        .from('matches')
        .select('status, result')

      if (error) throw error

      const matches = data || []
      return {
        total: matches.length,
        upcoming: matches.filter(m => m.status === 'upcoming').length,
        live: matches.filter(m => m.status === 'live').length,
        completed: matches.filter(m => m.status === 'completed').length,
        wins: matches.filter(m => m.result === 'W').length,
        losses: matches.filter(m => m.result === 'L').length,
        draws: matches.filter(m => m.result === 'D').length
      }
    } catch (error) {
      console.error('Error getting match stats:', error)
      return { total: 0, upcoming: 0, live: 0, completed: 0, wins: 0, losses: 0, draws: 0 }
    }
  }
}

export default new MatchDataService()
