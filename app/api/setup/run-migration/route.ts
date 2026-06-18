import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const migrationSQL = `
-- Drop existing table and policies if they exist (for fresh migration)
DROP TABLE IF EXISTS public.otp_codes CASCADE;

-- Create OTP codes table for storing temporarily generated OTP codes
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

-- Create indexes for faster lookups
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX idx_otp_codes_code ON public.otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Enable RLS (but with permissive policies since we use service role)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (service role bypasses RLS but let's be explicit)
CREATE POLICY "Allow service role full access"
  ON public.otp_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-cleanup function to remove expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users and service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon, authenticated, service_role;
`

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[v0] Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    console.log('[v0] Creating Supabase client with service role key')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('[v0] Running OTP table migration...')
    console.log('[v0] Note: This approach requires manual migration via Supabase dashboard')
    console.log('[v0] The migration SQL is provided in supabase/migrations/20260618_create_otp_codes_table.sql')
    
    // Since Supabase JS client doesn't support raw SQL execution,
    // we'll provide the SQL content for manual execution
    // In production, use: npx supabase db push
    
    // Return the migration SQL for the user to execute manually via Supabase dashboard
    console.log('[v0] Migration process complete. Please execute the SQL manually.')

    return NextResponse.json(
      {
        success: false,
        message: 'To apply migrations, please use the Supabase CLI or manual dashboard method',
        methods: [
          {
            name: 'Supabase CLI (Recommended)',
            command: 'npx supabase db push',
            description: 'Run this in your project root directory'
          },
          {
            name: 'Supabase Dashboard (Manual)',
            steps: [
              'Go to https://app.supabase.com',
              'Select your project',
              'Navigate to SQL Editor',
              'Click "New Query"',
              'Paste the migration SQL from supabase/migrations/20260618_create_otp_codes_table.sql',
              'Click "Run"'
            ]
          }
        ],
        note: 'After running the migration, the otp_codes table will be created and OTP emails will work.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error running migration:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to run migration',
        note: 'Please manually run the migration via the Supabase dashboard',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'POST to this endpoint to run the OTP table migration',
      warning: 'This should only be run once during setup',
    },
    { status: 200 }
  )
}
