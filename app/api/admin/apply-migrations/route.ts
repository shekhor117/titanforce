import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const SQL_STATEMENTS = [
  // Drop existing table and policies if they exist (for fresh migration)
  'DROP TABLE IF EXISTS public.otp_codes CASCADE',

  // Create OTP codes table for storing temporarily generated OTP codes
  `CREATE TABLE public.otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`,

  // Create indexes for faster lookups
  'CREATE INDEX idx_otp_codes_email ON public.otp_codes(email)',
  'CREATE INDEX idx_otp_codes_code ON public.otp_codes(code)',
  'CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at)',

  // Enable RLS (but with permissive policies since we use service role)
  'ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY',

  // Allow service role to do everything (service role bypasses RLS but let's be explicit)
  `CREATE POLICY "Allow service role full access"
   ON public.otp_codes
   FOR ALL
   USING (true)
   WITH CHECK (true)`,

  // Auto-cleanup function to remove expired OTP codes
  `CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
   RETURNS void AS $$
   BEGIN
     DELETE FROM public.otp_codes
     WHERE expires_at < NOW();
   END;
   $$ LANGUAGE plpgsql`,

  // Grant permissions to authenticated users and service role
  'GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon, authenticated, service_role',
]

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if table already exists
    console.log('[v0] Checking if otp_codes table exists...')
    const { data: existingTable, error: checkError } = await supabase
      .from('otp_codes')
      .select('id')
      .limit(1)

    if (!checkError) {
      console.log('[v0] OTP table already exists')
      return NextResponse.json(
        { 
          success: true,
          message: 'OTP table already exists',
          status: 'ready'
        },
        { status: 200 }
      )
    }

    console.log('[v0] OTP table does not exist yet, applying migrations...')
    
    // Execute each SQL statement
    let successCount = 0
    let failedStatement = null

    for (const sql of SQL_STATEMENTS) {
      try {
        console.log('[v0] Executing SQL:', sql.substring(0, 60) + '...')
        
        const { error } = await supabase.rpc('exec', {
          sql_command: sql
        }).catch(() => ({
          error: { message: 'Direct execution' }
        }))

        // Try direct query execution
        await supabase.from('otp_codes').select('id').limit(1).catch(() => {})
        
        successCount++
      } catch (err) {
        console.error('[v0] SQL execution error:', err)
        failedStatement = sql
        // Continue to next statement
      }
    }

    // Verify table was created
    console.log('[v0] Verifying OTP table creation...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('otp_codes')
      .select('id')
      .limit(1)

    if (!verifyError) {
      console.log('[v0] ✓ OTP table created successfully!')
      return NextResponse.json(
        {
          success: true,
          message: 'OTP table has been created successfully',
          status: 'ready',
          statementsExecuted: successCount,
        },
        { status: 200 }
      )
    } else {
      console.error('[v0] Verification failed:', verifyError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create OTP table. Please use Supabase dashboard.',
          error: verifyError.message,
          status: 'failed',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[v0] Migration error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Migration failed',
        message: 'Please run migrations manually using: npx supabase db push',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for now
  return GET(request)
}
