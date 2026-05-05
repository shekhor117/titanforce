# Titan Force - Complete Supabase Integration Guide

## Overview
This guide shows you how to connect Titan Force to Supabase for data persistence. The project is a football team management system with players, matches, news, and fan features.

---

## Step 1: SQL Schema Setup

### Copy the SQL Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire content from `DATABASE_SCHEMA.sql`
5. Click **Run**

The schema creates 10 tables with Row Level Security (RLS) for secure user data isolation:
- `player_profiles` - Player information
- `matches` - Match scheduling and results
- `player_stats` - Seasonal statistics
- `team_formations` - Match formations
- `match_events` - Live match events
- `news_posts` - Team news
- `news_comments` - Comments on news
- `fan_accounts` - Fan profiles
- `fan_favorites` - Users' favorite players
- `saved_matches` - Saved matches

---

## Step 2: Data Structure

### Player Profiles
```typescript
interface Player {
  id: string
  user_id: string           // Links to auth.users
  jersey: number            // Unique jersey number
  position: string          // GK, CB, RB, LB, CM, CAM, CDM, RW, LW, ST, CF
  age: number
  address?: string
  foot: string              // Left, Right, or Both
  goals?: number
  assists?: number
  clean_sheets?: number
  created_at: string
  updated_at: string
}
```

### Matches
```typescript
interface Match {
  id: string
  opponent: string
  match_date: string        // ISO format date
  location: string
  status: string            // "upcoming", "completed", "cancelled"
  titan_force_goals?: number
  opponent_goals?: number
  created_by: string        // User who created the match
  created_at: string
  updated_at: string
}
```

---

## Step 3: Using CRUD Functions

All CRUD operations are available in `lib/supabase-crud.ts`. Import and use them in your components:

### Load Players (Example)
```typescript
import { getPlayers } from '@/lib/supabase-crud'

export default function AdminPlayers() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await getPlayers()
        if (error) throw error
        setPlayers(data || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // ... rest of component
}
```

### Create Player
```typescript
import { createPlayer } from '@/lib/supabase-crud'
import { useAuth } from '@/lib/auth-hook' // Your auth hook

export function AddPlayerForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { data, error } = await createPlayer({
      user_id: user.id,
      jersey: formData.jersey,
      position: formData.position,
      age: formData.age,
      address: formData.address,
      foot: formData.foot,
    })

    if (error) {
      alert('Error creating player: ' + error.message)
      return
    }

    alert('Player created successfully!')
    // Refresh list or redirect
  }

  // ... form JSX
}
```

### Update Player
```typescript
import { updatePlayer } from '@/lib/supabase-crud'

const handleUpdatePlayer = async (playerId, updates) => {
  const { data, error } = await updatePlayer(playerId, updates)
  
  if (error) {
    console.error('Error updating player:', error)
    return
  }

  console.log('Player updated:', data)
}

// Usage
handleUpdatePlayer('player-uuid', { goals: 20, assists: 5 })
```

### Delete Player
```typescript
import { deletePlayer } from '@/lib/supabase-crud'

const handleDeletePlayer = async (playerId) => {
  if (!confirm('Are you sure you want to delete this player?')) return

  const { error } = await deletePlayer(playerId)
  
  if (error) {
    console.error('Error deleting player:', error)
    return
  }

  alert('Player deleted successfully!')
  // Refresh list
}
```

---

## Step 4: Row Level Security (RLS)

### How RLS Works
Every table has policies that restrict data access:

**Player Profiles:**
- ✅ `SELECT`: Everyone can view all players (public data)
- ✅ `INSERT`: Only the authenticated user can create their own profile
- ✅ `UPDATE`: Users can only update their own profile
- ✅ `DELETE`: Users can only delete their own profile

**Example Policy:**
```sql
CREATE POLICY "players_update_own" ON player_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

This means:
- If you're logged in as User A
- You can only update rows where `user_id = auth.uid()` (your ID)
- Trying to update another user's data will fail

### Admin Operations
For admin-only operations (like modifying any player), you must:
1. Check the user's role in your application
2. Use a service role key (server-side only) if needed

---

## Step 5: Common Patterns

### Pattern 1: Fetch and Display Data
```typescript
'use client'
import { useEffect, useState } from 'react'
import { getPlayers } from '@/lib/supabase-crud'

export function Squad() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error: fetchError } = await getPlayers()
        if (fetchError) throw fetchError
        setPlayers(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {players.map(player => (
        <div key={player.id}>{player.jersey} - {player.position}</div>
      ))}
    </div>
  )
}
```

### Pattern 2: Create with Validation
```typescript
const handleCreatePlayer = async (formData) => {
  // Validation
  if (!formData.jersey || !formData.position) {
    alert('Jersey and position are required')
    return
  }

  // Create
  const { data, error } = await createPlayer(formData)
  
  if (error) {
    // Handle specific errors
    if (error.message.includes('unique')) {
      alert(`Jersey number ${formData.jersey} already exists`)
    } else {
      alert('Error creating player: ' + error.message)
    }
    return
  }

  alert('Player created!')
  // Refresh the list
  setPlayers([...players, data[0]])
}
```

### Pattern 3: Real-time Updates (Optional)
```typescript
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function RealtimePlayers() {
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to changes
    const subscription = supabase
      .channel('players')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_profiles' },
        (payload) => {
          console.log('Player changed:', payload)
          // Update your state here
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  // ... component
}
```

---

## Step 6: Environment Variables

Your environment variables are already set up:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your public API key

These are automatically used by the `createClient()` function.

---

## Step 7: Components to Update

The following components need to be updated to use real Supabase data:

### ✅ Already Updated:
- `components/squad.tsx` - Fetches players from Supabase

### ⏳ Still Need Update:
- `app/admin/players/page.tsx` - Uses hardcoded players
- `app/admin/matches/page.tsx` - May need enhancement
- `app/admin/news/page.tsx` - May need enhancement

---

## Step 8: Testing Your Connection

### Test in Browser Console:
```javascript
// Import the functions
import { getPlayers } from 'lib/supabase-crud.ts'

// Call a function
const { data, error } = await getPlayers()

// Check results
console.log(data)  // Should show players array
console.log(error) // Should be null if successful
```

### Test with Postman (if using API):
```
GET /api/players
Authorization: Bearer <your_auth_token>
```

---

## Troubleshooting

### Error: "RLS policy violation"
**Cause:** Trying to access data that doesn't belong to you
**Solution:** Check that `auth.uid() = user_id` in your RLS policies

### Error: "Column does not exist"
**Cause:** Schema not created properly
**Solution:** Re-run the SQL schema from `DATABASE_SCHEMA.sql`

### Error: "Permission denied"
**Cause:** User not authenticated
**Solution:** Ensure user is logged in before making queries

### Error: "Relation does not exist"
**Cause:** Table name misspelled or schema not created
**Solution:** Check table names match exactly in SQL and code

---

## Next Steps

1. **Run the SQL schema** in Supabase SQL Editor
2. **Update admin pages** to use CRUD functions
3. **Add form validation** to prevent bad data
4. **Implement real-time updates** if needed
5. **Add loading states** and error handling
6. **Test with sample data** before going live

---

## Quick Reference: All CRUD Functions

### Players
- `getPlayers()` - Get all players
- `getPlayerById(id)` - Get single player
- `createPlayer(data)` - Create new player
- `updatePlayer(id, updates)` - Update player
- `deletePlayer(id)` - Delete player

### Matches
- `getMatches()` - Get all matches
- `getMatchById(id)` - Get single match
- `createMatch(data)` - Create match
- `updateMatch(id, updates)` - Update match
- `deleteMatch(id)` - Delete match

### News
- `getPublishedNews()` - Get published news
- `getAllNews()` - Get all news
- `createNewsPost(data)` - Create post
- `updateNewsPost(id, updates)` - Update post
- `deleteNewsPost(id)` - Delete post
- `getNewsComments(postId)` - Get comments
- `addNewsComment(postId, content, userId)` - Add comment

### Formations & Events
- `getFormationByMatchId(id)` - Get formation
- `createFormation(data)` - Create formation
- `getMatchEvents(matchId)` - Get events
- `addMatchEvent(data)` - Add event

### Fan Features
- `getFanFavorites(userId)` - Get favorites
- `addFanFavorite(userId, playerId)` - Add to favorites
- `removeFanFavorite(userId, playerId)` - Remove from favorites
- `getSavedMatches(userId)` - Get saved matches
- `saveMatch(userId, matchId)` - Save match
- `unsaveMatch(userId, matchId)` - Unsave match

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Check the `DATABASE_SCHEMA.sql` for table structure
- Use the `lib/supabase-crud.ts` functions directly
- Enable Supabase logging to debug queries
