'use client'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

// Types
export interface PlayerPosition {
  id: string
  player_id: string
  position_name: string
  x_coordinate: number
  y_coordinate: number
  is_primary: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface Injury {
  id: string
  player_id: string
  injury_type: string
  injury_date: string
  status: 'active' | 'recovering' | 'recovered'
  recovery_progress: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Honour {
  id: string
  name: string
  year: number
  category: 'league' | 'cup' | 'championship' | 'tournament'
  description?: string
  icon?: string
  runners_up?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface PlayerHonour {
  id: string
  player_id: string
  honour_id: string
  performance_notes?: string
  created_at: string
}

export interface Trophy {
  id: string
  name: string
  year: number
  category: 'league' | 'cup' | 'championship' | 'tournament'
  description?: string
  icon?: string
  runners_up?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface AppUser {
  id: string
  email: string
  username: string
  password_hash: string
  role: 'admin' | 'manager' | 'viewer'
  full_name?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  num: number
  name: string
  full_name: string
  position: string
  category: 'GK' | 'DEF' | 'MID' | 'FWD'
  age?: number
  hometown?: string
  foot?: 'Left' | 'Right' | 'Both'
  strong_foot?: 'Left' | 'Right' | 'Both'
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
  dob?: string
  height?: number
  weight?: number
  join_date?: string
  season_year?: string
  club?: string
  nationality?: string
  positions?: PlayerPosition[]
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  home: string
  away: string
  date: string
  time: string
  venue: string
  home_score: number | null | undefined
  away_score: number | null | undefined
  status: 'live' | 'completed' | 'upcoming'
  result?: 'W' | 'L' | 'D'
  tournament?: string
  home_lineup?: Array<{ player: string; name?: string; number: number; position?: string }>
  away_lineup?: Array<{ player: string; name?: string; number: number; position?: string }>
  homeGoals?: Array<{
    player: string
    minute: number
    assist?: string
  }>
  awayGoals?: Array<{
    player: string
    minute: number
    assist?: string
  }>
  match_events?: Array<{
    player: string
    type: 'Goal' | 'Yellow Card' | 'Red Card' | 'Substitution'
    minute: number
    team: 'Home' | 'Away'
  }>
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url?: string
  category?: string
  description?: string
  link?: string
  created_at: string
  updated_at: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  excerpt?: string
  image?: string
  category?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views?: number
  author_id?: string
  author?: string
  created_at: string
  updated_at: string
}

export interface MediaItem {
  id: string
  title: string
  url: string
  type: 'photo' | 'video'
  category?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  key: string
  value: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Fan {
  id: string
  name: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
  updated_at: string
}

export interface AppUser {
  id: string
  auth_id?: string
  name: string
  email: string
  role: 'admin' | 'player' | 'fan' | 'partner' | 'user'
  status: 'active' | 'inactive' | 'banned'
  avatar_url?: string
  bio?: string
  phone?: string
  location?: string
  joined_at: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Trophy {
  id: string
  name: string
  year: number
  category: 'league' | 'cup' | 'championship' | 'tournament'
  description: string
  icon: string
  runners_up?: string
  image_url?: string
  featured?: boolean
  created_at: string
  updated_at: string
}

export interface Injury {
  id: string
  player_id: string
  player_name: string
  player_number: number
  injury_type: string
  body_part: string
  status: 'active' | 'recovering' | 'recovered'
  date_injured: string
  expected_return: string
  recovery_percent: number
  notes?: string
  created_at: string
  updated_at: string
}

// NewsUpdate interface moved to separate updates system
// Using NewsItem for main news and updates functionality

// Callback types
type DataCallback<T> = (data: T[]) => void
type ErrorCallback = (error: Error) => void

// Data Service
export class DataService {
  private supabase: ReturnType<typeof createClient>
  private subscriptions: Map<string, RealtimeChannel> = new Map()
  private isConfigured: boolean

  constructor() {
    this.supabase = createClient()
    this.isConfigured = isSupabaseConfigured()
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    if (!this.supabase) {
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('*')
        .order('num', { ascending: true })

      if (error) {
        // If table doesn't exist, return empty array instead of logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.debug("[v0] Players table not yet created")
          return []
        }
        console.error("[v0] DataService getPlayers error:", error)
        return []
      }

      // Fetch positions for all players
      const playersWithPositions = await Promise.all(
        (data || []).map(async (player) => {
          try {
            const positions = await this.getPlayerPositions(player.id)
            return { ...player, positions }
          } catch (err) {
            console.warn("[v0] Failed to fetch positions for player", player.id)
            return { ...player, positions: [] }
          }
        })
      )

      return playersWithPositions
    } catch (err) {
      console.error("[v0] DataService getPlayers caught error:", err)
      return []
    }
  }

  async createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('players')
        .insert([player])
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService createPlayer error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService createPlayer caught error:", err)
      throw err
    }
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('players')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService updatePlayer error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService updatePlayer caught error:", err)
      throw err
    }
  }

  async deletePlayer(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { error } = await this.supabase
        .from('players')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("[v0] DataService deletePlayer error:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] DataService deletePlayer caught error:", err)
      throw err
    }
  }

  // Player Positions
  async getPlayerPositions(playerId: string): Promise<PlayerPosition[]> {
    if (!this.supabase) {
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('player_positions')
        .select('*')
        .eq('player_id', playerId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        if (error.code === 'PGRST205') {
          console.debug("[v0] Player positions table not yet created")
          return []
        }
        console.error("[v0] DataService getPlayerPositions error:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("[v0] DataService getPlayerPositions caught error:", err)
      return []
    }
  }

  async addPlayerPosition(position: Omit<PlayerPosition, 'id' | 'created_at' | 'updated_at'>): Promise<PlayerPosition> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('player_positions')
        .insert([position])
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService addPlayerPosition error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService addPlayerPosition caught error:", err)
      throw err
    }
  }

  async updatePlayerPosition(id: string, updates: Partial<PlayerPosition>): Promise<PlayerPosition> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('player_positions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService updatePlayerPosition error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService updatePlayerPosition caught error:", err)
      throw err
    }
  }

  async deletePlayerPosition(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { error } = await this.supabase
        .from('player_positions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("[v0] DataService deletePlayerPosition error:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] DataService deletePlayerPosition caught error:", err)
      throw err
    }
  }

  async setPlayerPositionPrimary(playerId: string, positionId: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      // First, unset any current primary position for this player
      const { error: unsetError } = await this.supabase
        .from('player_positions')
        .update({ is_primary: false })
        .eq('player_id', playerId)

      if (unsetError) {
        console.error("[v0] DataService setPlayerPositionPrimary unset error:", unsetError)
        throw unsetError
      }

      // Then set the new primary position
      const { error: setError } = await this.supabase
        .from('player_positions')
        .update({ is_primary: true })
        .eq('id', positionId)

      if (setError) {
        console.error("[v0] DataService setPlayerPositionPrimary set error:", setError)
        throw setError
      }
    } catch (err) {
      console.error("[v0] DataService setPlayerPositionPrimary caught error:", err)
      throw err
    }
  }

  // Injuries
  async getInjuries(): Promise<Injury[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('injuries')
        .select('*')
        .order('injury_date', { ascending: false })
      if (error) {
        if (error.code === 'PGRST205') return []
        console.error("[v0] DataService getInjuries error:", error)
        return []
      }
      return data || []
    } catch (err) {
      console.error("[v0] DataService getInjuries caught error:", err)
      return []
    }
  }

  async addInjury(injury: Omit<Injury, 'id' | 'created_at' | 'updated_at'>): Promise<Injury> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('injuries')
      .insert([injury])
      .select()
      .single()
    if (error) throw error
    return data
  }

  async updateInjury(id: string, updates: Partial<Injury>): Promise<Injury> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('injuries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async deleteInjury(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase.from('injuries').delete().eq('id', id)
    if (error) throw error
  }

  // Honours
  async getHonours(): Promise<Honour[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('honours')
        .select('*')
        .order('year', { ascending: false })
      if (error) {
        if (error.code === 'PGRST205') return []
        console.error("[v0] DataService getHonours error:", error)
        return []
      }
      return data || []
    } catch (err) {
      console.error("[v0] DataService getHonours caught error:", err)
      return []
    }
  }

  async addHonour(honour: Omit<Honour, 'id' | 'created_at' | 'updated_at'>): Promise<Honour> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('honours')
      .insert([honour])
      .select()
      .single()
    if (error) throw error
    return data
  }

  async updateHonour(id: string, updates: Partial<Honour>): Promise<Honour> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('honours')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async deleteHonour(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase.from('honours').delete().eq('id', id)
    if (error) throw error
  }

  // Trophies
  async getTrophies(): Promise<Trophy[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('trophies')
        .select('*')
        .order('year', { ascending: false })
      if (error) {
        if (error.code === 'PGRST205') return []
        console.error("[v0] DataService getTrophies error:", error)
        return []
      }
      return data || []
    } catch (err) {
      console.error("[v0] DataService getTrophies caught error:", err)
      return []
    }
  }

  async addTrophy(trophy: Omit<Trophy, 'id' | 'created_at' | 'updated_at'>): Promise<Trophy> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('trophies')
      .insert([trophy])
      .select()
      .single()
    if (error) throw error
    return data
  }

  async updateTrophy(id: string, updates: Partial<Trophy>): Promise<Trophy> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('trophies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async deleteTrophy(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase.from('trophies').delete().eq('id', id)
    if (error) throw error
  }

  subscribeToPlayers(callback: DataCallback<Player>, onError?: ErrorCallback): () => void {
    
    if (!this.supabase) {
      return () => {}
    }
    
    try {
      // Cache for current players to avoid full refetch on every change
      let cachedPlayers: Player[] = []
      
      // Clean up any existing subscription first
      const existingChannel = this.subscriptions.get('players')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old players channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`players-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'players',
          },
          (payload) => {
            try {
              // Optimize: Use payload instead of full refetch
              // Only refetch if it's an initial load or critical operation
              if (payload.eventType === 'INSERT') {
                cachedPlayers = [...cachedPlayers, payload.new as Player]
              } else if (payload.eventType === 'UPDATE') {
                cachedPlayers = cachedPlayers.map((p) =>
                  p.id === (payload.new as Player).id ? (payload.new as Player) : p
                )
              } else if (payload.eventType === 'DELETE') {
                cachedPlayers = cachedPlayers.filter((p) => p.id !== (payload.old as Player).id)
              }
              
              callback(cachedPlayers)
              console.log(`[v0] Player update: ${payload.eventType}`)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .on('subscribe', () => {
          // Load initial data only once when subscription is established
          this.getPlayers().then((players) => {
            cachedPlayers = players
            callback(players)
          }).catch((error) => {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          })
        })
        .on('unsubscribe', () => {
        })
        .subscribe((status) => {
        })

      this.subscriptions.set('players', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing players channel:", error)
        }
        this.subscriptions.delete('players')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    if (!this.supabase) {
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        // If table doesn't exist, return empty array gracefully (no error logging)
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return []
        }
        console.error("[v0] DataService getMatches error:", error)
        return []
      }
      return data || []
    } catch (error) {
      if (!(error?.code === 'PGRST205' || error?.message?.includes('Could not find the table'))) {
        console.error("[v0] DataService getMatches caught error:", error)
      }
      return []
    }
  }

  async createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .insert([match])
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService createMatch error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService createMatch caught error:", err)
      throw err
    }
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService updateMatch error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService updateMatch caught error:", err)
      throw err
    }
  }

  async deleteMatch(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { error } = await this.supabase
        .from('matches')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("[v0] DataService deleteMatch error:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] DataService deleteMatch caught error:", err)
      throw err
    }
  }

  subscribeToMatches(callback: DataCallback<Match>, onError?: ErrorCallback): () => void {
    
    if (!this.supabase) {
      return () => {}
    }
    
    try {
      // Clean up any existing subscription first
      const existingChannel = this.subscriptions.get('matches')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old matches channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`matches-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matches',
          },
          async () => {
            try {
              const matches = await this.getMatches()
              callback(matches)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('matches', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing matches channel:", error)
        }
        this.subscriptions.delete('matches')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Partners
  async getPartners(): Promise<Partner[]> {
    if (!this.supabase) {
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('partners')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        return []
      }
      return data || []
    } catch (error) {
      return []
    }
  }

  async createPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('partners')
      .insert([partner])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePartner(id: string, updates: Partial<Partner>): Promise<Partner> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deletePartner(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToPartners(callback: DataCallback<Partner>, onError?: ErrorCallback): () => void {
    
    if (!this.supabase) {
      return () => {}
    }
    
    try {
      // Clean up any existing subscription first
      const existingChannel = this.subscriptions.get('partners')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old partners channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`partners-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'partners',
          },
          async () => {
            try {
              const partners = await this.getPartners()
              callback(partners)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('partners', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing partners channel:", error)
        }
        this.subscriptions.delete('partners')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // News Items
  async getNewsItems(includeUnpublished = false): Promise<NewsItem[]> {
    if (!this.supabase) {
      return []
    }
    try {
      let query = this.supabase.from('news_items').select('*')

      if (!includeUnpublished) {
        query = query.eq('status', 'published')
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        // If table doesn't exist, return empty array gracefully
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.debug('[v0] News items table not yet created')
          return []
        }
        // Check for RLS/permission errors - these are expected during setup
        if (error.code === '42501' || error.message?.includes('permission denied')) {
          console.debug('[v0] RLS permission issue - this may resolve after migrations are applied')
          return []
        }
        console.debug('[v0] Error fetching news items:', error.code, error.message)
        return []
      }
      return data || []
    } catch (error) {
      console.debug('[v0] Error fetching news items:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async createNewsItem(item: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>): Promise<NewsItem> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('news_items')
      .insert([item])
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST205') {
        throw new Error('News items table not yet created. Please run database migrations.')
      }
      throw error
    }
    return data
  }

  async updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<NewsItem> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('news_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST205') {
        throw new Error('News items table not yet created. Please run database migrations.')
      }
      throw error
    }
    return data
  }

  async deleteNewsItem(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('news_items')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST205') {
        throw new Error('News items table not yet created. Please run database migrations.')
      }
      throw error
    }
  }

  subscribeToNewsItems(callback: DataCallback<NewsItem>, onError?: ErrorCallback): () => void {
    
    if (!this.supabase) {
      return () => {}
    }
    
    try {
      // Clean up any existing subscription first
      const existingChannel = this.subscriptions.get('news')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old news channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`news-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'news_items',
          },
          async () => {
            try {
              const news = await this.getNewsItems()
              callback(news)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('news', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing news channel:", error)
        }
        this.subscriptions.delete('news')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Media Items
  async getMediaItems(): Promise<MediaItem[]> {
    if (!this.supabase) return []
    const { data, error } = await this.supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createMediaItem(item: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('media_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('media_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMediaItem(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('media_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToMediaItems(callback: DataCallback<MediaItem>, onError?: ErrorCallback): () => void {
    if (!this.supabase) return () => {}
    
    try {
      const channel = this.supabase
        .channel('media-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'media_items',
          },
          async () => {
            try {
              const media = await this.getMediaItems()
              callback(media)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('media', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing media channel:", error)
        }
        this.subscriptions.delete('media')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Site Settings
  async getSiteSettings(): Promise<Record<string, any>> {
    if (!this.supabase) return {}
    const { data, error } = await this.supabase
      .from('site_settings')
      .select('*')

    if (error) throw error

    const settings: Record<string, any> = {}
    data?.forEach((item: SiteSettings) => {
      settings[item.key] = item.value
    })
    return settings
  }

  async updateSiteSetting(key: string, value: Record<string, any>): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error: deleteError } = await this.supabase
      .from('site_settings')
      .delete()
      .eq('key', key)

    if (deleteError && deleteError.code !== 'PGRST116') throw deleteError

    const { error: insertError } = await this.supabase
      .from('site_settings')
      .insert([{ key, value }])

    if (insertError) throw insertError
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('[v0] DataService: Error fetching contact messages:', error)
      return []
    }
  }

  async createContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    console.log("[v0] DataService: Creating contact message:", message)
    
    const { data, error } = await this.supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single()

    if (error) {
      console.error("[v0] DataService: Error creating contact message:", error)
      throw new Error(`Failed to save message: ${error.message || JSON.stringify(error)}`)
    }
    
    console.log("[v0] DataService: Contact message created successfully:", data)
    return data
  }

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteContactMessage(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToContactMessages(callback: DataCallback<ContactMessage>, onError?: ErrorCallback): () => void {
    if (!this.supabase) return () => {}
    
    try {
      const existingChannel = this.subscriptions.get('contact_messages')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old contact messages channel:", error)
        }
      }

      const channel = this.supabase
        .channel('contact-messages-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, async () => {
          try {
            const messages = await this.getContactMessages()
            callback(messages)
          } catch (error) {
            onError?.(error as Error)
          }
        })
        .subscribe()

      this.subscriptions.set('contact_messages', channel)

      return () => {
        try {
          if (this.supabase) {
            this.supabase.removeChannel(channel)
          }
        } catch (error) {
          console.warn("[v0] DataService: Error removing contact messages channel:", error)
        }
        this.subscriptions.delete('contact_messages')
      }
    } catch (error) {
      onError?.(error as Error)
      return () => {}
    }
  }

  // Trophies
  async getTrophies(): Promise<Trophy[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('trophies')
        .select('*')
        .order('year', { ascending: false })

      if (error) {
        return []
      }
      return data || []
    } catch (error) {
      return []
    }
  }

  async createTrophy(trophy: Omit<Trophy, 'id' | 'created_at' | 'updated_at'>): Promise<Trophy> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('trophies')
      .insert([trophy])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTrophy(id: string, updates: Partial<Trophy>): Promise<Trophy> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('trophies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTrophy(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('trophies')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToTrophies(callback: DataCallback<Trophy>, onError?: ErrorCallback): () => void {
    if (!this.supabase) return () => {}
    
    try {
      const existingChannel = this.subscriptions.get('trophies')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old trophies channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`trophies-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'trophies',
          },
          async () => {
            try {
              const trophies = await this.getTrophies()
              callback(trophies)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('trophies', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing trophies channel:", error)
        }
        this.subscriptions.delete('trophies')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Injuries
  async getInjuries(): Promise<Injury[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('injuries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return []
      }
      return data || []
    } catch (error) {
      return []
    }
  }

  async createInjury(injury: Omit<Injury, 'id' | 'created_at' | 'updated_at'>): Promise<Injury> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('injuries')
        .insert([injury])
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService createInjury error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService createInjury caught error:", err)
      throw err
    }
  }

  async updateInjury(id: string, updates: Partial<Injury>): Promise<Injury> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { data, error } = await this.supabase
        .from('injuries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error("[v0] DataService updateInjury error:", error)
        throw error
      }
      return data
    } catch (err) {
      console.error("[v0] DataService updateInjury caught error:", err)
      throw err
    }
  }

  async deleteInjury(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    try {
      const { error } = await this.supabase
        .from('injuries')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("[v0] DataService deleteInjury error:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] DataService deleteInjury caught error:", err)
      throw err
    }
  }

  subscribeToInjuries(callback: DataCallback<Injury>, onError?: ErrorCallback): () => void {
    if (!this.supabase) return () => {}
    
    try {
      const existingChannel = this.subscriptions.get('injuries')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old injuries channel:", error)
        }
      }
      
      const channel = this.supabase
        .channel(`injuries-changes-${Date.now()}-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'injuries',
          },
          async () => {
            try {
              const injuries = await this.getInjuries()
              callback(injuries)
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          }
        )
        .subscribe()

      this.subscriptions.set('injuries', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing injuries channel:", error)
        }
        this.subscriptions.delete('injuries')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // Unified realtime sync for all data entities
  subscribeToAllData(
    onPlayersChange: DataCallback<Player>,
    onMatchesChange: DataCallback<Match>,
    onPartnersChange: DataCallback<Partner>,
    onNewsChange: DataCallback<NewsItem>,
    onMediaChange: DataCallback<MediaItem>,
    onTrophiesChange: DataCallback<Trophy>,
    onError?: ErrorCallback
  ): () => void {
    if (!this.supabase) return () => {}

    try {
      // Clean up any existing unified channel
      const existingChannel = this.subscriptions.get('all-sync')
      if (existingChannel) {
        try {
          this.supabase.removeChannel(existingChannel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing old all-sync channel:", error)
        }
      }

      const channel = this.supabase.channel('all-sync')

      // Players subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        async (payload) => {
          try {
            const players = await this.getPlayers()
            onPlayersChange(players)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      // Matches subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        async (payload) => {
          try {
            const matches = await this.getMatches()
            onMatchesChange(matches)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      // Partners subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partners' },
        async (payload) => {
          try {
            const partners = await this.getPartners()
            onPartnersChange(partners)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      // News subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_items' },
        async (payload) => {
          try {
            const news = await this.getNewsItems()
            onNewsChange(news)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      // Media subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_items' },
        async (payload) => {
          try {
            const media = await this.getMediaItems()
            onMediaChange(media)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      // Trophies subscription
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trophies' },
        async (payload) => {
          try {
            const trophies = await this.getTrophies()
            onTrophiesChange(trophies)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )

      channel.subscribe((status) => {
      })

      this.subscriptions.set('all-sync', channel)

      return () => {
        try {
          this.supabase.removeChannel(channel)
        } catch (error) {
          console.warn("[v0] DataService: Error removing all-sync channel:", error)
        }
        this.subscriptions.delete('all-sync')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
      return () => {}
    }
  }

  // App Users
  async getAppUsers(filters?: { role?: string; status?: string }): Promise<AppUser[]> {
    if (!this.supabase) return []
    try {
      let query = this.supabase.from('app_users').select('*')

      if (filters?.role) {
        query = query.eq('role', filters.role)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error("[v0] DataService getAppUsers error:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("[v0] DataService getAppUsers caught error:", err)
      return []
    }
  }

  async getAppUser(id: string): Promise<AppUser | null> {
    if (!this.supabase) return null
    try {
      const { data, error } = await this.supabase
        .from('app_users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("[v0] DataService getAppUser error:", error)
        return null
      }

      return data
    } catch (err) {
      console.error("[v0] DataService getAppUser caught error:", err)
      return null
    }
  }

  async createAppUser(user: Omit<AppUser, 'id' | 'created_at' | 'updated_at' | 'joined_at'>): Promise<AppUser> {
    if (!this.supabase) throw new Error('Supabase not configured')

    console.log("[v0] DataService: Creating app user:", user)

    const { data, error } = await this.supabase
      .from('app_users')
      .insert([{ ...user, joined_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) {
      console.error("[v0] DataService: Error creating app user:", error)
      throw new Error(`Failed to create user: ${error.message || JSON.stringify(error)}`)
    }

    console.log("[v0] DataService: App user created successfully:", data)
    return data
  }

  async updateAppUser(id: string, updates: Partial<AppUser>): Promise<AppUser> {
    if (!this.supabase) throw new Error('Supabase not configured')

    const { data, error } = await this.supabase
      .from('app_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteAppUser(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')

    const { error } = await this.supabase
      .from('app_users')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async searchAppUsers(query: string): Promise<AppUser[]> {
    if (!this.supabase) return []
    try {
      const { data, error } = await this.supabase
        .from('app_users')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error("[v0] DataService searchAppUsers error:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("[v0] DataService searchAppUsers caught error:", err)
      return []
    }
  }

  // News Updates
  // News updates now handled through useNewsUpdates hook
  // which queries the news_updates table separately from NewsItems

  // Cleanup
  unsubscribeAll(): void {
    if (!this.supabase) return
    this.subscriptions.forEach((channel) => {
      this.supabase!.removeChannel(channel)
    })
    this.subscriptions.clear()
  }
}

// Singleton instance
let instance: DataService | null = null

export function getDataService(): DataService {
  if (!instance) {
    instance = new DataService()
  }
  return instance
}
