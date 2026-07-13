# Fix Data Fetching Issue

## Problem
The app is experiencing data fetching errors:
- **404 Error**: `GET /rest/v1/standings` - The standings table doesn't exist
- **RLS Permission Errors**: Row Level Security policies are not configured
- **Fallback to localStorage**: The app falls back to localStorage instead of fetching from Supabase

## Root Cause
The database migrations haven't been applied to your Supabase database. The migration files exist in your project but the tables haven't been created yet.

## Solution

### Option 1: Manual SQL (Recommended - Most Reliable)

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Apply the migrations in order**
   - Copy the entire SQL from each migration file below
   - Paste into the SQL Editor
   - Click "Run"
   - Wait for success

4. **Run these migrations in order:**
   - Copy the contents of `supabase/migrations/20260702_create_matches_standings_tables.sql`
   - Copy the contents of `supabase/migrations/20260702_setup_complete_db_schema.sql`
   - Copy the contents of `supabase/migrations/20260707_create_player_honours_table.sql`
   - Copy any other migration files as needed

### Option 2: Automated (via Admin Page)

1. Go to: `http://localhost:3000/admin/apply-migrations`
2. Click "Run Migrations"
3. Wait for completion

**Note:** This method has limitations with Supabase's API, so **Option 1 is recommended**.

### Option 3: Via Command Line

```bash
# Set environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the migration script
node scripts/apply-migrations.mjs
```

## Verification

After applying the migrations:

1. **Check Supabase Dashboard**
   - Go to "Table Editor"
   - You should see: `standings`, `matches`, `players`, etc.

2. **Refresh the App**
   - Visit: `http://localhost:3000`
   - The standings data should now load from Supabase
   - No more localStorage fallback messages in the console

3. **Check the Logs**
   - Look for `[v0] Standings table not available` messages
   - These should disappear once migrations are applied

## If Issues Persist

1. **Check Supabase Connection**
   - Verify `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Go to Settings → Database Credentials in Supabase

2. **Check Row Level Security**
   - In Supabase, go to each table
   - Click "RLS" 
   - Ensure policies allow public read access

3. **Clear Browser Cache**
   - Hard refresh the app (Ctrl+Shift+R)

## Quick SQL to Test

After migrations, run this in Supabase SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('standings', 'matches', 'players');

-- Check standings data
SELECT * FROM standings LIMIT 5;

-- Check matches data
SELECT * FROM matches LIMIT 5;
```

## Migration Files

All migrations are located in: `supabase/migrations/`

Key migrations:
- `20260702_create_matches_standings_tables.sql` - Creates standings and matches
- `20260702_setup_complete_db_schema.sql` - Complete database schema
- `20260707_create_player_honours_table.sql` - Player honours
- And others for additional features
