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
  private subscriptions: Map<string, RealtimeChannel> = new Map()
  private supabase = createClient()
  private CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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

    try {
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
        // If table doesn't exist, don't log as error - this is expected during initial setup
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('schema cache')) {
          console.debug(`[v0] Table '${table}' not yet created, returning cached or empty data`)
          return cached?.data || []
        }
        console.error(`[v0] Error fetching ${table}:`, error)
        // Return stale cache if available, otherwise empty array
        return cached?.data || []
      }

      // Update cache
      this.cache.set(cacheKey, {
        data: data || [],
        timestamp: Date.now(),
      })

      return data || []
    } catch (err) {
      // If table doesn't exist, don't log as error - this is expected during initial setup
      if (err?.code === 'PGRST205' || err?.message?.includes('Could not find the table') || err?.message?.includes('schema cache')) {
        console.debug(`[v0] Table '${table}' not yet created (exception), returning cached or empty data`)
        return cached?.data || []
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

          // Smart invalidation: only invalidate affected cache
          const cached = this.cache.get(cacheKey)
          if (!cached) return

          const data = cached.data as T[]

          if (payload.eventType === 'INSERT') {
            // Add new item to cache
            cached.data = [...data, payload.new as T]
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
