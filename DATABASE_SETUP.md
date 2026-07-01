# Database Setup Guide

This guide helps you set up the Supabase database for the Titanforce application.

## Quick Start (5 minutes)

### 1. Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Create a new project or select existing one
3. Go to **Settings > API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Set Environment Variables

Create/update `.env.development.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Apply Migrations

Option A - Via API:
```bash
curl http://localhost:3000/api/admin/apply-migrations
```

Option B - Via CLI:
```bash
npm run migrate:apply
```

### 5. Verify Setup

```bash
npm run migrate:status
```

Expected response should show all 5 tables as "exists: true".

## Troubleshooting

### Migrations Fail

**Problem**: API returns 503 or "credentials not configured"

**Solution**:
1. Double-check `.env.development.local` has all three variables
2. Restart dev server: `npm run dev`
3. Verify values don't have quotes or extra spaces

### Tables Don't Exist

**Problem**: Migration status shows missing tables

**Solution**:
1. Check Supabase dashboard for any errors
2. Try applying migrations manually via Supabase SQL editor
3. Copy content from `supabase/migrations/` and paste into SQL editor
4. Execute each file in order

### RLS Policy Errors

**Problem**: Getting "row level security" errors

**Solution**:
- For service role operations, use `SUPABASE_SERVICE_ROLE_KEY`
- The service role bypasses RLS restrictions
- Make sure you're using the correct key in API routes

## Manual Setup (If API Fails)

### Step 1: Create Tables

Go to your Supabase dashboard **SQL Editor** and run:

```bash
# Copy content from these files and execute in order:
# supabase/migrations/20260618_create_otp_codes_table.sql
# supabase/migrations/20260618_create_contact_messages_table.sql
# supabase/migrations/20260618_create_app_users_table.sql
# etc.
```

Or use the complete schema:

```bash
# Copy entire content of lib/supabase/schema.sql
# Paste into Supabase SQL Editor and execute
```

### Step 2: Verify Tables

In Supabase dashboard:
- Go to **Table Editor**
- You should see: otp_codes, contact_messages, app_users, standings, matches

## Database Schema

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| otp_codes | Authentication | email, code, expires_at |
| contact_messages | Contact form | name, email, message, status |
| app_users | User profiles | auth_id, email, role, status |
| standings | League standings | position, team_name, points |
| matches | Match info | home_team, away_team, status |

## API Endpoints

### Check Status
```
GET /api/admin/migrations-status
```

### Apply Migrations
```
GET /api/admin/apply-migrations
POST /api/admin/apply-migrations
```

### Setup Admin User
```
POST /api/admin/setup
{
  "email": "admin@example.com",
  "password": "secure_password",
  "name": "Admin Name"
}
```

## Environment Variables Reference

| Variable | From | Purpose |
|----------|------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase Dashboard > Settings > API | Database URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Dashboard > Settings > API (anon) | Public key for client |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Dashboard > Settings > API (service_role) | Admin key for server |

## Important Notes

- Always use `SUPABASE_SERVICE_ROLE_KEY` on the server side
- Never commit `.env.development.local` to git
- Service role key has full database access - keep it secret
- RLS policies protect data even if anon key is exposed

## Support

For detailed migration documentation, see: [MIGRATIONS.md](./MIGRATIONS.md)
