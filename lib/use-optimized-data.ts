'use client'

import { useEffect, useState } from 'react'
import { optimizedDataService } from './optimized-data-service'

interface FetchOptions {
  select?: string
  filter?: { key: string; value: any }
  order?: { key: string; ascending?: boolean }
  limit?: number
  revalidateOnFocus?: boolean
  revalidateInterval?: number // ms, 0 = disable auto-refresh
}

/**
 * Optimized hook for fetching Supabase data with smart caching
 * - Deduplicates requests
 * - Returns cached data immediately
 * - Auto-refreshes stale data
 * - Subscribes to realtime updates
 */
export function useOptimizedData<T extends { id: string } = any>(
  table: string,
  options: FetchOptions = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    let unsubscribe: (() => void) | null = null
    let refreshInterval: NodeJS.Timeout | null = null

    const initialize = async () => {
      try {
        // Fetch initial data
        const result = await optimizedDataService.fetchData<T>(table, options)
        if (isMounted) {
          setData(result)
          setError(null)
          setLoading(false)
        }

        // Set up realtime subscription
        unsubscribe = optimizedDataService.subscribeToTable<T>(
          table,
          (updated) => {
            if (isMounted) {
              setData(updated)
            }
          },
          { select: options.select, filter: options.filter }
        )

        // Optional: Auto-refresh at interval
        if (options.revalidateInterval && options.revalidateInterval > 0) {
          refreshInterval = setInterval(async () => {
            if (isMounted) {
              optimizedDataService.invalidateCache(table)
              const refreshed = await optimizedDataService.fetchData<T>(table, options)
              if (isMounted) {
                setData(refreshed)
              }
            }
          }, options.revalidateInterval)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        if (isMounted) {
          setError(error)
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      unsubscribe?.()
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [table, options])

  return { data, loading, error }
}

/**
 * Hook for inserting data and auto-refreshing cache
 */
export function useOptimizedInsert<T extends Record<string, any>>(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const insert = async (record: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { data, error: insertError } = await supabase
        .from(table)
        .insert([record])
        .select()
        .single()

      if (insertError) throw insertError

      // Invalidate cache to fetch fresh data
      optimizedDataService.invalidateCache(table)

      console.log(`[v0] Inserted into ${table}:`, data)
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error(`[v0] Insert error for ${table}:`, error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return { insert, loading, error }
}

/**
 * Hook for updating data and auto-refreshing cache
 */
export function useOptimizedUpdate<T extends { id: string }>(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (id: string, updates: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { data, error: updateError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Invalidate cache
      optimizedDataService.invalidateCache(table)

      console.log(`[v0] Updated ${table}:`, data)
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error(`[v0] Update error for ${table}:`, error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

/**
 * Hook for deleting data and auto-refreshing cache
 */
export function useOptimizedDelete(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const delete_ = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Invalidate cache
      optimizedDataService.invalidateCache(table)

      console.log(`[v0] Deleted from ${table}: ${id}`)
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error(`[v0] Delete error for ${table}:`, error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
