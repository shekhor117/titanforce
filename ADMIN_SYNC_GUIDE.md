# Admin Panel Supabase Sync - Complete Guide

## Overview

The admin panel now has complete real-time synchronization with Supabase featuring:

- **Real-time updates**: Live data sync when changes occur
- **Two-way sync**: Admin panel changes sync to Supabase AND Supabase changes sync back
- **Manual refresh**: Click to manually refresh data at any time
- **Background sync**: Automatic polling for updates (configurable interval)
- **Offline support**: Changes queue locally when offline, sync when connection restored
- **Conflict resolution**: Handles conflicts between local and remote changes
- **Sync status indicators**: Visual indicators showing current sync state

## Architecture

### Core Components

1. **AdminSyncManager** (`lib/admin-sync-manager.ts`)
   - Centralized sync management for all tables
   - Handles real-time subscriptions, polling, and conflict resolution
   - Singleton pattern ensures single instance across the app

2. **useAdminSync Hook** (`lib/use-admin-sync.ts`)
   - React hook for component-level sync integration
   - Provides data, status, and action methods
   - Manages local state and event listeners

3. **Sync UI Components** (`components/admin-sync-status.tsx`)
   - `AdminSyncStatus`: Full sync status display with details
   - `SyncIndicator`: Compact inline sync indicator

## Usage

### Basic Setup in Admin Pages

```typescript
'use client'

import { useAdminSync } from '@/lib/use-admin-sync'
import { AdminSyncStatus, SyncIndicator } from '@/components/admin-sync-status'

export default function AdminPlayersPage() {
  // Initialize sync for 'players' table
  const {
    data: players,           // Array of current data
    status,                  // 'synced' | 'syncing' | 'error' | 'offline' | 'idle'
    lastSyncTime,           // Date of last successful sync
    pendingChanges,         // Map of changes waiting to sync
    conflictedItems,        // Map of conflicted items
    
    // Action methods
    refresh,                // Manual refresh
    pushChange,             // Push local change to Supabase
    resolveConflict,        // Resolve detected conflict
    
    // Utility methods
    hasPendingChanges,      // Check if there are pending changes
    hasConflicts,           // Check if there are conflicts
    getPendingCount,        // Get count of pending changes
    getConflictCount,       // Get count of conflicts
  } = useAdminSync({
    tableName: 'players',
    refreshInterval: 30000,  // Refresh every 30 seconds (0 = disabled)
    onError: (error) => console.error(error),
    enableRealtime: true,    // Enable real-time subscriptions (default)
  })

  return (
    <div>
      {/* Display sync status */}
      <AdminSyncStatus
        status={status}
        lastSyncTime={lastSyncTime}
        pendingCount={getPendingCount()}
        conflictCount={getConflictCount()}
        onRefresh={refresh}
      />

      {/* Compact indicator */}
      <SyncIndicator status={status} />

      {/* Use data */}
      {players.map(player => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  )
}
```

### Handling Conflicts

When local and remote changes conflict:

```typescript
const { conflictedItems, resolveConflict } = useAdminSync({
  tableName: 'players',
})

// Check for conflicts
if (hasConflicts()) {
  const conflicts = Array.from(conflictedItems.values())
  conflicts.forEach(conflict => {
    console.log('Conflict:', conflict)
    // Resolve by accepting remote version
    resolveConflict(conflict.id, false) // false = accept remote
    // Or keep local version
    resolveConflict(conflict.id, true)  // true = keep local
  })
}
```

### Pushing Changes

```typescript
const { pushChange, pendingChanges } = useAdminSync({
  tableName: 'players',
})

// Update player
await pushChange(playerId, {
  name: 'New Name',
  position: 'Forward',
})

// Check pending
if (hasPendingChanges()) {
  console.log(`${getPendingCount()} changes waiting to sync`)
}
```

## Sync Status States

| Status | Meaning | UI Color |
|--------|---------|----------|
| `synced` | Successfully synced, up-to-date | Green |
| `syncing` | Currently syncing with server | Blue |
| `error` | Sync failed, check connection | Red |
| `offline` | No internet connection | Yellow |
| `idle` | Not initialized yet | Gray |

## Events

The sync system emits custom events that can be listened to:

```typescript
// Listen for changes from Supabase
window.addEventListener('admin-sync-change', (event) => {
  const { tableName, payload } = event.detail
  console.log(`Table ${tableName} changed:`, payload)
})

// Listen for refresh (pull from Supabase)
window.addEventListener('admin-sync-refresh', (event) => {
  const { tableName, data } = event.detail
  console.log(`Table ${tableName} refreshed:`, data)
})

// Listen for push (sent to Supabase)
window.addEventListener('admin-sync-push', (event) => {
  const { tableName, id, data } = event.detail
  console.log(`Pushed to ${tableName}:${id}`, data)
})
```

## Configuration Options

### Default Sync Configuration

```typescript
useAdminSync({
  tableName: 'players',              // Required: Supabase table name
  refreshInterval: 30000,            // Optional: Poll interval (ms), 0 = disabled
  onError: (error) => {},            // Optional: Error callback
  enableRealtime: true,              // Optional: Enable realtime subscriptions
})
```

### Recommended Settings by Use Case

**High-traffic admin panel:**
```typescript
{
  refreshInterval: 10000,   // 10 seconds
  enableRealtime: true,     // Catch all changes immediately
}
```

**Low-traffic admin panel:**
```typescript
{
  refreshInterval: 60000,   // 60 seconds
  enableRealtime: true,
}
```

**Manual-only refresh:**
```typescript
{
  refreshInterval: 0,       // Disabled
  enableRealtime: true,     // Still listen to real-time
}
```

## Offline Behavior

When offline:
1. Changes are queued locally
2. UI shows "Offline" status
3. When connection restored:
   - Changes are automatically synced
   - UI updates to show sync status
   - Conflicts are detected and can be resolved

## Performance Considerations

1. **Real-time Subscriptions**: Minimal overhead, recommended for all tables
2. **Background Polling**: Set appropriate intervals (30-60 seconds typical)
3. **Conflict Detection**: Automatic, no performance impact
4. **Data Size**: Hook manages large datasets efficiently

## Troubleshooting

### Sync not working
- Check network connection
- Verify Supabase credentials
- Check browser console for errors
- Ensure realtime is enabled in Supabase dashboard

### Conflicts appearing
- Review local and remote changes
- Use resolve buttons to choose preferred version
- Check timestamp of changes to understand which is newer

### High latency
- Increase `refreshInterval` to reduce polling frequency
- Check network quality
- Verify Supabase database performance

## Best Practices

1. **Always use real-time subscriptions** for admin tables
2. **Set appropriate refresh intervals** based on your needs
3. **Handle conflicts gracefully** with user-friendly UI
4. **Display sync status** so users know data state
5. **Test offline scenarios** to ensure queueing works
6. **Monitor error events** and provide user feedback
7. **Clean up hooks** properly when components unmount

## Examples

### Players Admin Page
See `/app/admin/players/page.tsx` for a complete implementation example.

### News Admin Page
See `/app/admin/news/page.tsx` for another implementation example.

## API Reference

### AdminSyncManager

```typescript
// Initialize
manager.initializeSync(config)

// Manual operations
await manager.refreshTable(tableName)
await manager.pushChanges(tableName, id, updates)
await manager.resolveConflict(tableName, id, useLocal)
await manager.syncAllTables()

// Status queries
manager.getStatus(tableName)
manager.getLastSyncTime(tableName)
manager.getPendingChanges(tableName)
manager.getConflictedItems(tableName)

// Cleanup
manager.cleanup(tableName)
```

### useAdminSync Hook

See hook return type in `lib/use-admin-sync.ts` for complete API.

## Future Enhancements

- [ ] Selective field sync
- [ ] Batch operations
- [ ] Sync history/audit log
- [ ] Automatic conflict resolution strategies
- [ ] Compression for large payloads
- [ ] Peer-to-peer admin sync
