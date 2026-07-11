'use client'

import { useCallback } from 'react'
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  Loader,
} from 'lucide-react'
import type { SyncStatus } from '@/lib/admin-sync-manager'

export interface AdminSyncStatusProps {
  status: SyncStatus
  lastSyncTime: Date | null
  pendingCount: number
  conflictCount: number
  onRefresh: () => Promise<void>
  isRefreshing?: boolean
  compact?: boolean
}

/**
 * Component to display admin sync status
 * Shows real-time indicator, last sync time, pending changes, and conflicts
 */
export function AdminSyncStatus({
  status,
  lastSyncTime,
  pendingCount,
  conflictCount,
  onRefresh,
  isRefreshing = false,
  compact = false,
}: AdminSyncStatusProps) {
  const handleRefresh = useCallback(async () => {
    try {
      await onRefresh()
    } catch (error) {
      console.error('[v0] Manual refresh failed:', error)
    }
  }, [onRefresh])

  const getStatusColor = (s: SyncStatus) => {
    switch (s) {
      case 'synced':
        return 'text-green-400'
      case 'syncing':
        return 'text-blue-400'
      case 'error':
        return 'text-red-400'
      case 'offline':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (s: SyncStatus) => {
    switch (s) {
      case 'synced':
        return <CheckCircle className="w-4 h-4" />
      case 'syncing':
        return <Loader className="w-4 h-4 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      case 'offline':
        return <WifiOff className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (s: SyncStatus) => {
    switch (s) {
      case 'synced':
        return 'Synced'
      case 'syncing':
        return 'Syncing...'
      case 'error':
        return 'Sync Error'
      case 'offline':
        return 'Offline'
      default:
        return 'Idle'
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${getStatusColor(status)}`}>
          {getStatusIcon(status)}
        </div>
        <span className="text-sm text-foreground/70">{getStatusLabel(status)}</span>
        {pendingCount > 0 && (
          <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
            {pendingCount} pending
          </span>
        )}
        {conflictCount > 0 && (
          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
            {conflictCount} conflicts
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 space-y-3">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${getStatusColor(status)} flex-shrink-0`}>
            {getStatusIcon(status)}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {getStatusLabel(status)}
            </p>
            {lastSyncTime && (
              <p className="text-xs text-foreground/60">
                Last synced: {lastSyncTime.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || status === 'syncing'}
          className="p-2 hover:bg-secondary/40 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Manually refresh data"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing || status === 'syncing' ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Pending Changes */}
      {pendingCount > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-400">
              {pendingCount} pending change{pendingCount !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-yellow-400/70">
              Waiting to sync with server
            </p>
          </div>
        </div>
      )}

      {/* Conflicts */}
      {conflictCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">
              {conflictCount} conflict{conflictCount !== 1 ? 's' : ''} detected
            </p>
            <p className="text-xs text-red-400/70">
              Local changes conflict with server changes
            </p>
          </div>
        </div>
      )}

      {/* Sync Details */}
      <div className="text-xs text-foreground/60 space-y-1">
        <p>
          Status: <span className={`font-medium ${getStatusColor(status)}`}>{getStatusLabel(status)}</span>
        </p>
        {lastSyncTime && (
          <p>
            Last sync: {lastSyncTime.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Compact inline sync indicator
 */
export function SyncIndicator({
  status,
  compact = true,
}: {
  status: SyncStatus
  compact?: boolean
}) {
  const getStatusColor = (s: SyncStatus) => {
    switch (s) {
      case 'synced':
        return 'bg-green-500'
      case 'syncing':
        return 'bg-blue-500'
      case 'error':
        return 'bg-red-500'
      case 'offline':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div
      className={`${getStatusColor(status)} rounded-full ${compact ? 'w-2 h-2' : 'w-3 h-3'} ${
        status === 'syncing' ? 'animate-pulse' : ''
      }`}
      title={status}
    />
  )
}
