/**
 * Admin Panel Sync Manager
 * Comprehensive real-time synchronization between admin panel and Supabase
 * Features:
 * - Real-time live updates (push/pull)
 * - Two-way sync (changes sync bidirectionally)
 * - Manual refresh capability
 * - Background polling for sync
 * - Sync status indicators
 * - Conflict resolution
 */

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
export type SyncDirection = 'push' | 'pull' | 'both'

export interface SyncConfig {
  tableName: string
  refreshInterval?: number // ms, 0 = no background sync
  onError?: (error: Error) => void
  onStatusChange?: (status: SyncStatus) => void
}

export interface AdminSyncState {
  status: SyncStatus
  lastSyncTime: number | null
  pendingChanges: Map<string, any>
  conflictedItems: Map<string, any>
}

class AdminSyncManager {
  private configs: Map<string, SyncConfig> = new Map()
  private states: Map<string, AdminSyncState> = new Map()
  private channels: Map<string, RealtimeChannel> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private supabase = createClient()
  private isOnline = true

  constructor() {
    // Monitor online/offline status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[v0] Admin Sync: Coming online, syncing all tables...')
        this.isOnline = true
        this.syncAllTables()
      })
      window.addEventListener('offline', () => {
        console.log('[v0] Admin Sync: Gone offline')
        this.isOnline = false
      })
    }
  }

  /**
   * Initialize sync for a table
   */
  initializeSync(config: SyncConfig) {
    const { tableName } = config

    if (this.configs.has(tableName)) {
      console.warn(`[v0] Sync already initialized for ${tableName}`)
      return
    }

    this.configs.set(tableName, config)
    this.states.set(tableName, {
      status: 'idle',
      lastSyncTime: null,
      pendingChanges: new Map(),
      conflictedItems: new Map(),
    })

    console.log(`[v0] Admin Sync: Initializing for ${tableName}`)

    // Set up real-time subscription
    this.setupRealtimeSubscription(tableName)

    // Set up background sync if interval is specified
    if (config.refreshInterval && config.refreshInterval > 0) {
      this.setupBackgroundSync(tableName, config.refreshInterval)
    }
  }

  /**
   * Setup real-time subscription for a table
   */
  private setupRealtimeSubscription(tableName: string) {
    try {
      const channel = this.supabase
        .channel(`admin_${tableName}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
          },
          async (payload) => {
            console.log(`[v0] Real-time change for ${tableName}:`, payload)
            await this.handleRealtimeChange(tableName, payload)
          }
        )
        .subscribe((status) => {
          console.log(`[v0] Realtime subscription status for ${tableName}:`, status)
          if (status === 'SUBSCRIBED') {
            this.updateStatus(tableName, 'synced')
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            this.updateStatus(tableName, 'error')
            // Fall back to polling
            if (!this.intervals.has(tableName)) {
              const config = this.configs.get(tableName)
              if (config?.refreshInterval) {
                this.setupBackgroundSync(tableName, config.refreshInterval)
              }
            }
          }
        })

      this.channels.set(tableName, channel)
    } catch (error) {
      console.error(`[v0] Error setting up realtime subscription for ${tableName}:`, error)
      this.updateStatus(tableName, 'error')
    }
  }

  /**
   * Setup background polling sync
   */
  private setupBackgroundSync(tableName: string, interval: number) {
    if (this.intervals.has(tableName)) {
      clearInterval(this.intervals.get(tableName)!)
    }

    const intervalId = setInterval(async () => {
      if (this.isOnline) {
        await this.refreshTable(tableName)
      }
    }, interval)

    this.intervals.set(tableName, intervalId)
    console.log(`[v0] Background sync setup for ${tableName} every ${interval}ms`)
  }

  /**
   * Handle real-time changes from Supabase
   */
  private async handleRealtimeChange(tableName: string, payload: any) {
    const state = this.states.get(tableName)
    if (!state) return

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('admin-sync-change', {
        detail: { tableName, payload },
      })
      window.dispatchEvent(event)
    }

    // Check for conflicts with pending local changes
    if (payload.new && state.pendingChanges.has(payload.new.id)) {
      console.warn(`[v0] Conflict detected for ${tableName}:${payload.new.id}`)
      state.conflictedItems.set(payload.new.id, {
        local: state.pendingChanges.get(payload.new.id),
        remote: payload.new,
      })
    }
  }

  /**
   * Refresh a table (pull latest data)
   */
  async refreshTable(tableName: string) {
    const config = this.configs.get(tableName)
    if (!config) return

    try {
      this.updateStatus(tableName, 'syncing')

      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Emit refresh event
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('admin-sync-refresh', {
          detail: { tableName, data },
        })
        window.dispatchEvent(event)
      }

      const state = this.states.get(tableName)!
      state.lastSyncTime = Date.now()
      this.updateStatus(tableName, 'synced')

      console.log(`[v0] Refreshed ${tableName}: ${data?.length || 0} records`)
      return data
    } catch (error) {
      console.error(`[v0] Error refreshing ${tableName}:`, error)
      this.updateStatus(tableName, 'error')
      config.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Push local changes to Supabase
   */
  async pushChanges(tableName: string, id: string, updates: any) {
    const config = this.configs.get(tableName)
    if (!config) return

    const state = this.states.get(tableName)!

    try {
      this.updateStatus(tableName, 'syncing')

      // Store locally pending change
      state.pendingChanges.set(id, updates)

      const { data, error } = await this.supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear from pending once pushed
      state.pendingChanges.delete(id)
      state.conflictedItems.delete(id)
      state.lastSyncTime = Date.now()

      this.updateStatus(tableName, 'synced')

      // Emit push event
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('admin-sync-push', {
          detail: { tableName, id, data },
        })
        window.dispatchEvent(event)
      }

      console.log(`[v0] Pushed changes to ${tableName}:${id}`)
      return data
    } catch (error) {
      console.error(`[v0] Error pushing changes to ${tableName}:`, error)
      this.updateStatus(tableName, 'error')
      config.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Resolve conflict (choose local or remote)
   */
  async resolveConflict(tableName: string, id: string, useLocal: boolean) {
    const state = this.states.get(tableName)
    if (!state) return

    const conflict = state.conflictedItems.get(id)
    if (!conflict) {
      console.warn(`[v0] No conflict found for ${tableName}:${id}`)
      return
    }

    if (useLocal) {
      // Push local version
      await this.pushChanges(tableName, id, conflict.local)
    } else {
      // Accept remote version, clear local changes
      state.pendingChanges.delete(id)
    }

    state.conflictedItems.delete(id)
  }

  /**
   * Sync all tables (for recovery from offline)
   */
  async syncAllTables() {
    const promises = Array.from(this.configs.keys()).map((tableName) =>
      this.refreshTable(tableName)
    )
    await Promise.all(promises)
  }

  /**
   * Get sync status for a table
   */
  getStatus(tableName: string): SyncStatus {
    if (!this.isOnline) return 'offline'
    return this.states.get(tableName)?.status || 'idle'
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(tableName: string): number | null {
    return this.states.get(tableName)?.lastSyncTime || null
  }

  /**
   * Get pending changes
   */
  getPendingChanges(tableName: string) {
    return this.states.get(tableName)?.pendingChanges || new Map()
  }

  /**
   * Get conflicted items
   */
  getConflictedItems(tableName: string) {
    return this.states.get(tableName)?.conflictedItems || new Map()
  }

  /**
   * Update sync status
   */
  private updateStatus(tableName: string, status: SyncStatus) {
    const state = this.states.get(tableName)
    if (state) {
      state.status = status
      this.configs.get(tableName)?.onStatusChange?.(status)
    }
  }

  /**
   * Cleanup
   */
  cleanup(tableName?: string) {
    if (tableName) {
      // Clean up specific table
      this.channels.get(tableName)?.unsubscribe()
      this.channels.delete(tableName)

      const interval = this.intervals.get(tableName)
      if (interval) clearInterval(interval)
      this.intervals.delete(tableName)

      this.configs.delete(tableName)
      this.states.delete(tableName)
    } else {
      // Clean up all
      this.channels.forEach((channel) => channel.unsubscribe())
      this.channels.clear()

      this.intervals.forEach((interval) => clearInterval(interval))
      this.intervals.clear()

      this.configs.clear()
      this.states.clear()
    }
  }
}

// Singleton instance
let instance: AdminSyncManager | null = null

export function getAdminSyncManager(): AdminSyncManager {
  if (!instance) {
    instance = new AdminSyncManager()
  }
  return instance
}

export default AdminSyncManager
