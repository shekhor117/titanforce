'use client'

import { createClient } from '@/lib/supabase/client'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Optimized Supabase query service with intelligent caching
 * - Deduplicates simultaneous requests
 * - Caches results with TTL
 * - Batch loads related data
 */
class SupabaseQueryOptimizer {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private pendingRequests: Map<string, Promise<any>> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  private getCacheKey(table: string, filter?: Record<string, any>): string {
    if (!filter) return `${table}:all`
    return `${table}:${JSON.stringify(filter)}`
  }

  private isCacheValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl
  }

  /**
   * Query with automatic deduplication and caching
   */
  async query<T>(
    table: string,
    options?: {
      select?: string
      filter?: Record<string, any>
      order?: { column: string; ascending?: boolean }
      limit?: number
      ttl?: number
    }
  ): Promise<T[]> {
    const cacheKey = this.getCacheKey(table, options?.filter)
    const ttl = options?.ttl ?? this.DEFAULT_TTL

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached)) {
      return cached.data
    }

    // Check if request is already in flight - return that instead of duplicating
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!
    }

    // Execute query
    const request = this._executeQuery<T>(table, options)
    this.pendingRequests.set(cacheKey, request)

    try {
      const data = await request
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now(), ttl })
      return data
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  private async _executeQuery<T>(
    table: string,
    options?: {
      select?: string
      filter?: Record<string, any>
      order?: { column: string; ascending?: boolean }
      limit?: number
    }
  ): Promise<T[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      let query = supabase.from(table).select(options?.select || '*')

      // Apply filters
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      // Apply ordering
      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        })
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error(`[v0] Supabase query error for ${table}:`, error)
        return []
      }

      return (data as T[]) || []
    } catch (err) {
      console.error(`[v0] Supabase query exception for ${table}:`, err)
      return []
    }
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(table: string, filter?: Record<string, any>): void {
    const cacheKey = this.getCacheKey(table, filter)
    this.cache.delete(cacheKey)
  }

  /**
   * Invalidate all cache for a table
   */
  invalidateTable(table: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
      key.startsWith(`${table}:`)
    )
    keysToDelete.forEach((key) => this.cache.delete(key))
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats for debugging
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    }
  }
}

// Export singleton instance
export const supabaseQueryOptimizer = new SupabaseQueryOptimizer()
