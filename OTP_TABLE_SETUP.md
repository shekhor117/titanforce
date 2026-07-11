# OTP Table Setup Guide

## Problem
The error `Could not find the table 'public.otp_codes' in the schema cache` occurs because the database migration for the OTP codes table hasn't been applied yet.

## Solution

### Quick Fix - Option 1: Using Supabase Dashboard (Easiest)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Open the file `supabase/migrations/20260702_create_otp_codes.sql` from this repository
6. Copy the entire content into the SQL editor
7. Click **Run** to execute

### Quick Fix - Option 2: Using the Setup Page
1. Navigate to `/setup/migrations` in your browser
2. Click **"Apply Database Migrations Now"** button
3. Wait for confirmation

### Quick Fix - Option 3: Using Supabase CLI
Run in your project directory:
```bash
npx supabase db push
```

### Manual Script (Development)
If you have the `pg` package installed:
```bash
node scripts/apply-otp-migration.js
```

## What Gets Created
The migration creates:
- ✅ `otp_codes` table with columns for email, code, expiry, and verification timestamp
- ✅ Indexes on email, code, and expiry for fast lookups
- ✅ Row-level security policies
- ✅ Auto-cleanup function to remove expired codes
- ✅ Proper permissions for authenticated users and service role

## Verification
After running the migration, you can verify the table exists by:

1. **In Supabase Dashboard**: Check **Table Editor** → `otp_codes` should appear
2. **In Your App**: Try sending an OTP at `/login` - it should work without errors

## Troubleshooting

### Still seeing the error?
- Make sure you ran the migration command (not just tried to send OTP)
- Check that your Supabase service role key is correct
- Verify your database credentials in environment variables

### Migration succeeded but still getting error?
- The database schema cache might not be refreshed
- Try restarting your application/dev server
- Check browser console for more specific error details

## Files Modified to Fix This Issue
- `app/api/auth/send-otp/route.ts` - Better error messages and setup guidance
- `app/api/admin/apply-migrations/route.ts` - Improved migration endpoint
- `scripts/apply-otp-migration.js` - Enhanced script for running migrations
