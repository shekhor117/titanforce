'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '@/lib/use-realtime-data'

/**
 * Comprehensive admin hook for managing all data types with real-time sync
 * Handles CRUD operations via API routes with automatic real-time updates
 */
export function useAdminData<T extends { id: string }>(tableName: string) {
  const [data, setData] = useState<T[]>([])
  const [readLoading, setReadLoading] = useState(true)
  const [readError, setReadError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setReadLoading(true)
    try {
      const response = await fetch(`/api/admin/${tableName}`, { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Failed to load records')
      setData(Array.isArray(payload) ? payload : [])
      setReadError(null)
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error('Failed to load records')
      setReadError(nextError)
    } finally {
      setReadLoading(false)
    }
  }, [tableName])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // All admin writes go through the protected server API so the browser never
  // bypasses the admin authorization and table allowlist.

  // Create wrapper functions that use API routes for admin operations
  const createRecord = useCallback(
    async (record: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const response = await fetch(`/api/admin/${tableName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create record')
        }

        const created = await response.json()
        setData((current) => [...current, created as T])
        console.log(`[v0] Created ${tableName} record:`, created)
        return { data: created, error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        console.error(`[v0] Error creating ${tableName}:`, error)
        return { data: null, error }
      }
    },
    [tableName]
  )

  const updateRecord = useCallback(
    async (id: string, updates: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>) => {
      try {
        const response = await fetch(`/api/admin/${tableName}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update record')
        }

        const updated = await response.json()
        setData((current) => current.map((item) => item.id === id ? updated as T : item))
        console.log(`[v0] Updated ${tableName} record:`, updated)
        return { data: updated, error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        console.error(`[v0] Error updating ${tableName}:`, error)
        return { data: null, error }
      }
    },
    [tableName]
  )

  const deleteRecord = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/admin/${tableName}?id=${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to delete record')
        }

        setData((current) => current.filter((item) => item.id !== id))
        console.log(`[v0] Deleted ${tableName} record:`, id)
        return { error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        console.error(`[v0] Error deleting ${tableName}:`, error)
        return { error }
      }
    },
    [tableName]
  )

  return {
    data,
    loading: readLoading,
    error: readError,
    refresh,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}

/**
 * Hook for bulk operations
 */
export function useAdminBulkOperations<T extends { id: string }>(tableName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const bulkUpdate = useCallback(
    async (records: Array<T>) => {
      try {
        setLoading(true)
        setError(null)

        const promises = records.map((record) =>
          fetch(`/api/admin/${tableName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record),
          })
        )

        const responses = await Promise.all(promises)
        const failed = responses.filter((r) => !r.ok)

        if (failed.length > 0) {
          throw new Error(`Failed to update ${failed.length} records`)
        }

        console.log(`[v0] Bulk updated ${records.length} ${tableName} records`)
        return { error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error(`[v0] Error bulk updating ${tableName}:`, error)
        return { error }
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      try {
        setLoading(true)
        setError(null)

        const promises = ids.map((id) =>
          fetch(`/api/admin/${tableName}?id=${id}`, {
            method: 'DELETE',
          })
        )

        const responses = await Promise.all(promises)
        const failed = responses.filter((r) => !r.ok)

        if (failed.length > 0) {
          throw new Error(`Failed to delete ${failed.length} records`)
        }

        console.log(`[v0] Bulk deleted ${ids.length} ${tableName} records`)
        return { error: null }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error(`[v0] Error bulk deleting ${tableName}:`, error)
        return { error }
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  return {
    loading,
    error,
    bulkUpdate,
    bulkDelete,
  }
}
