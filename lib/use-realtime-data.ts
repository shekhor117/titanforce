'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeDataOptions {
  tableName: string
  filter?: string
  onError?: (error: Error) => void
}

/**
 * Hook for real-time data synchronization with Supabase
 * Automatically subscribes to table changes and updates data when changes occur
 */
export function useRealtimeData<T extends { id: string }>(options: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let query = supabase.from(options.tableName).select('*')

        if (options.filter) {
          query = query.eq(options.filter.split('=')[0], options.filter.split('=')[1])
        }

        const { data: result, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        setData(result as T[])
        setError(null)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        options.onError?.(error)
        console.error(`[v0] Error fetching ${options.tableName}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [options.tableName, options.filter])

  // Real-time subscription
  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`${options.tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: options.tableName,
        },
        (payload) => {
          console.log(`[v0] Real-time update for ${options.tableName}:`, payload)

          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.id === (payload.new as T).id ? (payload.new as T) : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== (payload.old as T).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [options.tableName])

  return { data, loading, error }
}

/**
 * Hook for creating a new record in Supabase
 */
export function useSupabaseInsert<T extends Record<string, any>>(tableName: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const insert = useCallback(
    async (record: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: insertError } = await supabase
          .from(tableName)
          .insert([record])
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        console.log(`[v0] Successfully inserted into ${tableName}:`, data)
        return { data, error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error(`[v0] Error inserting into ${tableName}:`, error)
        return { data: null, error }
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  return { insert, loading, error }
}

/**
 * Hook for updating a record in Supabase
 */
export function useSupabaseUpdate<T extends { id: string }>(tableName: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(
    async (id: string, updates: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: updateError } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (updateError) {
          throw updateError
        }

        console.log(`[v0] Successfully updated in ${tableName}:`, data)
        return { data, error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error(`[v0] Error updating ${tableName}:`, error)
        return { data: null, error }
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  return { update, loading, error }
}

/**
 * Hook for deleting a record in Supabase
 */
export function useSupabaseDelete(tableName: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const delete_ = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        setError(null)

        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id)

        if (deleteError) {
          throw deleteError
        }

        console.log(`[v0] Successfully deleted from ${tableName}: ${id}`)
        return { error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error(`[v0] Error deleting from ${tableName}:`, error)
        return { error }
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  return { delete: delete_, loading, error }
}
