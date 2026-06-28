import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Database Setup Endpoint
 * Executes all SQL migrations to initialize the database schema
 */

export async function GET(request: NextRequest) {
  try {
    // Get migration file list
    const migrationsPath = join(process.cwd(), 'supabase', 'migrations')

    const migrationFiles = [
      '20250505_role_tables.sql',
      '20250516_fix_rls_performance.sql',
      '20260516163423_create_is_admin_rpc.sql',
      '20260517193131_create_gallery_table.sql',
      '20260517195125_create_products_table.sql',
      '20260517195413_create_trophies_table.sql',
      '20260517202759_add_player_ranking_column.sql',
      '20260618_create_app_users_table.sql',
      '20260618_create_contact_messages_table.sql',
      '20260618_create_otp_codes_table.sql',
      '20260618_fix_contact_messages_rls.sql',
      '20260619_create_articles_table.sql',
      '20260619_create_events_table.sql',
      '20260619_create_pages_table.sql',
      '20260628_create_news_updates_table.sql',
    ]

    // Read all migration SQL content
    const migrations = migrationFiles.map(file => {
      const filePath = join(migrationsPath, file)
      try {
        const content = readFileSync(filePath, 'utf-8')
        return { file, content, success: true }
      } catch (error) {
        return {
          file,
          content: '',
          success: false,
          error: 'File not found',
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Database setup instructions',
        instructions: {
          method1: {
            title: 'Supabase CLI (Recommended)',
            steps: [
              'npm install -g supabase',
              'supabase login',
              'supabase link --project-ref pgfxoajmqhwfpcgxygyr',
              'supabase db push',
            ],
          },
          method2: {
            title: 'Manual SQL Execution',
            description:
              'Copy-paste each SQL file to Supabase SQL Editor in order',
            url: 'https://app.supabase.com/projects/pgfxoajmqhwfpcgxygyr/sql/new',
          },
        },
        migrations,
        projectId: 'pgfxoajmqhwfpcgxygyr',
      },
      { status: 200 }
    )
  } catch (error) {
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
