# OTP Email Authentication Setup Guide

## Overview

Your TitanForce application now has a complete OTP (One-Time Password) email authentication system. The error "Failed to store OTP: Could not find the table 'public.otp_codes'" indicates that the database migration needs to be applied.

## Quick Fix - 3 Methods

### Method 1: Using Supabase CLI (Recommended)

```bash
# In your project terminal, run:
npx supabase db push

# This will automatically apply all pending migrations including:
# - otp_codes table creation
# - Email/code indexes
# - RLS security policies
# - Auto-cleanup function
```

### Method 2: Auto Setup from Web Interface

1. Go to: `http://localhost:3000/setup/migrations`
2. Click the "Apply Database Migrations Now" button
3. The system will automatically create the OTP table

### Method 3: Manual Setup via Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your TitanForce project
3. Navigate to "SQL Editor"
4. Click "New Query"
5. Copy the content from: `supabase/migrations/20260618_create_otp_codes_table.sql`
6. Paste it into the SQL editor
7. Click "Run"

## What Gets Created

The migration creates:

- **otp_codes table** - Stores temporary OTP codes with email, code, expiration time, and verification status
- **Indexes** - Fast lookups by email and code
- **RLS Policies** - Security rules for data access
- **Cleanup Function** - Auto-removes expired OTP codes after 5 minutes
- **Permissions** - Grants access to authenticated users and service role

## Email Configuration

### Option A: Using Brevo SMTP (Recommended)

1. Create account at https://www.brevo.com
2. Get API key from Settings → SMTP & API
3. Verify your sender email
4. Add to Vercel environment:
   - `BREVO_API_KEY` = your API key
   - `BREVO_SENDER_EMAIL` = your verified email (e.g., noreply@titanforce.com)
5. OTP emails will now be sent via Brevo

### Option B: Using Resend

1. Sign up at https://resend.com
2. Get API key from Dashboard
3. Add to Vercel environment:
   - `RESEND_API_KEY` = your API key
   - `RESEND_FROM_EMAIL` = your sender email

### Option C: Development Mode

If no email provider is configured, OTP codes will be logged to console during development.

## Testing the Flow

1. Navigate to `/login`
2. Enter your email address
3. Click "Continue"
4. Check your email for OTP code
5. Enter the 6-digit code on the verification page
6. Complete login

## Troubleshooting

### "Could not find the table 'public.otp_codes'"

This means the migration hasn't been applied. Use one of the 3 methods above to apply it.

### "Failed to send OTP email"

Check:
1. BREVO_API_KEY or RESEND_API_KEY is set in Vercel
2. Sender email is verified in the email service
3. Check console logs for detailed error messages

### OTP codes expire too quickly

OTP codes are valid for 5 minutes by default. Edit `/supabase/migrations/20260618_create_otp_codes_table.sql` to change the expiration time if needed.

### Need to reset all OTP codes

Run in Supabase SQL Editor:
```sql
DELETE FROM public.otp_codes;
```

## Architecture

```
User Login Flow:
  1. User enters email → /api/auth/send-otp
  2. API generates 6-digit OTP code
  3. OTP stored in database with 5-min expiry
  4. Email sent via Brevo/Resend
  5. User enters code → /api/auth/verify-otp
  6. API verifies code hasn't expired
  7. User authenticated and logged in
```

## Files Created/Modified

- `supabase/migrations/20260618_create_otp_codes_table.sql` - Database migration
- `app/api/auth/send-otp/route.ts` - OTP generation and email sending
- `app/api/auth/verify-otp/route.ts` - OTP verification
- `app/api/admin/apply-migrations/route.ts` - Auto migration runner
- `app/setup/migrations/page.tsx` - Web UI for setup

## Next Steps

1. Apply the database migration using one of the 3 methods
2. Configure Brevo or Resend email provider
3. Test the login flow with a real email address
4. Users can now sign up and log in with OTP verification

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Check Supabase dashboard for database logs
3. Verify environment variables in Vercel settings
4. Review `docs/BREVO_SETUP_COMPLETE.md` for detailed configuration
