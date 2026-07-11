import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Read all migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    
    if (!fs.existsSync(migrationsDir)) {
      return NextResponse.json(
        { error: 'Migrations directory not found', status: 'error' },
        { status: 400 }
      )
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No migration files found', status: 'error' },
        { status: 400 }
      )
    }

    // Check which tables exist
    const tableChecks: Record<string, boolean> = {}
    const tables = [
      'players', 'matches', 'standings', 'honours', 'player_honours',
      'news_items', 'media_items', 'site_settings', 'injuries', 
      'partnerships', 'contact_messages', 'trophies', 'otp_codes'
    ]

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(0)
        
        tableChecks[table] = !error
      } catch {
        tableChecks[table] = false
      }
    }

    const existingTables = Object.entries(tableChecks)
      .filter(([_, exists]) => exists)
      .map(([table]) => table)

    const missingTables = Object.entries(tableChecks)
      .filter(([_, exists]) => !exists)
      .map(([table]) => table)

    return NextResponse.json({
      status: 'check_complete',
      totalTables: tables.length,
      existingCount: existingTables.length,
      missingCount: missingTables.length,
      existingTables,
      missingTables,
      migrationFiles: files,
      message: `Found ${missingTables.length} missing tables. Apply migrations to fix.`,
    })
  } catch (error) {
    console.error('[v0] Migration check error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', status: 'error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires manual Supabase setup due to SQL execution limitations
    // Provide detailed instructions instead
    
    return NextResponse.json({
      status: 'instructions',
      steps: [
        {
          title: 'Open Supabase Dashboard',
          description: 'Go to https://app.supabase.com and select your project'
        },
        {
          title: 'Navigate to SQL Editor',
          description: 'Click on SQL Editor in the left sidebar'
        },
        {
          title: 'Create New Query',
          description: 'Click "New Query" button'
        },
        {
          title: 'Copy Migration SQL',
          description: 'Open supabase/migrations/20260702_setup_complete_db_schema.sql and copy all content'
        },
        {
          title: 'Paste and Execute',
          description: 'Paste in editor and click "RUN" button'
        },
        {
          title: 'Repeat for Other Migrations',
          description: 'Repeat steps 3-5 for other migration files as needed'
        },
        {
          title: 'Verify Tables',
          description: 'Go to Tables section and verify all tables are created'
        },
        {
          title: 'Refresh App',
          description: 'Refresh your app - all content should now display'
        }
      ],
      migrationFiles: [
        'supabase/migrations/20260702_setup_complete_db_schema.sql',
        'supabase/migrations/20260707_create_player_honours_table.sql',
        'supabase/migrations/20260711_create_media_items_table.sql',
        'supabase/migrations/20260711_create_site_settings_table.sql',
      ],
      message: 'Manual migration required - follow steps above',
    })
  } catch (error) {
    console.error('[v0] Migration instruction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
