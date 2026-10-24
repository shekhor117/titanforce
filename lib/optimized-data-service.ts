'use client'

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Optimized Data Service with Caching & Efficient Query Strategy
 * - Caches data in memory to avoid repeated queries
 * - Uses column selection to reduce payload size
 * - Implements smart invalidation on realtime updates
 * - Prevents duplicate subscriptions
 */

interface CacheEntry<T> {
  data: T[]
  timestamp: number
  channel?: RealtimeChannel
}

class OptimizedDataService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private inFlight: Map<string, Promise<any[]>> = new Map()
  private subscriptions: Map<string, RealtimeChannel> = new Map()
  private supabase = createClient()
  private CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly jsonSources: Record<string, string> = {
    players: '/data/players.json',
    player_profiles: '/data/players.json',
    player_positions: '/data/players.json',
    matches: '/data/matches.json',
    news: '/data/content.json',
    news_items: '/data/content.json',
    news_updates: '/data/content.json',
    features: '/data/content.json',
    media_items: '/data/content.json',
    partners: '/data/club.json',
    fans: '/data/club.json',
    trophies: '/data/club.json',
    products: '/data/store.json',
  }

  private normalizeRows<T>(rows: T[]): T[] {
    const seen = new Set<string>()
    return rows.filter((row: any) => {
      const key = row?.id == null ? JSON.stringify(row) : String(row.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  private async fetchJsonData<T>(table: string, source: string, options?: { select?: string; filter?: { key: string; value: any }; order?: { key: string; ascending?: boolean }; limit?: number }): Promise<T[]> {
    const response = await fetch(source, { cache: 'force-cache' })
    if (!response.ok) throw new Error(`Could not load ${source}`)
    const backup = await response.json()
    const tableAliases: Record<string, string> = {
      news_items: 'news_updates',
      media_items: 'media',
    }
    const sourceTable = tableAliases[table] ?? table
    let rows = [...(backup.tables?.[sourceTable] ?? [])] as T[]

    if (options?.filter) rows = rows.filter((row: any) => row[options.filter!.key] === options.filter!.value)
    if (options?.order) {
      const { key, ascending = true } = options.order
      rows.sort((a: any, b: any) => {
        const left = a[key] ?? ''
        const right = b[key] ?? ''
        return (left < right ? -1 : left > right ? 1 : 0) * (ascending ? 1 : -1)
      })
    }
    if (options?.limit) rows = rows.slice(0, options.limit)
    if (options?.select && options.select !== '*') {
      const fields = options.select.split(',').map((field) => field.trim())
      rows = rows.map((row: any) => Object.fromEntries(fields.map((field) => [field, row[field]]))) as T[]
    }
    return this.normalizeRows(rows)
  }

  /**
   * Get data with optional column selection and caching
   * Columns: Only fetch what's needed, not entire rows
   */
  async fetchData<T>(
    table: string,
    options?: {
      select?: string
      filter?: { key: string; value: any }
      order?: { key: string; ascending?: boolean }
      limit?: number
    }
  ): Promise<T[]> {
    const cacheKey = `${table}:${JSON.stringify(options)}`
    const cached = this.cache.get(cacheKey)

    // Return cached data if fresh (within TTL)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[v0] Returning cached data for ${table}`)
      return cached.data
    }

    console.log(`[v0] Fetching fresh data for ${table}`)
    const jsonSource = this.jsonSources[table]
    const inFlight = this.inFlight.get(cacheKey)
    if (inFlight) return inFlight as Promise<T[]>

    const request = this.fetchFromSupabase<T>(table, options, jsonSource, cacheKey)
    this.inFlight.set(cacheKey, request)
    return request.finally(() => this.inFlight.delete(cacheKey))
  }

  private async fetchFromSupabase<T>(
    table: string,
    options: { select?: string; filter?: { key: string; value: any }; order?: { key: string; ascending?: boolean }; limit?: number } | undefined,
    jsonSource: string | undefined,
    cacheKey: string,
  ): Promise<T[]> {
    const cached = this.cache.get(cacheKey)

    try {
      // Supabase is the source of truth. Static JSON is only a fast fallback
      // when a table is unavailable or the network is temporarily offline.
      let query = this.supabase.from(table).select(options?.select || '*')

      if (options?.filter) {
        query = query.eq(options.filter.key, options.filter.value)
      }

      if (options?.order) {
        query = query.order(options.order.key, {
          ascending: options.order.ascending !== false,
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        if (jsonSource) {
          const fallback = await this.fetchJsonData<T>(table, jsonSource, options)
          this.cache.set(cacheKey, { data: fallback, timestamp: Date.now() })
          return fallback
        }
        console.error(`[v0] Error fetching ${table}:`, error)
        return cached?.data || []
      }

      // Update cache
      const normalizedData = this.normalizeRows<T>((data || []) as T[])
      this.cache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now(),
      })

      return normalizedData
    } catch (err) {
      if (jsonSource) {
        const fallback = await this.fetchJsonData<T>(table, jsonSource, options)
        this.cache.set(cacheKey, { data: fallback, timestamp: Date.now() })
        return fallback
      }
      console.error(`[v0] Exception fetching ${table}:`, err)
      return cached?.data || []
    }
  }

  /**
   * Smart realtime subscription that updates cache instead of re-fetching all data
   */
  subscribeToTable<T extends { id: string }>(
    table: string,
    onUpdate: (data: T[]) => void,
    options?: { select?: string; filter?: { key: string; value: any } }
  ): () => void {
    const cacheKey = `${table}:${JSON.stringify(options)}`
    const channelKey = `${table}:channel`

    // Clean up existing subscription for this table
    const existing = this.subscriptions.get(channelKey)
    if (existing) {
      try {
        this.supabase.removeChannel(existing)
        this.subscriptions.delete(channelKey)
      } catch (e) {
        console.warn(`[v0] Error removing old subscription for ${table}:`, e)
      }
    }

    // Create new subscription
    const channel = this.supabase
      .channel(`${table}-changes-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        async (payload: any) => {
          console.log(`[v0] Real-time change for ${table}:`, payload.eventType)

          // Keep the visible list current even after a mutation invalidates its cache.
          const cached = this.cache.get(cacheKey)
          if (!cached) {
            const refreshed = await this.fetchData<T>(table, {
              select: options?.select,
              filter: options?.filter,
            })
            onUpdate(refreshed)
            return
          }

          const data = cached.data as T[]

          if (payload.eventType === 'INSERT') {
            // Realtime can replay an insert after a refresh; keep one row per id.
            cached.data = this.normalizeRows([...data, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            // Update existing item
            cached.data = data.map((item) =>
              item.id === (payload.new as T).id ? (payload.new as T) : item
            )
          } else if (payload.eventType === 'DELETE') {
            // Remove item from cache
            cached.data = data.filter((item) => item.id !== (payload.old as T).id)
          }

          // Update timestamp and notify
          cached.timestamp = Date.now()
          onUpdate(cached.data)
        }
      )
      .subscribe((status) => {
        console.log(`[v0] Subscription status for ${table}:`, status)
      })

    this.subscriptions.set(channelKey, channel)

    // Return unsubscribe function
    return () => {
      try {
        this.supabase.removeChannel(channel)
        this.subscriptions.delete(channelKey)
      } catch (e) {
        console.warn(`[v0] Error unsubscribing from ${table}:`, e)
      }
    }
  }

  /**
   * Invalidate cache for a specific table
   */
  invalidateCache(table?: string): void {
    if (table) {
      // Invalidate specific table caches
      for (const key of this.cache.keys()) {
        if (key.startsWith(table)) {
          this.cache.delete(key)
        }
      }
      console.log(`[v0] Invalidated cache for ${table}`)
    } else {
      // Clear all caches
      this.cache.clear()
      console.log(`[v0] Cleared all caches`)
    }
  }

  /**
   * Preload frequently accessed data
   */
  async preload(tables: Array<{ table: string; select?: string; limit?: number }>): Promise<void> {
    console.log(`[v0] Preloading ${tables.length} tables...`)
    await Promise.all(
      tables.map((t) =>
        this.fetchData(t.table, {
          select: t.select,
          limit: t.limit,
        }).catch((err) => console.warn(`[v0] Preload failed for ${t.table}:`, err))
      )
    )
  }

  /**
   * Get cache stats for monitoring
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      size: JSON.stringify(value.data).length,
      age: Date.now() - value.timestamp,
    }))

    return {
      totalEntries: this.cache.size,
      totalSize: entries.reduce((sum, e) => sum + e.size, 0),
      entries,
    }
  }
}

export const optimizedDataService = new OptimizedDataService()
