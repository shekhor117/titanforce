# Database Setup Guide - Titan Force FC Admin Panel

This guide explains how to ensure all required Supabase tables are created for the admin dashboard to function properly.

## Required Tables

The admin panel requires the following tables to be present in your Supabase database:

### Core Tables
- **players** - Player profiles and information
- **matches** - Match schedules and results
- **news_items** - News articles and updates
- **honours** - Club honours and trophies
- **injuries** - Player injury tracking
- **player_positions** - Player position information

### Content & Media
- **media_items** - Photos, videos, and gallery content
- **site_settings** - Global site configuration
- **trophies** - Trophy/achievement records

### User & Messages
- **app_users** - User accounts
- **contact_messages** - Contact form submissions
- **otp_codes** - One-time password storage for authentication
- **partners** - Partnership and sponsorship information

## Setup Methods

### Method 1: Using Supabase CLI (Recommended)

1. Ensure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. In your project directory, run:
   ```bash
   npx supabase db push
   ```

This will automatically apply all pending migrations from `supabase/migrations/` directory.

### Method 2: Using the Setup Page (Web UI)

1. Navigate to `/setup/migrations` in your app
2. Click "Check Database Tables" to see current status
3. Click "Apply Database Migrations Now" to run migrations automatically
4. Verify all tables are created

### Method 3: Manual Setup via Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. For each migration file in `supabase/migrations/`:
   - Create a new query
   - Copy the entire SQL content
   - Click "Run"

## Available Migrations

| File | Tables Created | Purpose |
|------|-----------------|---------|
| 20250505_role_tables.sql | profiles, players, fans, partners | User role management |
| 20260618_create_app_users_table.sql | app_users | Application user accounts |
| 20260618_create_contact_messages_table.sql | contact_messages | Contact form submissions |
| 20260619_create_articles_table.sql | articles | Blog/article content |
| 20260619_create_events_table.sql | events | Event management |
| 20260628_create_news_updates_table.sql | news_updates | News/media updates |
| 20260702_create_matches_standings_tables.sql | matches, standings | Match information |
| 20260702_create_news_items_proper_table.sql | news_items | Proper news items table |
| 20260702_setup_complete_db_schema.sql | Complete schema | Full database setup |
| 20260702_create_otp_codes.sql | otp_codes | OTP authentication |
| 20260707_create_player_honours_table.sql | honours | Player honours/achievements |
| 20260709_add_player_positions.sql | player_positions | Player position tracking |
| 20260711_create_media_items_table.sql | media_items | Gallery/media management |
| 20260711_create_site_settings_table.sql | site_settings | Global site configuration |

## Checking Status

### Via API
```bash
curl http://localhost:3000/api/admin/setup-all-tables
```

### Via Setup Page
Visit `/setup/migrations` to check and apply migrations using the web UI.

### Via CLI
```bash
npx supabase db list
```

## Troubleshooting

### Table Not Found Error
If you see "Could not find table" errors:
1. Check that the migration has been applied: `/setup/migrations`
2. Verify the table name is correct in the error message
3. Run the appropriate migration again

### Migration Fails with Permission Error
- Ensure you're using the service role key (SUPABASE_SERVICE_ROLE_KEY)
- Check that the user has admin permissions in Supabase

### Tables Exist But Admin Panel Shows Error
1. Clear browser cache
2. Restart the development server
3. Check Row Level Security (RLS) policies in Supabase

## Table Schemas

### news_items
```sql
CREATE TABLE public.news_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  category TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### media_items
```sql
CREATE TABLE public.media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('photo', 'video', 'image')),
  url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### site_settings
```sql
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Verifying All Tables

Run this query in Supabase SQL Editor to list all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output should include all tables listed in "Required Tables" section above.

## Row Level Security (RLS)

All tables have RLS policies configured:
- **Public read access** for most content tables
- **Service role bypass** for admin operations
- **Authenticated user access** for user-specific data

If you modify migrations or add new tables, ensure RLS policies are set up correctly.

## Support

If you encounter issues:

1. Check the browser console (F12) for detailed error messages
2. Review Supabase logs at [app.supabase.com](https://app.supabase.com) → Project → Logs
3. Verify all environment variables are set correctly:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - POSTGRES_URL

4. Visit `/setup/migrations` to check table status and run migrations
