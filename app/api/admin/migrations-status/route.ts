import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface TableStatus {
  name: string
  exists: boolean
  description: string
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase credentials not configured',
        },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // List of critical tables to check
    const tablesToCheck: Array<{ name: string; description: string }> = [
      { name: 'otp_codes', description: 'OTP codes for authentication' },
      { name: 'contact_messages', description: 'Contact form submissions' },
      { name: 'app_users', description: 'Application users' },
      { name: 'standings', description: 'League standings' },
      { name: 'matches', description: 'Match information' },
    ]

    const tableStatus: TableStatus[] = []

    // Check each table
    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase
          .from(table.name)
          .select('1')
          .limit(1)

        tableStatus.push({
          name: table.name,
          exists: !error || !error.message.includes('does not exist'),
          description: table.description,
        })
      } catch {
        tableStatus.push({
          name: table.name,
          exists: false,
          description: table.description,
        })
      }
    }

    const allTablesExist = tableStatus.every(t => t.exists)

    return NextResponse.json(
      {
        status: allTablesExist ? 'success' : 'incomplete',
        message: allTablesExist
          ? 'All migrations have been applied successfully'
          : 'Some migrations are missing. Run the apply-migrations endpoint to fix.',
        tables: tableStatus,
        summary: {
          total: tableStatus.length,
          ready: tableStatus.filter(t => t.exists).length,
          missing: tableStatus.filter(t => !t.exists).length,
        },
        nextSteps: allTablesExist
          ? 'Database is ready for use'
          : 'Visit /api/admin/apply-migrations to apply missing migrations',
      },
      { status: allTablesExist ? 200 : 503 }
    )
  } catch (error) {
    console.error('[v0] Migration status check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to check migration status',
      },
      { status: 500 }
    )
  }
}
