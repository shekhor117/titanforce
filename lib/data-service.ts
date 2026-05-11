'use client'

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Types
export interface Player {
  id: string
  num: number
  name: string
  full_name: string
  pos: string
  cat: 'GK' | 'DEF' | 'MID' | 'FWD'
  age?: number
  hometown?: string
  foot?: 'Left' | 'Right' | 'Both'
  goals: number
  assists: number
  photo_url?: string
  status: 'active' | 'injured' | 'suspended'
  bio?: string
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
  private supabase = createClient()
  private subscriptions: Map<string, RealtimeChannel> = new Map()

  // Players
  async getPlayers(): Promise<Player[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select('*')
      .order('num', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await this.supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  async createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .insert([player])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
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
    const { error } = await this.supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToPlayers(callback: DataCallback<Player>, onError?: ErrorCallback): () => void {
    const channel = this.supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        async () => {
          try {
            const players = await this.getPlayers()
            callback(players)
          } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }
      )
      .subscribe()

    this.subscriptions.set('players', channel)

    return () => {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('players')
    }
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    const { data, error } = await this.supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    const { data, error } = await this.supabase
      .from('matches')
      .insert([match])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
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
    const { error } = await this.supabase
      .from('matches')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToMatches(callback: DataCallback<Match>, onError?: ErrorCallback): () => void {
    const channel = this.supabase
      .channel('matches-changes')
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
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('matches')
    }
  }

  // Partners
  async getPartners(): Promise<Partner[]> {
    const { data, error } = await this.supabase
      .from('partners')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
    const { data, error } = await this.supabase
      .from('partners')
      .insert([partner])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePartner(id: string, updates: Partial<Partner>): Promise<Partner> {
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
    const { error } = await this.supabase
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToPartners(callback: DataCallback<Partner>, onError?: ErrorCallback): () => void {
    const channel = this.supabase
      .channel('partners-changes')
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
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('partners')
    }
  }

  // News Items
  async getNewsItems(includeUnpublished = false): Promise<NewsItem[]> {
    let query = this.supabase.from('news_items').select('*')

    if (!includeUnpublished) {
      query = query.eq('status', 'published')
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createNewsItem(item: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>): Promise<NewsItem> {
    const { data, error } = await this.supabase
      .from('news_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<NewsItem> {
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
    const { error } = await this.supabase
      .from('news_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToNewsItems(callback: DataCallback<NewsItem>, onError?: ErrorCallback): () => void {
    const channel = this.supabase
      .channel('news-changes')
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
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('news')
    }
  }

  // Media Items
  async getMediaItems(): Promise<MediaItem[]> {
    const { data, error } = await this.supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createMediaItem(item: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
    const { data, error } = await this.supabase
      .from('media_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
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
    const { error } = await this.supabase
      .from('media_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  subscribeToMediaItems(callback: DataCallback<MediaItem>, onError?: ErrorCallback): () => void {
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
    this.subscriptions.forEach((channel) => {
      this.supabase.removeChannel(channel)
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
