# Titan Force - Supabase Integration Summary

## ✅ What's Been Set Up

### 1. **Database Schema** (`DATABASE_SCHEMA.sql`)
- 10 production-ready tables with Row Level Security (RLS)
- All tables have secure authentication and authorization
- Indexes for performance optimization
- Cascading deletes to prevent orphaned data

**Tables Created:**
- `player_profiles` - Player data with stats
- `matches` - Match scheduling and results
- `player_stats` - Seasonal statistics
- `team_formations` - Match formations
- `match_events` - Live match events
- `news_posts` - Team announcements
- `news_comments` - Comment system
- `fan_accounts` - Fan profiles
- `fan_favorites` - User favorites
- `saved_matches` - User saved matches

### 2. **CRUD Functions** (`lib/supabase-crud.ts`)
Complete set of ready-to-use functions for all database operations:
- Players: Get, Create, Update, Delete
- Matches: Get, Create, Update, Delete
- Stats: Get, Update
- News: Get, Create, Update, Delete, Comments
- Formations & Events: Get, Create
- Fan Features: Favorites, Saved Matches

### 3. **Updated Components**
- ✅ `components/squad.tsx` - Already fetches real players from Supabase
- ✅ `app/admin/players/page.tsx` - Now uses real Supabase CRUD operations

### 4. **Documentation**
- `SUPABASE_INTEGRATION_GUIDE.md` - Complete step-by-step guide
- `SUPABASE_COPY_PASTE_PATTERNS.ts` - Ready-to-use code snippets
- This file - Quick reference

---

## 🚀 Getting Started (3 Steps)

### Step 1: Run the SQL Schema
```
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy & paste contents of DATABASE_SCHEMA.sql
4. Click "Run"
```

### Step 2: Check Environment Variables
Your Supabase credentials are already configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

You can see them in the `.env.project` file via the Settings menu.

### Step 3: Start Using the Functions
```typescript
import { getPlayers, createPlayer } from '@/lib/supabase-crud'

// Fetch players
const { data, error } = await getPlayers()

// Create player
const { data, error } = await createPlayer({
  user_id: userId,
  jersey: 7,
  position: 'ST',
  age: 25,
  foot: 'Right',
})
```

---

## 📁 Files Created

### New Files
1. **`lib/supabase-crud.ts`** - All CRUD functions
2. **`DATABASE_SCHEMA.sql`** - Updated with complete schema
3. **`SUPABASE_INTEGRATION_GUIDE.md`** - Full documentation
4. **`SUPABASE_COPY_PASTE_PATTERNS.ts`** - Code snippets

### Updated Files
1. **`app/admin/players/page.tsx`** - Now uses Supabase instead of hardcoded data

---

## 🔐 Security (Row Level Security)

All tables have RLS policies that ensure:
- ✅ Users can only see and modify their own data
- ✅ Public data (players, matches, news) can be viewed by everyone
- ✅ Only authenticated users can create, update, or delete their data
- ✅ Admin operations must be enforced in application code

Example:
```sql
-- Players can only update their own profile
CREATE POLICY "players_update_own" ON player_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can view all players
CREATE POLICY "players_select_all" ON player_profiles
  FOR SELECT USING (TRUE);
```

---

## 📋 Common Use Cases

### Get All Players
```typescript
const { data: players } = await getPlayers()
```

### Create New Player
```typescript
const { data: newPlayer } = await createPlayer({
  user_id: userId,
  jersey: 10,
  position: 'ST',
  age: 24,
  foot: 'Right',
})
```

### Update Player Stats
```typescript
const { data: updated } = await updatePlayer(playerId, {
  goals: 15,
  assists: 5,
})
```

### Delete Player
```typescript
const { error } = await deletePlayer(playerId)
```

### Get All Matches
```typescript
const { data: matches } = await getMatches()
```

### Create Match
```typescript
const { data: newMatch } = await createMatch({
  opponent: 'City FC',
  match_date: '2024-12-15',
  location: 'Home Stadium',
  created_by: userId,
})
```

### Add News Post
```typescript
const { data: post } = await createNewsPost({
  admin_id: userId,
  title: 'Big Win!',
  content: 'Team defeated opponents 3-0',
  published: true,
})
```

---

## ⚙️ Customization

### Add New Fields to a Table
1. Go to Supabase SQL Editor
2. Run an ALTER TABLE command:
```sql
ALTER TABLE player_profiles ADD COLUMN height_cm INT;
ALTER TABLE player_profiles ADD COLUMN weight_kg INT;
```

3. Update the interface in your code:
```typescript
interface Player {
  id: string
  // ... existing fields
  height_cm?: number
  weight_kg?: number
}
```

### Create New Table
1. Add it to `DATABASE_SCHEMA.sql`
2. Run the CREATE TABLE statement in SQL Editor
3. Create CRUD functions in `lib/supabase-crud.ts`

### Modify RLS Policies
Policies can be changed in:
- Supabase Dashboard → Authentication → Policies
- Or by running new CREATE POLICY statements

---

## 🐛 Debugging

### Issue: "RLS policy violation"
**Cause:** Trying to access data that doesn't belong to you
**Solution:** Check your auth.uid() matches the user_id

### Issue: "Column does not exist"
**Cause:** Schema not created properly
**Solution:** Re-run DATABASE_SCHEMA.sql

### Issue: "Permission denied"
**Cause:** User not authenticated
**Solution:** Check user is logged in before making queries

### Issue: "Relation does not exist"
**Cause:** Table name typo or schema not created
**Solution:** Verify table name matches exactly

---

## 📚 Next Steps

### For Public Pages (Home, Squad, News)
✅ These already fetch real data from Supabase

### For Admin Pages
- [ ] `/admin/players` - ✅ Updated with CRUD
- [ ] `/admin/matches` - Update to use createMatch, updateMatch
- [ ] `/admin/news` - Update to use createNewsPost, updateNewsPost
- [ ] `/admin/formations` - Update to use createFormation
- [ ] `/admin/media` - Add file upload support

### For User Features
- [ ] Add fan favorites functionality
- [ ] Add saved matches
- [ ] Add commenting on news
- [ ] Add real-time live updates for matches

### Testing
- [ ] Add test data in Supabase
- [ ] Test CRUD operations manually
- [ ] Test RLS policies
- [ ] Test error handling

---

## 📖 Quick Reference

### Import CRUD Functions
```typescript
import {
  getPlayers, createPlayer, updatePlayer, deletePlayer,
  getMatches, createMatch, updateMatch, deleteMatch,
  getPublishedNews, createNewsPost, updateNewsPost, deleteNewsPost,
  getNewsComments, addNewsComment,
  getFormationByMatchId, createFormation,
  getMatchEvents, addMatchEvent,
  getFanFavorites, addFanFavorite, removeFanFavorite,
  getSavedMatches, saveMatch, unsaveMatch,
} from '@/lib/supabase-crud'
```

### Auth Hook
```typescript
import { useAuth } from '@/lib/auth-hook'

const { user, isLoading, logout } = useAuth()
```

### Supabase Client
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

---

## 🎯 Key Points

1. **RLS Protects Data** - Each user can only see/modify their own data
2. **Copy-Paste Ready** - All functions are in `SUPABASE_COPY_PASTE_PATTERNS.ts`
3. **No Manual SQL Needed** - Use the CRUD functions instead
4. **Error Handling** - Always check `error` in responses
5. **Real-Time Optional** - Subscribe to changes for live updates
6. **Scalable** - Schema handles growth and complex relationships

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Check Files:**
  - `DATABASE_SCHEMA.sql` - Schema reference
  - `SUPABASE_CRUD.ts` - Function implementations
  - `SUPABASE_COPY_PASTE_PATTERNS.ts` - Code examples
  - `SUPABASE_INTEGRATION_GUIDE.md` - Full guide

---

## Done! 🎉

Your Titan Force app is now ready to connect to Supabase. All the code, SQL, and documentation is in place. Start with Step 1 (running the SQL schema) and you're good to go!
