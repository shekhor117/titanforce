# Admin Panel to Website Data Flow Verification

## Architecture Overview

The TitanForce app uses a **Supabase-backed architecture** where admin updates sync seamlessly to the public website.

### Data Flow:

```
Admin Panel → API Route → Supabase Database → Website Components → Users
```

---

## Step 1: Admin Panel Data Update

**Location:** `/admin/matches`

- Admin users can edit match details through the Edit Match dialog
- Data includes: Teams, scores, dates, lineups, events, statistics
- Form validation happens client-side before submission

**Code:** `app/admin/matches/page.tsx`
```tsx
// Admin saves match data via API
const handleSaveMatch = async (match: MatchData) => {
  const method = match.id ? 'PUT' : 'POST'
  const response = await fetch('/api/admin/matches', {
    method,
    body: JSON.stringify(match)
  })
  // After save, loadMatches() refreshes the admin list
  await loadMatches()
}
```

---

## Step 2: Admin API Updates Database

**Location:** `/api/admin/matches/route.ts`

### Authentication Check ✓
- Verifies user is authenticated via Supabase auth
- Only authenticated admins can POST/PUT/DELETE

### Data Validation ✓
- Validates match schema using `validateMatch()`
- Maps form fields to database schema:
  - `home_team` → `home`
  - `away_team` → `away`
  - `match_date` → `date`
  - `match_time` → `time`

### Database Write ✓
```ts
const supabase = createAdminClient()
const { data, error } = await supabase
  .from('matches')
  .insert([matchData])
  .select()
```

---

## Step 3: Website Fetches Updated Data

**Location:** `/api/matches/route.ts` (Public API)

This is a **public endpoint** - anyone can fetch match data. It reads directly from Supabase:

```ts
let query = supabase
  .from('matches')
  .select('*')
  .order('match_date', { ascending: false })
  .limit(limit)

// Optional filters
if (status) query = query.eq('status', status)
if (league) query = query.eq('league', league)

const { data } = await query
return NextResponse.json(data || [])
```

---

## Step 4: Website Components Display Data

### Home Page Components:
1. **HomeNextFixture** - Shows next upcoming match
2. **HomeLeagueStandings** - Shows live standings
3. **HomeLatestNews** - Shows recent news
4. **PremiumMatchStats** - Shows detailed match statistics

### Data Fetching Pattern:
```ts
// Components use fetch or SWR to get data
const response = await fetch('/api/matches?status=upcoming&limit=1')
const matches = await response.json()
```

---

## Verification Checklist

### Database Prerequisites ✓
- [ ] **Migrations Applied** - Visit `/admin/migrations` to apply all 25 SQL migrations
- [ ] **Matches table exists** with columns:
  - id, home, away, home_score, away_score, date, time
  - venue, status, season_year, notes, created_at, updated_at
- [ ] **RLS policies enabled** - Allows admins to write, everyone to read

### Admin Panel ✓
- [ ] Admin can access `/admin/matches`
- [ ] Can create new matches (POST to `/api/admin/matches`)
- [ ] Can update existing matches (PUT to `/api/admin/matches/{id}`)
- [ ] Can delete matches (DELETE to `/api/admin/matches/{id}`)

### Public Website ✓
- [ ] Home page loads `/api/matches` data
- [ ] Matches display in HomeNextFixture component
- [ ] Standings update in HomeLeagueStandings
- [ ] New matches appear without page refresh

---

## Real-Time Sync

Currently using **polling with SWR** for automatic data refresh:

```ts
// Components refetch data every 10 seconds
useSWR('/api/matches', fetcher, { 
  refreshInterval: 10000 // 10 seconds
})
```

For **real-time updates** without polling, you can enable **Supabase Realtime**:
```ts
supabase
  .channel('matches:*')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'matches'
  }, (payload) => {
    console.log('Match updated:', payload)
    // Refresh UI
  })
  .subscribe()
```

---

## Test Flow

### 1. Admin Updates Match
```bash
# Visit http://localhost:3000/admin/matches
# Click "Edit" on any match
# Change the score or status
# Click "Save"
```

### 2. Verify API Updated
```bash
# Check admin API returns updated data
curl http://localhost:3000/api/admin/matches

# Check public API has same data
curl http://localhost:3000/api/matches
```

### 3. Verify Website Shows Update
```bash
# Refresh home page
# New match data should appear in fixtures
# Standings should update
```

---

## Troubleshooting

### Data Not Saving in Admin Panel

**Problem:** Save button shows error
**Solution:**
1. Check Supabase migration status at `/admin/migrations`
2. Ensure `matches` table exists in Supabase
3. Check browser console for specific error message
4. Verify admin user is authenticated

### Website Not Showing Updated Data

**Problem:** Changes don't appear on home page
**Solution:**
1. Check that `/api/matches` returns new data: `curl http://localhost:3000/api/matches`
2. Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
3. Check if SWR polling is working - should refetch every 10s
4. Check browser DevTools Network tab to see API calls

### 404 Errors on Admin Save

**Problem:** "matches table not found"
**Solution:**
1. Go to `/admin/migrations`
2. Apply all 25 migrations to Supabase
3. Verify table exists in Supabase dashboard: Auth → Database → matches table

---

## Success Indicators

✅ Admin can create/update/delete matches
✅ Data saves to Supabase database
✅ Website fetches and displays updated data
✅ Home page refreshes every 10 seconds with latest data
✅ No console errors in browser DevTools

---

## Architecture Summary

| Component | Role | Database Access |
|-----------|------|------------------|
| Admin Panel | Create/Update/Delete matches | Via `/api/admin/matches` (authenticated) |
| Admin API | Validates and saves data | Uses admin client (full write access) |
| Public API | Reads match data | Uses public client (read-only access) |
| Website | Displays match data to users | Fetches from `/api/matches` (public) |
| Supabase | Central data store | Enforces RLS policies |

The data **immediately syncs** from admin to database to website!
