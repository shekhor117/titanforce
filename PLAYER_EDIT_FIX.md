# Player Edit Page - Fix Applied

## Problem
The "Edit Player" page was showing "Failed to update player" error when trying to save changes.

## Root Cause Analysis
1. **Missing API Endpoint**: The edit page was calling `/api/admin/players/[num]` (using jersey number as ID)
2. **Wrong ID Type**: The `players` table uses UUID (`id`) as primary key, not jersey number (`num`)
3. **Database Schema Mismatch**: The endpoint needed to:
   - Accept jersey number as the route parameter
   - Look up the player's UUID by jersey number
   - Update using the UUID primary key

## Solution Applied

### 1. Fixed API Endpoint (`/api/admin/players/[num]/route.ts`)

**PUT Method:**
- Accept jersey number from route params
- Query `players` table to find UUID by jersey number
- Update player record using the UUID
- Return updated player data

**Key Changes:**
```typescript
// Find player by jersey number first
const { data: foundPlayers } = await supabase
  .from('players')
  .select('id, num')
  .eq('num', playerNum)

// Then update using the UUID
const { data } = await supabase
  .from('players')
  .update(updateData)
  .eq('id', playerId)
  .select()
```

**DELETE Method:**
- Added proper DELETE handler with same two-step approach
- Authentication check for admin-only access
- Proper error handling and logging

### 2. Field Mapping
The endpoint maps form fields to correct database column names:
- `full_name` → players.full_name
- `position` → players.position  
- `age` → players.age
- `goals`, `assists`, `appearances` → player stats
- `pace`, `shooting`, `passing`, etc. → player attributes

### 3. Error Handling
- Added debug logging to identify where updates fail
- Proper HTTP status codes (401, 404, 400, 500)
- Clear error messages for troubleshooting

## Testing

### Before Fix
```
PUT /api/admin/players/17
Response: "Failed to update player"
```

### After Fix
The endpoint will:
1. Look up player with jersey number 17
2. Find their UUID
3. Update their data in the database
4. Return success response

## Files Modified
- `/app/api/admin/players/[num]/route.ts` - Fixed PUT and DELETE methods

## Next Steps
If errors still occur:
1. Check server logs for detailed error messages
2. Verify the `players` table has records with the jersey number
3. Ensure authenticated user has admin access
4. Check RLS policies allow admin updates

The fix is now in place and the player edit page should work correctly!
