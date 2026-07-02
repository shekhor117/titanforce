# Quick Start Checklist

## Fix Data Fetching in 5 Minutes

### ✅ Step 1: Open Supabase Dashboard (1 min)
1. Go to https://supabase.com/dashboard
2. Click on your project "titanforce"
3. Go to **SQL Editor**

### ✅ Step 2: Create Tables (2 min)
1. Click **New Query**
2. Paste SQL from: `/supabase/migrations/20260702_setup_complete_db_schema.sql`
3. Click **Run**
4. Wait for "Success" message

### ✅ Step 3: Verify Tables (1 min)
1. Go to **Table Editor** (left sidebar)
2. Confirm you see these tables:
   - players ✓
   - matches ✓
   - standings ✓
   - products ✓
   - (others are optional)

### ✅ Step 4: Restart Your App (1 min)
1. Refresh your website at `http://localhost:3000`
2. Go to admin panel at `/admin`
3. Login with your credentials

### ✅ Step 5: Add Sample Data (Optional)
1. In admin panel, go to **Players** section
2. Click **Add Player**
3. Fill in details and save
4. Check website - player appears!

## What Each Table Does

| Table | Purpose | Where Used |
|-------|---------|-----------|
| `players` | Player profiles & stats | Squad page, player detail page |
| `matches` | Match info & statistics | Fixtures, results pages |
| `standings` | League standings | Dashboard, standings page |
| `products` | Store items | Shop, featured products |
| `match_lineups` | Player lineups | Match details modal |
| `match_events` | Goals, cards, assists | Match timeline |
| `trophies` | Achievements | Achievements page |
| `gallery` | Team photos | Gallery page |
| `articles` | News posts | News section |

## Admin Panel Sections

After tables are created, access admin at: `/admin`

- **Dashboard** - Overview & stats
- **Players** - Manage player profiles
- **Matches** - Add/edit matches
- **Products** - Store inventory
- **Gallery** - Upload photos
- **News** - Write articles
- **Standings** - Update league table

## Data Flow Summary

```
You add data in Admin Panel
        ↓
Data saved to Supabase Database
        ↓
Website fetches from Database
        ↓
Displays on Website
```

## Common Questions

**Q: Do I need to do this on every deployment?**
A: No, just once. Tables persist in your Supabase database.

**Q: Can I add data before creating tables?**
A: No, tables must exist first. Admin panel will show empty lists until you create them.

**Q: What if I run the SQL twice?**
A: It's safe! The SQL uses `CREATE TABLE IF NOT EXISTS` - won't duplicate.

**Q: How do I add my club's logo?**
A: Upload to admin panel's Media section, then link in player/team pages.

## That's It! 🎉

Once you complete these 5 steps, your:
- Admin panel fully works
- Website displays all data
- Data stays in sync
- Everything is connected

## Next Steps

1. ✅ Create tables (SQL migration)
2. ✅ Add players via admin
3. ✅ Add matches via admin
4. ✅ Customize content in admin
5. ✅ Website automatically updates

---

**Need detailed help?** → Read `DATA_FETCHING_FIX.md`
**Need database structure info?** → Read `DATABASE_SETUP.md`
