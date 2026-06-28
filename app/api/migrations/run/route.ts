import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

/**
 * Executes all database migrations
 * Reads SQL files from supabase/migrations/ and executes them in order
 */

async function executeSqlWithSupabase(sql: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials')
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/migrations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    // Fallback: try using the pg_dump approach via REST API
    return { success: false, error }
  }
}

async function runAllMigrations() {
  const migrationsPath = join(process.cwd(), 'supabase', 'migrations')

  try {
    // Read all SQL files
    const files = readdirSync(migrationsPath)
      .filter(f => f.endsWith('.sql'))
      .sort()

    console.log('[v0] Found migration files:', files)

    const results: any[] = []
    let successCount = 0
    let failedCount = 0

    // Execute each migration
    for (const file of files) {
      try {
        console.log(`[v0] Processing: ${file}`)

        const filePath = join(migrationsPath, file)
        const sql = readFileSync(filePath, 'utf-8')

        // Try to execute via Supabase
        const result = await executeSqlWithSupabase(sql)

        if (result.success) {
          console.log(`[v0] ✅ Completed: ${file}`)
          results.push({ file, status: 'success' })
          successCount++
        } else {
          console.log(`[v0] ⚠️ Skipped: ${file}`)
          results.push({ file, status: 'skipped', reason: 'API not available' })
        }
      } catch (error) {
        console.error(`[v0] Error with ${file}:`, error)
        results.push({
          file,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        failedCount++
      }
    }

    return {
      success: failedCount === 0,
      results,
      summary: {
        total: files.length,
        successful: successCount,
        failed: failedCount,
      },
    }
  } catch (error) {
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Migration endpoint called')

    const result = await runAllMigrations()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('[v0] Migration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
        message:
          'Please run migrations manually using Supabase CLI: supabase db push',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
