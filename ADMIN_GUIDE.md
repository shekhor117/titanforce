# TitanForce Admin Guide - Complete Setup & Usage

## Quick Start

### Step 1: Apply Database Migrations
```
1. Visit: http://localhost:3000/admin/migrations
2. Copy each migration SQL file
3. Go to Supabase Dashboard → SQL Editor
4. Paste and run each migration
5. All tables will be created with proper RLS policies
```

### Step 2: Admin Panel Data Entry
```
1. Visit: http://localhost:3000/admin/matches
2. Click "Add New Match" or "Edit" existing match
3. Fill in match details (teams, score, date, etc.)
4. Click "Save"
5. Data syncs to Supabase database
```

### Step 3: Website Displays Data Automatically
```
1. Go to: http://localhost:3000 (home page)
2. Updated matches appear in:
   - Next Fixture section
   - League Standings
   - Match Statistics
3. Data refreshes automatically every 10 seconds
```

---

## Complete Feature Overview

### Admin Panel Features

#### ✓ Match Management (`/admin/matches`)
- Create new matches
- Edit match details:
  - Teams (home/away)
  - Scores and status
  - Date, time, venue
  - League information
  - Match statistics (shots, possession, etc.)
  - Lineups (player assignments)
  - Events (goals, cards, substitutions)

#### ✓ Data Persistence
- All changes saved to Supabase PostgreSQL database
- No more localStorage fallback
- Data persists across sessions
- Real-time sync to website

#### ✓ Migration Setup (`/admin/migrations`)
- One-click migration loader
- Shows all 25 migration SQL files
- Copy/paste interface for Supabase SQL Editor
- Full database schema setup

---

## Data Architecture

### Supabase Integration
- PostgreSQL database with Row Level Security (RLS)
- Admin users have full access to create/update/delete
- Public users can only read match data
- Automatic authentication via Supabase

### API Endpoints

#### Admin API (Authenticated)
```
POST   /api/admin/matches         - Create new match
GET    /api/admin/matches         - List all matches
PUT    /api/admin/matches/{id}    - Update match
DELETE /api/admin/matches/{id}    - Delete match
```

#### Public API (Read-only)
```
GET /api/matches                  - Get all matches
GET /api/matches?status=upcoming  - Filter by status
GET /api/matches?league=premier   - Filter by league
```

---

## Data Flow Diagram

```
Admin Panel
    ↓
Admin API (/api/admin/matches)
    ↓
Supabase Database (matches table)
    ↓
Public API (/api/matches)
    ↓
Website Components
    ↓
Website Users
```

---

## Usage Examples

### Adding a New Match

**Steps:**
1. Visit `/admin/matches`
2. Click "Add New Match" button
3. Fill in:
   - Home Team: "Titan Force"
   - Away Team: "Opponent FC"
   - Date: Select from calendar
   - Time: 15:30
   - Venue: "Stadium Name"
   - League: "Premier League"
   - Status: "Upcoming"
4. Click "Save"
5. Match appears on home page within 10 seconds

### Updating Match Score (After Game)

**Steps:**
1. Visit `/admin/matches`
2. Find the completed match
3. Click "Edit"
4. Switch to "Basic" tab
5. Update:
   - Score: Home 2 - 1 Away
   - Status: "Completed"
   - Result: "W" (for home team)
6. Click "Stats" tab
7. Add match statistics:
   - Possession
   - Shots on target
   - Fouls
   - Yellow/Red cards
8. Click "Lineups" tab
9. Assign players to positions
10. Click "Events" tab
11. Record:
    - Goals (with scorers)
    - Cards (yellow/red)
    - Substitutions
12. Click "Save Events"
13. Click main "Save" button

---

## Important Fields Explained

### Match Status
- **Upcoming** - Match not yet played
- **Live** - Match in progress
- **Completed** - Match finished
- **Postponed** - Match delayed

### Match Result
- **W** - Home team won
- **D** - Draw
- **L** - Home team lost

### Player Positions
- **GK** - Goalkeeper
- **DEF** - Defender
- **MID** - Midfielder
- **FWD** - Forward

### Events
- **Goal** - Player scored
- **Yellow** - Yellow card
- **Red** - Red card
- **Substitution** - Player change

---

## Troubleshooting

### Problem: Can't Save Match Data

**Symptoms:** "Save" button shows error or spinning indefinitely

**Solutions:**
1. Check migrations applied at `/admin/migrations`
2. Verify Supabase credentials in environment variables
3. Check browser console (F12) for specific error
4. Try refreshing the page and saving again
5. If still failing, check Supabase status

### Problem: Data Not Appearing on Website

**Symptoms:** Admin can save data but home page doesn't update

**Solutions:**
1. Hard refresh home page (Ctrl+Shift+R / Cmd+Shift+R)
2. Check if `/api/matches` returns the data:
   ```bash
   curl http://localhost:3000/api/matches
   ```
3. Wait 10 seconds for SWR polling
4. Check DevTools Network tab to see API calls
5. Clear browser cache and try again

### Problem: Authentication Error at Admin Panel

**Symptoms:** "Unauthorized" or redirect to login

**Solutions:**
1. Ensure you're logged in as admin user
2. Check Supabase authentication is configured
3. Verify environment variables are set correctly
4. Try logging out and back in
5. Check browser cookies are enabled

### Problem: Migrations Not Applying

**Symptoms:** Can see migrations at `/admin/migrations` but getting errors when running

**Solutions:**
1. Copy migration SQL exactly as shown
2. Go to Supabase dashboard → SQL Editor
3. Create a new query (not edit existing)
4. Paste the entire migration SQL
5. Click "Run"
6. Wait for completion
7. Check for error messages
8. Try next migration

---

## Best Practices

### Admin Data Entry
- ✅ Always fill required fields (teams, date, status)
- ✅ Use consistent team names across matches
- ✅ Set correct match status before/after games
- ✅ Add statistics immediately after match completion
- ✅ Review data before saving in admin panel

### Website Updates
- ✅ Data syncs automatically within 10 seconds
- ✅ No need to manually refresh the site
- ✅ Website stays responsive while admin updates data
- ✅ Multiple admins can update simultaneously
- ✅ All changes are permanent in database

### Performance
- ✅ Website caches data for 10 seconds via SWR
- ✅ Admins always get fresh data from database
- ✅ API responses are optimized with indexing
- ✅ Large numbers of matches load efficiently

---

## Environment Setup Checklist

- [ ] Supabase URL set in `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Supabase anon key set in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Supabase service role key set in `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Database migrations applied via `/admin/migrations`
- [ ] Admin user created and authenticated
- [ ] Matches table visible in Supabase dashboard
- [ ] API endpoints responding (check with curl)
- [ ] Website displaying data on home page

---

## Testing Checklist

### Admin Panel
- [ ] Login works
- [ ] Can create new match
- [ ] Can view all matches
- [ ] Can edit existing match
- [ ] Can delete match
- [ ] Save shows success message
- [ ] Errors show helpful error messages

### Website
- [ ] Home page loads
- [ ] NextFixture shows matches from database
- [ ] Standings display current league standings
- [ ] News section loads
- [ ] Stats showcase shows match data
- [ ] Data updates when admin makes changes
- [ ] Page responsive on mobile

### Database
- [ ] Supabase shows matches table
- [ ] Table has correct columns
- [ ] RLS policies enabled
- [ ] Admin can write to table
- [ ] Public cannot delete/update
- [ ] Indexes on frequently queried columns

---

## Support

For issues or questions, check:
1. `/admin/migrations` - Apply any missing migrations
2. Browser console (F12) - Check for error messages
3. Supabase dashboard - Verify table structure
4. `DATA_FLOW_VERIFICATION.md` - Detailed architecture info
5. This guide's troubleshooting section

The system is fully automated once migrations are applied!
