# 🚀 Titan Force - Supabase Integration Checklist

## Phase 1: Database Setup ✅

- [ ] **Open Supabase Dashboard**
  - URL: https://app.supabase.com
  - Select your project

- [ ] **Create Database Schema**
  - Go to SQL Editor
  - Click "New Query"
  - Copy entire `DATABASE_SCHEMA.sql` file
  - Paste into SQL Editor
  - Click "Run"
  - ✅ Schema created with 10 tables and RLS policies

- [ ] **Verify Tables Created**
  - Go to Tables in Supabase
  - Look for these tables:
    - ✅ player_profiles
    - ✅ matches
    - ✅ player_stats
    - ✅ team_formations
    - ✅ match_events
    - ✅ news_posts
    - ✅ news_comments
    - ✅ fan_accounts
    - ✅ fan_favorites
    - ✅ saved_matches

- [ ] **Check RLS Policies**
  - Click each table → Policies tab
  - Verify policies are created (no red X marks)
  - All tables should show "RLS Enabled"

---

## Phase 2: Environment Variables ✅

- [ ] **Verify Credentials**
  - Go to Settings → API Keys
  - Copy `Service Role Key` (for server-side operations)
  - Note `Anon Key` (for client-side operations)

- [ ] **Check Environment Setup**
  - Your `.env.project` should have:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_ROLE_KEY
  - Click Settings (top right) → Vars to see them

- [ ] **Test Connection**
  - Open browser console (F12)
  - Try: `const supabase = await import('@/lib/supabase/client').then(m => m.createClient()); console.log(supabase)`
  - Should return a Supabase client object

---

## Phase 3: Code Files ✅

- [ ] **Check Files Created**
  - ✅ `lib/supabase-crud.ts` - All CRUD functions
  - ✅ `DATABASE_SCHEMA.sql` - Complete schema
  - ✅ `SUPABASE_INTEGRATION_GUIDE.md` - Full documentation
  - ✅ `SUPABASE_COPY_PASTE_PATTERNS.ts` - Code snippets
  - ✅ `SUPABASE_SETUP_SUMMARY.md` - This checklist

- [ ] **Components Updated**
  - ✅ `app/admin/players/page.tsx` - Now uses Supabase CRUD
  - ✅ `components/squad.tsx` - Already fetches real players

---

## Phase 4: Test CRUD Operations

### Players
- [ ] **Test Get Players**
  ```typescript
  import { getPlayers } from '@/lib/supabase-crud'
  const { data, error } = await getPlayers()
  console.log(data, error)
  ```

- [ ] **Test Create Player**
  - Go to Admin → Players page
  - Click "Add Player"
  - Fill in the form
  - Click "Save"
  - ✅ Player appears in table

- [ ] **Test Update Player**
  - Click Edit icon on a player
  - Change a value
  - Click "Update"
  - ✅ Player data refreshed

- [ ] **Test Delete Player**
  - Click Delete icon on a player
  - Confirm deletion
  - ✅ Player removed from table

### Matches
- [ ] **Test Get Matches**
  - Check home page → Fixtures & Results
  - Should load real matches from database

- [ ] **Test Create Match**
  - Go to Admin → Matches
  - Create a new match
  - ✅ Appears in fixtures

### News
- [ ] **Test Get News**
  - Check News page
  - Should load published news posts

- [ ] **Test Create News**
  - Go to Admin → News
  - Create new post
  - ✅ Appears on news page when published

---

## Phase 5: Security Tests

- [ ] **Test RLS Policies**
  - Create player as User A
  - Try to update as User B
  - ✅ Should fail with "RLS policy violation"

- [ ] **Test Authentication**
  - Try queries without authentication
  - ✅ Should fail with "Permission denied"

- [ ] **Test Data Isolation**
  - Player can only see/edit their own profile
  - Fans can see all public player data
  - ✅ Verify in Supabase logs

---

## Phase 6: Admin Pages (Optional)

These can be updated similarly to admin/players:

- [ ] **Admin Matches Page**
  - Update `app/admin/matches/page.tsx` to use:
    - `getMatches()`, `createMatch()`, `updateMatch()`, `deleteMatch()`

- [ ] **Admin News Page**
  - Update `app/admin/news/page.tsx` to use:
    - `getPublishedNews()`, `createNewsPost()`, `updateNewsPost()`, `deleteNewsPost()`

- [ ] **Admin Formations Page**
  - Update `app/admin/formations/page.tsx` to use:
    - `getFormationByMatchId()`, `createFormation()`, `updateFormation()`

- [ ] **Admin Media Page**
  - Add integration with Vercel Blob or Supabase Storage
  - Store image URLs in database

---

## Phase 7: Advanced Features (Optional)

### Real-Time Updates
- [ ] **Live Match Updates**
  - Use `supabase.channel()` to subscribe to match changes
  - Example in `SUPABASE_COPY_PASTE_PATTERNS.ts`

### Fan Features
- [ ] **Favorite Players**
  - Use `addFanFavorite()`, `getFanFavorites()`

- [ ] **Saved Matches**
  - Use `saveMatch()`, `getSavedMatches()`

- [ ] **News Comments**
  - Use `addNewsComment()`, `getNewsComments()`

---

## Phase 8: Performance Optimization (Optional)

- [ ] **Enable Caching**
  - Use SWR or React Query for client-side caching
  - Reduce unnecessary API calls

- [ ] **Add Pagination**
  - For large player/match lists
  - Update CRUD functions to accept limit/offset

- [ ] **Use Indexes**
  - Already created in `DATABASE_SCHEMA.sql`
  - Verify with: `SELECT * FROM pg_stat_user_indexes`

---

## Troubleshooting Checklist

If something isn't working:

- [ ] **Check Schema**
  - Go to Supabase → Tables
  - Verify all 10 tables exist
  - If not: Re-run `DATABASE_SCHEMA.sql`

- [ ] **Check RLS**
  - Go to each table → Policies
  - Verify policies are created
  - Check policy logic is correct

- [ ] **Check Auth**
  - User must be logged in
  - `useAuth()` should return user object
  - Check Supabase → Authentication → Users

- [ ] **Check Environment Variables**
  - Click Settings → Vars
  - Verify all env vars are set
  - Restart dev server if changed

- [ ] **Check Browser Console**
  - F12 → Console tab
  - Look for error messages
  - Check network tab for failed requests

- [ ] **Check Supabase Logs**
  - Go to Supabase → Logs
  - Look for errors
  - Verify queries are being sent

---

## Deployment Checklist

Before deploying to production:

- [ ] **Enable Row Level Security**
  - Verify all tables have RLS enabled
  - Check policies are correct

- [ ] **Set Backups**
  - Go to Supabase → Backups
  - Enable automatic daily backups

- [ ] **Monitor Database**
  - Set up alerts for usage
  - Monitor query performance

- [ ] **Test Production**
  - Deploy to Vercel staging first
  - Run full CRUD test suite
  - Test with real users

- [ ] **Document**
  - Keep `DATABASE_SCHEMA.sql` version controlled
  - Document any custom policies
  - Maintain `SUPABASE_INTEGRATION_GUIDE.md`

---

## Quick Command Reference

### Run SQL Schema
```sql
-- Copy entire DATABASE_SCHEMA.sql
-- Paste into Supabase SQL Editor
-- Click Run
```

### Restart Dev Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Check Env Variables
```bash
# In Settings → Vars
# All required vars should be green ✅
```

### Force Refresh
```typescript
// Clear browser cache
// Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

---

## Success Indicators ✅

You know everything is working when:

- ✅ Admin Players page shows real players from database
- ✅ Creating a player adds it to the database
- ✅ Editing a player updates all fields
- ✅ Deleting a player removes it
- ✅ Home page shows real matches
- ✅ News page shows published posts
- ✅ Error messages are helpful
- ✅ No console errors or warnings
- ✅ Performance is fast (< 1 second queries)
- ✅ Users can only see/modify their own data

---

## 🎉 You're Ready!

Once all items above are checked, your Titan Force app is fully connected to Supabase with:

- ✅ Secure database with RLS
- ✅ Complete CRUD operations
- ✅ Working admin pages
- ✅ Real data persistence
- ✅ User authentication & isolation
- ✅ Production-ready architecture

---

## Need Help?

1. **Check the Docs**
   - `SUPABASE_INTEGRATION_GUIDE.md` - Step-by-step guide
   - `SUPABASE_COPY_PASTE_PATTERNS.ts` - Code examples

2. **Check the Code**
   - `lib/supabase-crud.ts` - All functions
   - `DATABASE_SCHEMA.sql` - Table structure

3. **Check Supabase**
   - Dashboard: https://app.supabase.com
   - Docs: https://supabase.com/docs
   - Status: https://status.supabase.com

4. **Debug with Logs**
   - Browser Console (F12)
   - Supabase Logs dashboard
   - Network tab for requests

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
