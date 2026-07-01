import { NextRequest, NextResponse } from 'next/server'
import { executeMigrations, verifyMigrations } from '@/lib/supabase/migrations'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Missing Supabase credentials',
          message: 'Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
        },
        { status: 503 }
      )
    }

    console.log('[v0] Starting migration execution...')

    // Execute all migrations
    const migrationResult = await executeMigrations(supabaseUrl, supabaseServiceKey)

    // Verify migrations were successful
    const verification = await verifyMigrations(supabaseUrl, supabaseServiceKey)

    return NextResponse.json(
      {
        success: migrationResult.success && Object.values(verification).every(v => v),
        migration: migrationResult,
        verification,
        message: migrationResult.message,
      },
      { status: migrationResult.success ? 200 : 500 }
    )
  } catch (error) {
    console.error('[v0] Migration API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
        message: 'Check logs for details',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
