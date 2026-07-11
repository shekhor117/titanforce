import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })

    // Check if table already exists
    const { error: checkError } = await supabase
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })

    if (!checkError) {
      return NextResponse.json(
        { 
          success: true,
          message: 'OTP table already exists',
          status: 'ready'
        },
        { status: 200 }
      )
    }

    console.log('[v0] OTP table does not exist, creating it now...')

    // Use postgres direct connection to run raw SQL
    const postgresUrl = process.env.POSTGRES_URL
    if (!postgresUrl) {
      return NextResponse.json(
        { error: 'Missing POSTGRES_URL' },
        { status: 500 }
      )
    }

    // Create the table using raw SQL via fetch to PostgREST
    const sqlStatements = `
      -- Create OTP codes table
      CREATE TABLE IF NOT EXISTS public.otp_codes (
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
      CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
      CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON public.otp_codes(code);
      CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

      -- Enable RLS
      ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

      -- Create policy
      CREATE POLICY IF NOT EXISTS "Allow service role full access"
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
      GRANT EXECUTE ON FUNCTION public.cleanup_expired_otps() TO anon, authenticated, service_role;
    `

    // Try to execute via a custom stored procedure or direct API call
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql: sqlStatements }),
    }).catch(() => null)

    // Fallback: Try using supabase.rpc if available
    const { error: execError, data } = await supabase.rpc('exec_sql' as any, {
      sql: sqlStatements
    }).catch((err: any) => ({
      error: { message: 'RPC not available, attempting alternative method' },
      data: null
    }))

    // Verify table was created
    console.log('[v0] Verifying OTP table creation...')
    const { error: verifyError, data: verifyData } = await supabase
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })

    if (!verifyError) {
      console.log('[v0] OTP table verified successfully')
      return NextResponse.json(
        {
          success: true,
          message: 'OTP table has been created successfully',
          status: 'ready',
        },
        { status: 200 }
      )
    } else {
      console.error('[v0] Table verification failed:', verifyError)
      
      // Return helpful message to user
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to create OTP table via API. Please create it manually in Supabase dashboard.',
          details: 'Go to SQL Editor in your Supabase dashboard and run the migration file at supabase/migrations/20260702_create_otp_codes.sql',
          error: verifyError.message,
          status: 'manual_required',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[v0] Migration error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Migration failed',
        message: 'Please create the OTP table manually in Supabase SQL Editor: Go to supabase/migrations/20260702_create_otp_codes.sql and run it',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
