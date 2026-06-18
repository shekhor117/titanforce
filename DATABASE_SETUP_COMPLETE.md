# Complete TitanForce Setup Guide

## Current Status

You have successfully set up:
- ✅ Brevo SMTP Email Integration
- ✅ OTP Generation & Storage System
- ⏳ **Database Table Creation** (Pending - requires one-time manual step)

## Complete the Database Setup

The `otp_codes` table needs to be created in your Supabase database. Choose one method:

### Method 1: Supabase CLI (Recommended) ⭐

This is the easiest and fastest method:

```bash
npx supabase db push
```

This command will:
1. Read all migration files from `supabase/migrations/`
2. Apply the OTP table migration automatically
3. Set up all indexes and policies

**Requirements:**
- Supabase CLI installed: `npm install -g supabase`
- Connected to your Supabase project

---

### Method 2: Manual SQL via Dashboard

If you prefer to apply the migration manually:

**Steps:**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your **TitanForce** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire SQL from: `supabase/migrations/20260618_create_otp_codes_table.sql`
6. Paste it into the SQL editor
7. Click **Run** button (or press Ctrl+Enter)
8. Wait for confirmation "Query executed successfully"

**SQL to Run:**
```sql
-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS public.otp_codes CASCADE;

-- Create OTP codes table
CREATE TABLE public.otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX idx_otp_codes_code ON public.otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow service role full access"
  ON public.otp_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon, authenticated, service_role;
```

---

## What Gets Created

When the migration runs successfully:

- **otp_codes table**: Stores temporary OTP codes with email, code, expiration
- **Indexes**: Fast lookups by email, code, and expiration time
- **RLS Policy**: Security permissions for the table
- **Cleanup Function**: Automatically removes expired OTP codes
- **Grants**: Permissions for all Supabase roles

---

## Verify It Worked

After running the migration, verify by:

1. Go to Supabase Dashboard → Table Editor
2. You should see `otp_codes` table listed
3. The table should have 8 columns: id, email, code, expires_at, verified_at, attempts, created_at, updated_at

---

## Complete OTP Flow

Once the table is created:

1. **User enters email** on `/login`
2. **OTP is generated** (random 6-digit code)
3. **OTP is stored** in the `otp_codes` table
4. **Email is sent** via Brevo SMTP with the code
5. **User enters code** from their email
6. **Code is verified** against the database
7. **User is authenticated** and logged in

---

## Environment Variables Configured

```
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=ab4d0d001@smtp-brevo.com
BREVO_SMTP_PASS=<your-password>
BREVO_SENDER_EMAIL=noreply@titanforce.com
NEXT_PUBLIC_SUPABASE_URL=<your-url>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
```

---

## Test the System

After running the migration:

1. Navigate to `http://localhost:3000/login`
2. Enter your email
3. Click "Continue"
4. You should see the OTP verification screen
5. Check your email for the OTP code
6. Enter the code and click "Continue"
7. You should be logged in!

---

## Troubleshooting

**"Could not find the table 'public.otp_codes'"**
- The migration hasn't run yet. Follow Method 1 or 2 above.

**"Failed to send email"**
- Verify Brevo SMTP credentials are correct
- Check that sender email is verified in Brevo dashboard
- Check console logs for detailed error messages

**"OTP code invalid or expired"**
- The code may have expired (5 minute limit)
- Request a new OTP by entering your email again

**"Permission denied"**
- The RLS policy may not have been applied correctly
- Re-run the migration SQL and ensure all commands execute

---

## Quick Links

- Supabase Dashboard: https://app.supabase.com
- Brevo Dashboard: https://app.brevo.com
- Setup Page: http://localhost:3000/setup/migrations
- Login Page: http://localhost:3000/login

---

**Next Steps:**
1. Run the migration using Method 1 or 2
2. Verify the table was created in Supabase
3. Test the login flow at `/login`
4. Check your email for OTP codes

You're almost there! Just one more step to complete the setup.
