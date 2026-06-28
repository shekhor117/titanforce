import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Migration status check...')
    
    // Return detailed instructions for manual migration
    return NextResponse.json(
      {
        success: false,
        status: 'schema_cache_not_initialized',
        message: 'Database schema needs to be initialized. Please run migrations using Supabase.',
        problem: 'The contact_messages table and other required tables are not found in the database schema cache.',
        solution: 'Run the database migrations to create all necessary tables and schema.',
        
        // Quick start method
        quickStart: {
          method: 'Supabase CLI (Recommended)',
          steps: [
            'npm install -g supabase',
            'supabase login',
            'supabase link --project-ref YOUR_PROJECT_ID',
            'supabase db push',
          ],
          projectIdLocation: 'Find your project ID at https://app.supabase.com in the project settings',
        },
        
        // Manual method
        manualMethod: {
          method: 'Supabase Dashboard',
          steps: [
            'Visit https://app.supabase.com',
            'Select your project',
            'Go to SQL Editor',
            'Create a new query',
            'Copy contents of each migration file (in order) from supabase/migrations/',
            'Run each migration',
          ],
        },
        
        // List all migrations in order
        migrationFiles: [
          {
            order: 1,
            file: '20250505_role_tables.sql',
            description: 'Base role and authentication tables'
          },
          {
            order: 2,
            file: '20250516_fix_rls_performance.sql',
            description: 'RLS performance optimizations'
          },
          {
            order: 3,
            file: '20260516163423_create_is_admin_rpc.sql',
            description: 'Admin check function'
          },
          {
            order: 4,
            file: '20260517193131_create_gallery_table.sql',
            description: 'Gallery storage table'
          },
          {
            order: 5,
            file: '20260517195125_create_products_table.sql',
            description: 'Store products table'
          },
          {
            order: 6,
            file: '20260517195413_create_trophies_table.sql',
            description: 'Team trophies'
          },
          {
            order: 7,
            file: '20260517202759_add_player_ranking_column.sql',
            description: 'Player ranking column'
          },
          {
            order: 8,
            file: '20260618_create_app_users_table.sql',
            description: 'Application users'
          },
          {
            order: 9,
            file: '20260618_create_contact_messages_table.sql',
            description: 'Contact form messages (CRITICAL for contact page)'
          },
          {
            order: 10,
            file: '20260618_create_otp_codes_table.sql',
            description: 'One-time password storage'
          },
          {
            order: 11,
            file: '20260618_fix_contact_messages_rls.sql',
            description: 'Contact messages RLS policies'
          },
          {
            order: 12,
            file: '20260619_create_articles_table.sql',
            description: 'News articles'
          },
          {
            order: 13,
            file: '20260619_create_events_table.sql',
            description: 'Calendar events'
          },
          {
            order: 14,
            file: '20260619_create_pages_table.sql',
            description: 'CMS pages'
          },
          {
            order: 15,
            file: '20260628_create_news_updates_table.sql',
            description: 'News updates'
          },
        ],
        
        documentation: 'See DATABASE_MIGRATION_SETUP.md for detailed instructions',
        support: 'If you need help, contact support at https://vercel.com/help',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Migration endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to check migration status',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
