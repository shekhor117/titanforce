'use client'

import { createClient } from '@/lib/supabase/client'

export interface Player {
  id: string
  num: number
  name: string
  full_name: string
  position: string
  category: 'GK' | 'DEF' | 'MID' | 'FWD'
  age?: number
  hometown?: string
  height?: number | string
  weight?: number | string
  foot?: 'Left' | 'Right' | 'Both' | string
  strong_foot?: 'Left' | 'Right' | 'Both' | string
  goals: number
  assists: number
  image_url?: string
  status: 'active' | 'Active' | 'injured' | 'suspended'
  bio?: string
  clean_sheets?: number
  appearances?: number
  minutes_played?: number
  pass_accuracy?: number
  chances_created?: number
  premier_matches?: number
  cup_matches?: number
  yellow_cards?: number
  red_cards?: number
  man_of_the_match?: number
  average_rating?: number
  pace?: number
  shooting?: number
  passing?: number
  dribbling?: number
  defending?: number
  physical?: number
  date_of_birth?: string
  join_date?: string
  season_year?: string
  club?: string
  nationality?: string
  created_at: string
  updated_at: string
}

class PlayerDataService {
  async getPlayers(): Promise<Player[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .in('status', ['Active', 'active'])
        .order('num', { ascending: true })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id?.toString() || '',
        num: p.num || 0,
        name: p.name || '',
        full_name: p.full_name || '',
        position: p.position || '',
        category: p.category || 'MID',
        age: p.age,
        dob: p.dob || p.date_of_birth,
        height: p.height,
        weight: p.weight,
        hometown: p.hometown,
        foot: p.foot || p.preferred_foot || p.strong_foot,
        strong_foot: p.strong_foot || p.preferred_foot || p.foot,
        goals: p.goals || 0,
        assists: p.assists || 0,
        image_url: p.image_url,
        status: p.status || 'active',
        bio: p.bio,
        clean_sheets: p.clean_sheets,
        appearances: p.appearances,
        minutes_played: p.minutes_played,
        pass_accuracy: p.pass_accuracy,
        chances_created: p.chances_created,
        premier_matches: p.premier_matches,
        cup_matches: p.cup_matches,
        yellow_cards: p.yellow_cards,
        red_cards: p.red_cards,
        man_of_the_match: p.man_of_the_match,
        average_rating: p.average_rating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        date_of_birth: p.date_of_birth,
        join_date: p.join_date,
        season_year: p.season_year,
        club: p.club,
        nationality: p.nationality,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    } catch (error) {
      console.error('Error fetching players:', error)
      return []
    }
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        num: data.num || 0,
        name: data.name || data.full_name || '',
        full_name: data.full_name || data.name || '',
        position: data.position || '',
        category: data.category || 'MID',
        age: data.age,
        hometown: data.hometown,
        foot: data.foot || data.preferred_foot || data.strong_foot,
        strong_foot: data.strong_foot || data.preferred_foot || data.foot,
        goals: data.goals || 0,
        assists: data.assists || 0,
        image_url: data.image_url,
        status: data.status || 'active',
        bio: data.bio,
        clean_sheets: data.clean_sheets,
        appearances: data.appearances,
        minutes_played: data.minutes_played,
        pass_accuracy: data.pass_accuracy,
        chances_created: data.chances_created,
        premier_matches: data.premier_matches,
        cup_matches: data.cup_matches,
        yellow_cards: data.yellow_cards,
        red_cards: data.red_cards,
        man_of_the_match: data.man_of_the_match,
        average_rating: data.average_rating,
        pace: data.pace,
        shooting: data.shooting,
        passing: data.passing,
        dribbling: data.dribbling,
        defending: data.defending,
        physical: data.physical,
        date_of_birth: data.date_of_birth,
        join_date: data.join_date,
        season_year: data.season_year,
        club: data.club,
        nationality: data.nationality,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error fetching player:', error)
      return undefined
    }
  }

  async getPlayersByStatus(status: string): Promise<Player[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('status', status)
        .order('num', { ascending: true })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        num: p.num || 0,
        name: p.name || p.full_name || '',
        full_name: p.full_name || p.name || '',
        position: p.position || '',
        category: p.category || 'MID',
        age: p.age,
        dob: p.dob || p.date_of_birth,
        height: p.height,
        weight: p.weight,
        hometown: p.hometown,
        foot: p.foot || p.preferred_foot || p.strong_foot,
        strong_foot: p.strong_foot || p.preferred_foot || p.foot,
        goals: p.goals || 0,
        assists: p.assists || 0,
        image_url: p.image_url,
        status: p.status || 'active',
        bio: p.bio,
        clean_sheets: p.clean_sheets,
        appearances: p.appearances,
        minutes_played: p.minutes_played,
        pass_accuracy: p.pass_accuracy,
        chances_created: p.chances_created,
        premier_matches: p.premier_matches,
        cup_matches: p.cup_matches,
        yellow_cards: p.yellow_cards,
        red_cards: p.red_cards,
        man_of_the_match: p.man_of_the_match,
        average_rating: p.average_rating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        date_of_birth: p.date_of_birth,
        join_date: p.join_date,
        season_year: p.season_year,
        club: p.club,
        nationality: p.nationality,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    } catch (error) {
      console.error('Error fetching players by status:', error)
      return []
    }
  }

  async getPlayersByCategory(category: string): Promise<Player[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('category', category)
        .order('num', { ascending: true })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        num: p.num || 0,
        name: p.name || p.full_name || '',
        full_name: p.full_name || p.name || '',
        position: p.position || '',
        category: p.category || 'MID',
        age: p.age,
        dob: p.dob || p.date_of_birth,
        height: p.height,
        weight: p.weight,
        hometown: p.hometown,
        foot: p.foot || p.preferred_foot || p.strong_foot,
        strong_foot: p.strong_foot || p.preferred_foot || p.foot,
        goals: p.goals || 0,
        assists: p.assists || 0,
        image_url: p.image_url,
        status: p.status || 'active',
        bio: p.bio,
        clean_sheets: p.clean_sheets,
        appearances: p.appearances,
        minutes_played: p.minutes_played,
        pass_accuracy: p.pass_accuracy,
        chances_created: p.chances_created,
        premier_matches: p.premier_matches,
        cup_matches: p.cup_matches,
        yellow_cards: p.yellow_cards,
        red_cards: p.red_cards,
        man_of_the_match: p.man_of_the_match,
        average_rating: p.average_rating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        date_of_birth: p.date_of_birth,
        join_date: p.join_date,
        season_year: p.season_year,
        club: p.club,
        nationality: p.nationality,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    } catch (error) {
      console.error('Error fetching players by category:', error)
      return []
    }
  }

  async getPlayerStats() {
    try {
      const supabase = createClient()
      if (!supabase) return { total: 0, active: 0, injured: 0, suspended: 0, byCategory: { GK: 0, DEF: 0, MID: 0, FWD: 0 } }

      const { data, error } = await supabase
        .from('players')
        .select('status, category')

      if (error) throw error

      const players = data || []
      return {
        total: players.length,
        active: players.filter(p => p.status === 'Active').length,
        injured: players.filter(p => p.status === 'Injured').length,
        suspended: players.filter(p => p.status === 'Suspended').length,
        byCategory: {
          GK: players.filter(p => p.category === 'GK').length,
          DEF: players.filter(p => p.category === 'DEF').length,
          MID: players.filter(p => p.category === 'MID').length,
          FWD: players.filter(p => p.category === 'FWD').length
        }
      }
    } catch (error) {
      console.error('Error getting player stats:', error)
      return { total: 0, active: 0, injured: 0, suspended: 0, byCategory: { GK: 0, DEF: 0, MID: 0, FWD: 0 } }
    }
  }

  async getTopScorers(limit: number = 5): Promise<Player[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('goals', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        num: p.num || 0,
        name: p.name || p.full_name || '',
        full_name: p.full_name || p.name || '',
        position: p.position || '',
        category: p.category || 'MID',
        age: p.age,
        dob: p.dob || p.date_of_birth,
        height: p.height,
        weight: p.weight,
        hometown: p.hometown,
        foot: p.foot || p.preferred_foot || p.strong_foot,
        strong_foot: p.strong_foot || p.preferred_foot || p.foot,
        goals: p.goals || 0,
        assists: p.assists || 0,
        image_url: p.image_url,
        status: p.status || 'active',
        bio: p.bio,
        clean_sheets: p.clean_sheets,
        appearances: p.appearances,
        minutes_played: p.minutes_played,
        pass_accuracy: p.pass_accuracy,
        chances_created: p.chances_created,
        premier_matches: p.premier_matches,
        cup_matches: p.cup_matches,
        yellow_cards: p.yellow_cards,
        red_cards: p.red_cards,
        man_of_the_match: p.man_of_the_match,
        average_rating: p.average_rating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        date_of_birth: p.date_of_birth,
        join_date: p.join_date,
        season_year: p.season_year,
        club: p.club,
        nationality: p.nationality,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    } catch (error) {
      console.error('Error fetching top scorers:', error)
      return []
    }
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const updateData: Record<string, unknown> = {}
      if (updates.name) updateData.name = updates.name
      if (updates.full_name) updateData.full_name = updates.full_name
      if (updates.num !== undefined) updateData.num = updates.num
      if (updates.position) updateData.position = updates.position
      if (updates.category) updateData.category = updates.category
      if (updates.age !== undefined) updateData.age = updates.age
      if (updates.goals !== undefined) updateData.goals = updates.goals
      if (updates.assists !== undefined) updateData.assists = updates.assists
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url
      if (updates.status) updateData.status = updates.status
      if (updates.bio !== undefined) updateData.bio = updates.bio

      const { data, error } = await supabase
        .from('players')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) return null

      return await this.getPlayerById(id) || null
    } catch (error) {
      console.error('Error updating player:', error)
      return null
    }
  }
}

export default new PlayerDataService()
