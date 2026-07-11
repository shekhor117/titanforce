# Admin Sync Integration Guide

## Quick Start - Integrate Sync into Your Admin Pages

### Step 1: Import the Hook and Components

```typescript
import { useAdminSync } from '@/lib/use-admin-sync'
import { AdminSyncStatus, SyncIndicator } from '@/components/admin-sync-status'
```

### Step 2: Initialize Sync in Your Admin Page

```typescript
'use client'

import { useAdminSync } from '@/lib/use-admin-sync'
import { AdminSyncStatus } from '@/components/admin-sync-status'

export default function AdminYourTablePage() {
  const {
    data,
    status,
    lastSyncTime,
    refresh,
    getPendingCount,
    getConflictCount,
  } = useAdminSync({
    tableName: 'your_table_name', // Change this!
    refreshInterval: 30000,         // Adjust as needed
  })

  return (
    <div>
      <AdminSyncStatus
        status={status}
        lastSyncTime={lastSyncTime}
        pendingCount={getPendingCount()}
        conflictCount={getConflictCount()}
        onRefresh={refresh}
      />
      
      {/* Your page content using data */}
      {data.map(item => (
        <div key={item.id}>{/* Render item */}</div>
      ))}
    </div>
  )
}
```

## Integration Steps for Each Admin Page

### For Players Page (`/admin/players`)
Already integrated! See `/app/admin/players/page.tsx`

### For News Page (`/admin/news`)

```typescript
const { data: newsItems, status, refresh, ... } = useAdminSync({
  tableName: 'news_items',
  refreshInterval: 30000,
})
```

### For Media/Gallery (`/admin/media`)

```typescript
const { data: mediaItems, status, refresh, ... } = useAdminSync({
  tableName: 'media',
  refreshInterval: 30000,
})
```

### For Matches (`/admin/matches`)

```typescript
const { data: matches, status, refresh, ... } = useAdminSync({
  tableName: 'matches',
  refreshInterval: 30000,
})
```

### For Trophies (`/admin/trophies`)

```typescript
const { data: trophies, status, refresh, ... } = useAdminSync({
  tableName: 'trophies',
  refreshInterval: 30000,
})
```

### For Injuries (`/admin/injuries`)

```typescript
const { data: injuries, status, refresh, ... } = useAdminSync({
  tableName: 'injuries',
  refreshInterval: 30000,
})
```

## Migration from Old Data Fetching

### Before (without sync):
```typescript
useEffect(() => {
  const fetchData = async () => {
    const service = getDataService()
    const data = await service.getPlayers()
    setPlayers(data)
  }
  fetchData()
}, [])
```

### After (with sync):
```typescript
const { data: players, status } = useAdminSync({
  tableName: 'players',
  refreshInterval: 30000,
})
```

**Benefits:**
- Automatic real-time updates
- No need for manual refetch logic
- Built-in conflict handling
- Offline support
- Sync status visibility

## UI Integration Patterns

### Pattern 1: Full Status Display
Use when sync status is important to users:

```typescript
<AdminSyncStatus
  status={status}
  lastSyncTime={lastSyncTime}
  pendingCount={getPendingCount()}
  conflictCount={getConflictCount()}
  onRefresh={refresh}
  compact={false}
/>
```

### Pattern 2: Compact Status in Header
Use for header/toolbar:

```typescript
<div className="flex items-center gap-2">
  <SyncIndicator status={status} />
  <span className="text-sm">{getStatusLabel(status)}</span>
  <button onClick={refresh}>Refresh</button>
</div>
```

### Pattern 3: Inline Status Indicator
Use in lists/tables:

```typescript
{data.map(item => (
  <tr key={item.id}>
    <td>{item.name}</td>
    <td>
      {pendingChanges.has(item.id) && (
        <span className="text-yellow-400">Syncing...</span>
      )}
    </td>
  </tr>
))}
```

### Pattern 4: Toast/Alert for Conflicts
Use for notification:

```typescript
useEffect(() => {
  if (hasConflicts()) {
    showAlert(`${getConflictCount()} conflicts detected`)
  }
}, [hasConflicts, getConflictCount])
```

## Handling Updates/Edits

### With Sync:

```typescript
const { pushChange, refresh } = useAdminSync({
  tableName: 'players',
})

const handleUpdate = async (playerId: string, updates: any) => {
  await pushChange(playerId, updates)
  // Data automatically updates via real-time
}
```

### Form Integration:

```typescript
const handleSubmit = async (formData: any) => {
  try {
    await pushChange(itemId, formData)
    showSuccess('Changes saved and synced')
  } catch (error) {
    showError('Failed to sync: ' + error.message)
  }
}
```

## Error Handling

### Custom Error Handling:

```typescript
const { data, status } = useAdminSync({
  tableName: 'players',
  onError: (error) => {
    console.error('Sync error:', error)
    showNotification({
      type: 'error',
      message: 'Failed to sync data',
      action: 'Retry',
      onAction: refresh,
    })
  },
})
```

### Status-based Error UI:

```typescript
{status === 'error' && (
  <div className="bg-red-500/10 p-4 rounded">
    <p>Sync failed - please check your connection</p>
    <button onClick={refresh}>Retry</button>
  </div>
)}

{status === 'offline' && (
  <div className="bg-yellow-500/10 p-4 rounded">
    <p>You are offline - changes will sync when online</p>
  </div>
)}
```

## Testing Sync

### Test Real-time Updates:

1. Open admin page in browser
2. Make changes in Supabase directly
3. See changes appear in real-time in admin panel

### Test Background Polling:

1. Open admin page
2. Wait for refresh interval (default 30s)
3. Make changes in another tool
4. Observe update in admin panel

### Test Offline Support:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Offline"
4. Make changes in admin panel
5. Observe "Offline" status
6. Uncheck "Offline"
7. See changes sync automatically

### Test Conflict Resolution:

1. Open admin page in two windows
2. Edit same item in both windows
3. Save in both
4. Conflict should be detected
5. Use resolve buttons to choose

## Performance Tuning

### For High-Traffic Tables:
```typescript
{
  refreshInterval: 10000,  // 10 seconds
  enableRealtime: true,
}
```

### For Low-Traffic Tables:
```typescript
{
  refreshInterval: 60000,  // 60 seconds
  enableRealtime: true,
}
```

### Manual-Only:
```typescript
{
  refreshInterval: 0,      // No polling
  enableRealtime: true,    // Still get real-time
}
```

## Debugging

### Enable Debug Logs:

All sync operations log to console with `[v0]` prefix:
- Open DevTools Console (F12)
- Look for `[v0] Admin Sync` messages

### Common Issues:

**"Real-time not available"**
- Check Supabase realtime is enabled
- Check database permissions

**"Sync stuck on syncing"**
- Check network connection
- Check Supabase status
- Try manual refresh

**"Data not updating"**
- Check table name is correct
- Verify RLS policies allow user access
- Check browser console for errors

## Checklist for Implementation

- [ ] Import useAdminSync hook
- [ ] Replace old data fetching with useAdminSync
- [ ] Add AdminSyncStatus or SyncIndicator component
- [ ] Test real-time updates
- [ ] Test manual refresh
- [ ] Test offline scenario
- [ ] Add error handling
- [ ] Test conflict resolution
- [ ] Verify UI shows sync status
- [ ] Performance test with realistic data

## Next Steps

1. **Update all admin pages** to use the sync system
2. **Test each page** thoroughly
3. **Monitor performance** with real data
4. **Gather user feedback** on sync experience
5. **Adjust intervals** based on actual usage patterns

## Support

For issues or questions:
1. Check ADMIN_SYNC_GUIDE.md for detailed documentation
2. Review examples in updated admin pages
3. Check browser console for error messages
4. Verify Supabase configuration

---

**All admin pages are now ready for comprehensive real-time synchronization with Supabase!**
