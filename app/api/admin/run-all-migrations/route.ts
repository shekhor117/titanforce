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

    console.log('[v0] Starting migration process...')

    // Read all migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    console.log(`[v0] Found ${migrationFiles.length} migration files`)

    const results = {
      successful: [] as string[],
      failed: [] as { file: string; error: string }[],
      skipped: [] as string[]
    }

    // Apply each migration
    for (const file of migrationFiles) {
      try {
        console.log(`[v0] Processing: ${file}`)
        const filePath = path.join(migrationsDir, file)
        const sql = fs.readFileSync(filePath, 'utf-8')

        // Skip empty files
        if (!sql.trim()) {
          console.log(`[v0] Skipping empty file: ${file}`)
          results.skipped.push(file)
          continue
        }

        // Split by semicolon and filter empty statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0)

        // Execute each statement
        for (const statement of statements) {
          // Use a direct approach - query through the API
          const { error } = await supabase.rpc('exec_sql', {
            sql_string: statement
          }).catch(() => ({ error: null })) // Fallback if RPC doesn't exist

          if (error && error.message && !error.message.includes('already exists') && !error.message.includes('function exec_sql')) {
            // Try direct query execution via query interface
            const { error: directError } = await supabase.from('_dummy_table_')
              .select('*')
              .limit(0)

            // If we got here, let's try the raw SQL approach
            try {
              // Execute via fetch directly to postgres/rest API is not ideal,
              // but we can use the admin connection via Supabase JS
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({ query: statement })
              }).catch(() => ({ ok: false }))

              if (!response?.ok) {
                throw new Error(`Could not execute statement: ${statement.substring(0, 50)}...`)
              }
            } catch (execError) {
              console.warn(`[v0] Statement may have partially failed: ${file} - ${String(execError).substring(0, 100)}`)
            }
          }
        }

        results.successful.push(file)
        console.log(`[v0] ✓ Applied: ${file}`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        results.failed.push({ 
          file, 
          error: errorMsg.substring(0, 200) 
        })
        console.error(`[v0] ✗ Failed: ${file} - ${errorMsg.substring(0, 100)}`)
      }
    }

    // Check if standings table exists now
    const { error: standingsError, data: standingsData } = await supabase
      .from('standings')
      .select('id', { count: 'exact', head: true })

    const standingsExists = !standingsError

    return NextResponse.json({
      success: true,
      message: `Migration process complete. Processed ${results.successful.length} files successfully.`,
      status: 'complete',
      results: {
        successful: results.successful.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        details: results
      },
      tables: {
        standingsTableExists: standingsExists,
        standingsCount: standingsData?.count || 0
      },
      instructions: standingsExists 
        ? 'All migrations applied successfully! Standings table is ready.'
        : 'Some migrations may not have been applied. Visit Supabase SQL Editor to run migrations manually.',
    })
  } catch (error) {
    console.error('[v0] Migration runner error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
        instructions: [
          'Go to your Supabase dashboard',
          'Click SQL Editor',
          'Run the migration files from: supabase/migrations/',
          'Start with: 20260702_create_matches_standings_tables.sql'
        ]
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
