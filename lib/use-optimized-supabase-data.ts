'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabaseQueryOptimizer } from '@/lib/supabase-query-optimizer'

interface UseSupabaseDataOptions {
  select?: string
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
  ttl?: number
  // Disable automatic refetch on mount
  enabled?: boolean
}

/**
 * Optimized Supabase data hook with request deduplication and caching
 * Prevents duplicate requests and reuses cached data
 */
export function useSupabaseData<T>(
  table: string,
  options: UseSupabaseDataOptions = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const enabled = options.enabled !== false

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      const result = await supabaseQueryOptimizer.query<T>(table, {
        select: options.select,
        filter: options.filter,
        order: options.order,
        limit: options.limit,
        ttl: options.ttl,
      })

      if (isMountedRef.current) {
        setData(result)
        setError(null)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      if (isMountedRef.current) {
        setError(error)
        console.error(`[v0] Error fetching ${table}:`, error)
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [table, options.select, options.filter, options.order, options.limit, options.ttl, enabled])

  useEffect(() => {
    isMountedRef.current = true
    fetchData()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchData])

  const refetch = useCallback(async () => {
    supabaseQueryOptimizer.invalidate(table, options.filter)
    await fetchData()
  }, [table, options.filter, fetchData])

  const invalidate = useCallback(() => {
    supabaseQueryOptimizer.invalidate(table, options.filter)
  }, [table, options.filter])

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
  }
}

/**
 * Batch fetch multiple tables in parallel
 */
export async function batchFetchSupabase<T extends Record<string, any>>(
  queries: Array<{
    table: string
    options?: UseSupabaseDataOptions
  }>
): Promise<T> {
  const results = await Promise.all(
    queries.map((q) =>
      supabaseQueryOptimizer.query(q.table, q.options)
    )
  )

  return queries.reduce((acc, q, idx) => {
    acc[q.table] = results[idx]
    return acc
  }, {} as T)
}
