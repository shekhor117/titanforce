'use client'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

// Types
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

export interface Match {
  id: string
  date: string
  opponent: string
  result?: string
  goals_for?: number
  goals_against?: number
  lineup?: string[]
  mvp?: string
  status: 'scheduled' | 'live' | 'completed'
  notes?: string
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
  image_url?: string
  author_id?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
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
    console.log("[v0] DataService: Fetching players from Supabase")
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, returning empty array")
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('*')
        .order('num', { ascending: true })

      if (error) {
        console.error("[v0] DataService: getPlayers error:", error)
        // Log the error but don't throw - return empty array for graceful degradation
        console.error("[v0] DataService: Returning empty players array due to error")
        return []
      }
      console.log("[v0] DataService: Got", data?.length || 0, "players")
      return data || []
    } catch (error) {
      console.error("[v0] DataService: getPlayers exception:", error)
      return []
    }
  }

  async getPlayer(id: string): Promise<Player | null> {
    if (!this.supabase) return null
    const { data, error } = await this.supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  async createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('players')
      .insert([player])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deletePlayer(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToPlayers(callback: DataCallback<Player>, onError?: ErrorCallback): () => void {
    console.log("[v0] DataService: Subscribing to players changes")
    
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, skipping subscription")
      return () => {}
    }
    
    // Clean up any existing subscription first
    const existingChannel = this.subscriptions.get('players')
    if (existingChannel) {
      console.log("[v0] DataService: Cleaning up existing players subscription")
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
        async (payload) => {
          console.log("[v0] DataService: Players change event received:", payload.eventType)
          try {
            const players = await this.getPlayers()
            callback(players)
          } catch (error) {
            console.error("[v0] DataService: Error fetching updated players:", error)
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )
      .on('subscribe', () => {
        console.log("[v0] DataService: Players subscription active")
      })
      .on('unsubscribe', () => {
        console.log("[v0] DataService: Players subscription closed")
      })
      .subscribe((status) => {
        console.log("[v0] DataService: Players subscription status:", status)
      })

    this.subscriptions.set('players', channel)

    return () => {
      console.log("[v0] DataService: Unsubscribing from players")
      try {
        this.supabase.removeChannel(channel)
      } catch (error) {
        console.warn("[v0] DataService: Error removing players channel:", error)
      }
      this.subscriptions.delete('players')
    }
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    console.log("[v0] DataService: Fetching matches from Supabase")
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, returning empty array")
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error("[v0] DataService: getMatches error:", error)
        console.error("[v0] DataService: Returning empty matches array due to error")
        return []
      }
      console.log("[v0] DataService: Got", data?.length || 0, "matches")
      return data || []
    } catch (error) {
      console.error("[v0] DataService: getMatches exception:", error)
      return []
    }
  }

  async createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('matches')
      .insert([match])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { data, error } = await this.supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMatch(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('matches')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToMatches(callback: DataCallback<Match>, onError?: ErrorCallback): () => void {
    console.log("[v0] DataService: Subscribing to matches changes")
    
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, skipping subscription")
      return () => {}
    }
    
    // Clean up any existing subscription first
    const existingChannel = this.subscriptions.get('matches')
    if (existingChannel) {
      console.log("[v0] DataService: Cleaning up existing matches subscription")
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
      console.log("[v0] DataService: Unsubscribing from matches")
      try {
        this.supabase.removeChannel(channel)
      } catch (error) {
        console.warn("[v0] DataService: Error removing matches channel:", error)
      }
      this.subscriptions.delete('matches')
    }
  }

  // Partners
  async getPartners(): Promise<Partner[]> {
    console.log("[v0] DataService: Fetching partners from Supabase")
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, returning empty array")
      return []
    }
    try {
      const { data, error } = await this.supabase
        .from('partners')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error("[v0] DataService: getPartners error:", error)
        console.error("[v0] DataService: Returning empty partners array due to error")
        return []
      }
      console.log("[v0] DataService: Got", data?.length || 0, "partners")
      return data || []
    } catch (error) {
      console.error("[v0] DataService: getPartners exception:", error)
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
    console.log("[v0] DataService: Subscribing to partners changes")
    
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, skipping subscription")
      return () => {}
    }
    
    // Clean up any existing subscription first
    const existingChannel = this.subscriptions.get('partners')
    if (existingChannel) {
      console.log("[v0] DataService: Cleaning up existing partners subscription")
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
      console.log("[v0] DataService: Unsubscribing from partners")
      try {
        this.supabase.removeChannel(channel)
      } catch (error) {
        console.warn("[v0] DataService: Error removing partners channel:", error)
      }
      this.subscriptions.delete('partners')
    }
  }

  // News Items
  async getNewsItems(includeUnpublished = false): Promise<NewsItem[]> {
    console.log("[v0] DataService: Fetching news items from Supabase")
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, returning empty array")
      return []
    }
    try {
      let query = this.supabase.from('news_items').select('*')

      if (!includeUnpublished) {
        query = query.eq('status', 'published')
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error("[v0] DataService: getNewsItems error:", error)
        console.error("[v0] DataService: Returning empty news items array due to error")
        return []
      }
      console.log("[v0] DataService: Got", data?.length || 0, "news items")
      return data || []
    } catch (error) {
      console.error("[v0] DataService: getNewsItems exception:", error)
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

    if (error) throw error
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

    if (error) throw error
    return data
  }

  async deleteNewsItem(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured')
    const { error } = await this.supabase
      .from('news_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToNewsItems(callback: DataCallback<NewsItem>, onError?: ErrorCallback): () => void {
    console.log("[v0] DataService: Subscribing to news changes")
    
    if (!this.supabase) {
      console.log("[v0] DataService: Supabase not configured, skipping subscription")
      return () => {}
    }
    
    // Clean up any existing subscription first
    const existingChannel = this.subscriptions.get('news')
    if (existingChannel) {
      console.log("[v0] DataService: Cleaning up existing news subscription")
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
      console.log("[v0] DataService: Unsubscribing from news")
      try {
        this.supabase.removeChannel(channel)
      } catch (error) {
        console.warn("[v0] DataService: Error removing news channel:", error)
      }
      this.subscriptions.delete('news')
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
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('media')
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
