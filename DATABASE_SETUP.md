# Database Setup Guide - Titan Force FC

## Current Status
Your Supabase project is connected with all environment variables configured, but the database tables haven't been created yet. This is why the website shows no data.

## Solution: Apply Database Migrations

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project `titanforce`
3. Go to **SQL Editor** → **New Query**
4. Copy the contents of: `supabase/migrations/20260702_setup_complete_db_schema.sql`
5. Paste into the SQL Editor and click **Run**

This will create all required tables:
- `players` - Player profiles with full stats
- `matches` - Match details and statistics
- `standings` - League standings
- `products` - Store products
- `match_lineups` - Player lineups for matches
- `match_events` - Goals, assists, cards, etc.
- `trophies` - Team achievements
- `gallery` - Image gallery
- `articles` - News articles

### Option 2: Using Supabase CLI (If Installed)

```bash
cd /vercel/share/v0-project
supabase db push
```

### Option 3: Using Database Client
If you have a database management tool (pgAdmin, DBeaver, etc.):
- Connect with the POSTGRES_URL from your environment variables
- Run the SQL from `supabase/migrations/20260702_setup_complete_db_schema.sql`

## After Migration: Add Sample Data

Once tables are created, add sample data via the **Admin Panel**:

1. Navigate to `/admin`
2. Login with your admin credentials
3. Go to each section and add:
   - **Players** - Add player profiles
   - **Matches** - Add match details
   - **Products** - Add store items
   - **Gallery** - Add images
   - **Articles** - Add news

## Data Flow Architecture

```
Admin Panel (CRUD Operations)
    ↓
API Routes (/api/admin/*)
    ↓
Supabase (PostgreSQL Database)
    ↓
Website Pages (Read-Only Display)
```

## Troubleshooting

### Issue: "Table doesn't exist" error
- **Solution**: Ensure you've run the migration. Tables must be created first.

### Issue: Admin panel shows no data
- **Solution**: Data might exist but RLS policies are blocking it. Check:
  - Row Level Security is enabled
  - Service role has proper permissions
  - Logged-in user has admin role

### Issue: Website shows no players/matches
- **Solution**: This is normal until you add data via admin panel. The app gracefully returns empty arrays.

## API Endpoints for Admin

- `POST /api/admin/players` - Create player
- `GET /api/admin/players` - List players
- `PUT /api/admin/players/:id` - Update player
- `DELETE /api/admin/players/:id` - Delete player

- `POST /api/admin/matches` - Create match
- `GET /api/admin/matches` - List matches
- `PUT /api/admin/matches/:id` - Update match
- `DELETE /api/admin/matches/:id` - Delete match

Similar endpoints exist for standings, products, gallery, and articles.

## Next Steps

1. **Create tables** using one of the options above
2. **Login to admin** at `/admin`
3. **Add content** (players, matches, products, etc.)
4. **View on website** - Data appears automatically on `/team-squad`, `/fixtures-results`, etc.

## Database Schema Overview

### Players Table
- Jersey number, name, position, stats, personal info
- Tracks goals, assists, appearances, ratings
- Supports all player attributes

### Matches Table
- Match details: teams, score, date, venue
- Statistical data: possession, shots, passes, fouls
- Match status: upcoming, live, completed

### Standings Table
- League position, matches played, wins/draws/losses
- Goals for/against, goal difference, points

### Products Table
- Store items: name, price, description
- Inventory management and ratings

## Support

For more information on Supabase:
- Documentation: https://supabase.com/docs
- SQL Editor: https://supabase.com/docs/guides/sql-editor
