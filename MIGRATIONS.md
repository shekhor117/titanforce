# Supabase Database Migrations

This document explains how to set up and manage Supabase database migrations for the Titanforce application.

## Overview

The application uses Supabase as the primary database with the following tables:

- **otp_codes** - OTP authentication codes
- **contact_messages** - Contact form submissions
- **app_users** - Application user profiles
- **standings** - League standings
- **matches** - Match information

## Setup Instructions

### 1. Environment Variables

Set up your Supabase credentials in `.env.development.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these values from your Supabase project dashboard: https://supabase.com/dashboard

### 2. Apply Migrations

#### Option A: Via API Endpoint (Recommended)

```bash
curl -X GET http://localhost:3000/api/admin/apply-migrations
```

#### Option B: Using CLI Script

```bash
npm run migrate:apply
# or
node scripts/apply-otp-migration.js
```

#### Option C: Manual via Supabase Dashboard

1. Go to your Supabase dashboard
2. Open the SQL editor
3. Copy and paste the migration files from `supabase/migrations/`
4. Execute each migration in order

### 3. Verify Migrations

Check migration status via API:

```bash
curl -X GET http://localhost:3000/api/admin/migrations-status
```

Expected response:

```json
{
  "status": "success",
  "message": "All migrations have been applied successfully",
  "tables": [
    { "name": "otp_codes", "exists": true, "description": "OTP codes for authentication" },
    { "name": "contact_messages", "exists": true, "description": "Contact form submissions" },
    { "name": "app_users", "exists": true, "description": "Application users" },
    { "name": "standings", "exists": true, "description": "League standings" },
    { "name": "matches", "exists": true, "description": "Match information" }
  ],
  "summary": {
    "total": 5,
    "ready": 5,
    "missing": 0
  }
}
```

## Migration Files

### Location
`supabase/migrations/`

### Files
- `20260618_create_otp_codes_table.sql` - OTP authentication
- `20260618_create_contact_messages_table.sql` - Contact form
- `20260618_create_app_users_table.sql` - User management
- `20260618_fix_contact_messages_rls.sql` - Contact message RLS policies
- Other feature-specific migrations

## Understanding RLS (Row Level Security)

All tables have RLS policies configured:

- **otp_codes** - Service role only
- **contact_messages** - Public insert, Admin read/update/delete
- **app_users** - Public view active, Users view own, Admins full access
- **standings** - Public view, Service role manage
- **matches** - Public view, Service role manage

## Troubleshooting

### Migration Fails

1. Check Supabase credentials are correct
2. Verify SUPABASE_SERVICE_ROLE_KEY is set (not just ANON_KEY)
3. Check table doesn't already exist in Supabase dashboard
4. Manually apply migrations via Supabase SQL editor

### Tables Exist but Queries Fail

1. Check RLS policies are correctly configured
2. Verify user has appropriate permissions
3. Check service role key is being used for admin operations

### API Returns 503

Supabase credentials are missing. Set environment variables and restart dev server:

```bash
npm run dev
```

## Creating New Migrations

1. Create a new `.sql` file in `supabase/migrations/`
2. Follow naming convention: `YYYYMMDD_description.sql`
3. Write your SQL statements
4. Run migrations to apply
5. Commit to git

Example:

```sql
-- supabase/migrations/20260630_add_new_table.sql

CREATE TABLE IF NOT EXISTS public.new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access" ON public.new_table
  FOR SELECT USING (true);
```

## Database Schema Reference

See `lib/supabase/schema.sql` for the complete schema definition with all tables, indexes, and policies.

## API Endpoints

### Check Migration Status

```
GET /api/admin/migrations-status
```

### Apply Migrations

```
GET /api/admin/apply-migrations
POST /api/admin/apply-migrations
```

## Support

If migrations fail:

1. Check the error message in logs
2. Verify all environment variables are set
3. Try applying migrations manually via Supabase dashboard
4. Contact support if issues persist
