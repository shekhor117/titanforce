'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getAdminSyncManager, type SyncStatus } from '@/lib/admin-sync-manager'

export interface UseAdminSyncOptions {
  tableName: string
  refreshInterval?: number // ms between background syncs, 0 = disabled
  onError?: (error: Error) => void
  enableRealtime?: boolean // default true
}

export interface UseAdminSyncReturn<T> {
  data: T[]
  status: SyncStatus
  lastSyncTime: Date | null
  pendingChanges: Map<string, any>
  conflictedItems: Map<string, any>
  
  // Actions
  refresh: () => Promise<void>
  pushChange: (id: string, updates: any) => Promise<void>
  resolveConflict: (id: string, useLocal: boolean) => Promise<void>
  
  // Utilities
  hasPendingChanges: () => boolean
  hasConflicts: () => boolean
  getPendingCount: () => number
  getConflictCount: () => number
}

/**
 * Hook for admin panel sync with Supabase
 * Provides real-time updates, manual refresh, background sync, and conflict resolution
 */
export function useAdminSync<T extends { id: string }>(
  options: UseAdminSyncOptions
): UseAdminSyncReturn<T> {
  const { 
    tableName, 
    refreshInterval = 30000, // 30 seconds default
    onError,
    enableRealtime = true 
  } = options

  const [data, setData] = useState<T[]>([])
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map())
  const [conflictedItems, setConflictedItems] = useState<Map<string, any>>(new Map())
  
  const syncManager = useRef(getAdminSyncManager())
  const mounted = useRef(true)

  // Initialize sync
  useEffect(() => {
    if (!enableRealtime) return

    const manager = syncManager.current

    // Initialize with configuration
    manager.initializeSync({
      tableName,
      refreshInterval,
      onError,
      onStatusChange: (newStatus) => {
        if (mounted.current) {
          setStatus(newStatus)
        }
      },
    })

    // Listen for sync events
    const handleSyncChange = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail.tableName === tableName && mounted.current) {
        // Data changed, refresh
        updateLocalState()
      }
    }

    const handleSyncRefresh = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail.tableName === tableName && mounted.current) {
        const newData = customEvent.detail.data || []
        setData(newData as T[])
        setLastSyncTime(new Date(manager.getLastSyncTime(tableName) || Date.now()))
      }
    }

    const handleSyncPush = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail.tableName === tableName && mounted.current) {
        updateLocalState()
      }
    }

    window.addEventListener('admin-sync-change', handleSyncChange)
    window.addEventListener('admin-sync-refresh', handleSyncRefresh)
    window.addEventListener('admin-sync-push', handleSyncPush)

    // Initial refresh
    updateLocalState()

    return () => {
      window.removeEventListener('admin-sync-change', handleSyncChange)
      window.removeEventListener('admin-sync-refresh', handleSyncRefresh)
      window.removeEventListener('admin-sync-push', handleSyncPush)
      manager.cleanup(tableName)
    }
  }, [tableName, refreshInterval, onError, enableRealtime])

  // Update cleanup flag
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  // Update local state from manager
  const updateLocalState = useCallback(() => {
    const manager = syncManager.current
    if (mounted.current) {
      setStatus(manager.getStatus(tableName))
      setLastSyncTime(
        manager.getLastSyncTime(tableName)
          ? new Date(manager.getLastSyncTime(tableName)!)
          : null
      )
      setPendingChanges(new Map(manager.getPendingChanges(tableName)))
      setConflictedItems(new Map(manager.getConflictedItems(tableName)))
    }
  }, [tableName])

  // Action: Manual refresh
  const refresh = useCallback(async () => {
    try {
      const result = await syncManager.current.refreshTable(tableName)
      if (result && mounted.current) {
        setData(result as T[])
        setLastSyncTime(new Date())
      }
    } catch (error) {
      console.error('[v0] Manual refresh failed:', error)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [tableName, onError])

  // Action: Push changes
  const pushChange = useCallback(
    async (id: string, updates: any) => {
      try {
        const result = await syncManager.current.pushChanges(tableName, id, updates)
        if (result && mounted.current) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...result } : item))
          )
          updateLocalState()
        }
      } catch (error) {
        console.error('[v0] Push changes failed:', error)
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    },
    [tableName, onError, updateLocalState]
  )

  // Action: Resolve conflict
  const resolveConflict = useCallback(
    async (id: string, useLocal: boolean) => {
      try {
        await syncManager.current.resolveConflict(tableName, id, useLocal)
        updateLocalState()
      } catch (error) {
        console.error('[v0] Conflict resolution failed:', error)
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    },
    [tableName, updateLocalState, onError]
  )

  // Utilities
  const hasPendingChanges = useCallback(() => pendingChanges.size > 0, [pendingChanges])
  const hasConflicts = useCallback(() => conflictedItems.size > 0, [conflictedItems])
  const getPendingCount = useCallback(() => pendingChanges.size, [pendingChanges])
  const getConflictCount = useCallback(() => conflictedItems.size, [conflictedItems])

  return {
    data,
    status,
    lastSyncTime,
    pendingChanges,
    conflictedItems,
    refresh,
    pushChange,
    resolveConflict,
    hasPendingChanges,
    hasConflicts,
    getPendingCount,
    getConflictCount,
  }
}
