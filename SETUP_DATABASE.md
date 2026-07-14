# Database Setup Guide - TitanForce

Your app requires database migrations to be applied to Supabase before data can be saved. Follow this guide to fix the **"data save hoy keno"** (why doesn't data save) issue.

## Quick Summary

- **Problem**: Database tables don't exist yet - migrations need to be applied
- **Solution**: Copy/paste 25 SQL migration files into Supabase SQL Editor
- **Time**: ~5-10 minutes
- **Result**: Data will persist to Supabase instead of localStorage

## Step-by-Step Instructions

### 1. Access the Migrations Page

Log in to your admin panel and go to:
```
/admin/migrations
```

You'll see a list of 25 migration files ready to apply.

### 2. Open Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com
2. Select your project: **titanforce**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### 3. Copy & Paste Migrations

For each migration file in the list:

1. On the migrations page, click the **Copy** icon next to a migration file
2. The SQL is now in your clipboard
3. In Supabase SQL Editor, paste the SQL into the editor
4. Click **Run**
5. Wait for success (you'll see "Query executed successfully")
6. Repeat for the next migration file

**Recommended order** (they're pre-sorted):
- Start with migrations like `20250505_role_tables.sql`
- End with `20260711_create_site_settings_table.sql`

### 4. What Gets Created

Running all migrations will create:

✓ **Core Tables**
- `profiles` - User profiles
- `players` - Team player data
- `teams` - Team information
- `matches` - Match records
- `standings` - League standings
- `news_items` - News articles
- `events` - Event tracking

✓ **Supporting Tables**
- `otp_codes` - One-time passwords
- `contact_messages` - Contact form submissions
- `articles` - Blog articles
- `pages` - CMS pages
- `media_items` - Media storage
- `site_settings` - Configuration

✓ **Security**
- Row Level Security (RLS) policies on all tables
- Admin-only write permissions
- Public read access where needed

✓ **Performance**
- Indexes on frequently queried columns
- Timestamps for audit trails
- Relationships between tables

### 5. Test Data Saving

After migrations complete:

1. Go to **Admin Panel** → **Matches**
2. Click **Edit** on any match
3. Make a change (e.g., update the score)
4. Click **Save**
5. Refresh the page
6. **The data should still be there!** (Previously it disappeared)

## If Something Goes Wrong

### Error: "Could not find the function..."
- This means you're trying to use a Supabase function that doesn't exist
- Solution: Just continue with the next migration - some functions are created by earlier migrations

### Error: "Relation does not exist..."
- This happens when a later migration references a table from an earlier migration that hasn't run yet
- Solution: Make sure to run migrations in order (they're pre-sorted alphabetically by date)

### Error: "Permission denied"
- Make sure you're logged in as a Supabase **admin user**
- The service role key in your env vars might be missing

### Nothing seems to save
- Try clearing localStorage: Open browser DevTools → Application → localStorage → Clear All
- Refresh the page
- Try editing a match again

## Manual Download Option

If copy/paste is tedious, click the **Download** icon next to a migration file to download the `.sql` file directly.

## Verification

Check that migrations worked:

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables in the list:
   - `profiles`
   - `players`
   - `matches`
   - `standings`
   - `news_items`
   - And others...

3. Click a table to verify it has columns

## After Setup

- Your admin panel can now save matches, standings, player data, etc.
- All data persists to Supabase database
- Public pages can read the data
- RLS policies prevent unauthorized access

## Getting Help

If migrations fail:

1. Check the error message carefully
2. Look for which file failed
3. Try running that file again in Supabase
4. Check that previous migrations ran successfully
5. If stuck, try running a migration twice (usually idempotent)

---

**That's it!** Your database is now set up and ready to store data.
