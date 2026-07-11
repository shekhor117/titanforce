import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
      auth: { persistSession: false },
    })

    // List of required tables to check
    const requiredTables = [
      'players',
      'partners',
      'matches',
      'media_items',
      'news_items',
      'honours',
      'injuries',
      'player_positions',
      'app_users',
      'contact_messages',
      'otp_codes',
      'site_settings',
      'trophies',
    ]

    console.log('[v0] Checking for missing tables...')
    const missingTables: string[] = []
    const existingTables: string[] = []

    // Check each table
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true })

      if (error) {
        console.log(`[v0] Table missing: ${table}`)
        missingTables.push(table)
      } else {
        console.log(`[v0] Table exists: ${table}`)
        existingTables.push(table)
      }
    }

    if (missingTables.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'All required tables exist',
          status: 'complete',
          tables: {
            total: requiredTables.length,
            existing: existingTables.length,
            missing: 0,
          },
        },
        { status: 200 }
      )
    }

    // List migration files that need to be applied
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))

    return NextResponse.json(
      {
        success: false,
        message: `${missingTables.length} table(s) missing. Please apply migrations.`,
        status: 'setup_required',
        tables: {
          total: requiredTables.length,
          existing: existingTables.length,
          missing: missingTables.length,
          missingList: missingTables,
        },
        instructions: [
          '1. Go to Supabase Dashboard → SQL Editor',
          '2. Run the following migrations:',
          ...migrationFiles
            .filter(f => 
              f.includes('media_items') || 
              f.includes('site_settings') ||
              f.includes('otp_codes') ||
              f.includes('news_items') ||
              f.includes('honours') ||
              f.includes('player_positions')
            )
            .map(f => `   - ${f}`),
          '3. Or run: npx supabase db push',
        ],
        migrationFiles: migrationFiles.filter(f => 
          f.includes('media_items') || 
          f.includes('site_settings') ||
          f.includes('otp_codes')
        ),
      },
      { status: 202 }
    )
  } catch (error) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Setup failed',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
