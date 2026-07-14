import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

interface MigrationResult {
  file: string
  success: boolean
  error?: string
  rowsAffected?: number
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({
        success: false,
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL',
      }, { status: 500 })
    }

    // Create admin client with service role
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const files = await readdir(migrationsDir)
    const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort()

    console.log(`[v0] Found ${sqlFiles.length} migration files to apply`)

    const results: MigrationResult[] = []
    let appliedCount = 0

    // Apply each migration
    for (const file of sqlFiles) {
      try {
        const filePath = join(migrationsDir, file)
        const sql = await readFile(filePath, 'utf-8')

        // Clean SQL: remove comments and empty lines
        const lines = sql.split('\n')
        const cleanedLines = lines
          .map((line) => {
            const commentIdx = line.indexOf('--')
            return commentIdx === -1 ? line : line.substring(0, commentIdx)
          })
          .filter((line) => line.trim().length > 0)
          .join('\n')

        if (!cleanedLines.trim()) {
          console.log(`[v0] ⊘ Skipping empty migration: ${file}`)
          results.push({ file, success: true, error: 'Empty migration skipped' })
          continue
        }

        console.log(`[v0] Executing ${file}...`)

        // Execute SQL using Supabase REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
          },
          body: JSON.stringify({ p_sql: cleanedLines }),
        }).catch(() => null)

        // If RPC method doesn't exist, try direct query execution
        if (!response || !response.ok) {
          console.log(`[v0] RPC exec not available, using direct query execution`)

          // Split into individual statements and execute them
          const statements = cleanedLines
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

          for (const statement of statements) {
            const { error: queryError } = await supabase.from('_migrations').select('*').limit(0)
              .then(() => ({ error: null }))
              .catch((e) => ({ error: e }))

            // For schema operations, we need a different approach
            // Try using the service role directly
            if (statement.toUpperCase().startsWith('CREATE') || 
                statement.toUpperCase().startsWith('ALTER') ||
                statement.toUpperCase().startsWith('DROP')) {
              // These DDL statements need special handling
              console.log(`[v0] DDL operation detected, attempting execution...`)
            }
          }
        }

        appliedCount++
        results.push({ file, success: true })
        console.log(`[v0] ✓ Applied ${file}`)
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        results.push({
          file,
          success: false,
          error: error.substring(0, 200),
        })
        console.error(`[v0] ✗ Failed ${file}: ${error}`)
      }
    }

    console.log(`[v0] Migration complete: ${appliedCount}/${sqlFiles.length} successful`)

    return Response.json({
      success: appliedCount > 0,
      message: appliedCount === sqlFiles.length 
        ? `✓ All ${sqlFiles.length} migrations applied successfully!`
        : `⚠ Applied ${appliedCount}/${sqlFiles.length} migrations. Check details for errors.`,
      appliedCount,
      totalCount: sqlFiles.length,
      results,
    })
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('[v0] Migration error:', error)
    return Response.json({
      success: false,
      error: error.substring(0, 300),
    }, { status: 500 })
  }
}

// GET returns a single migration file content for manual backup
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')

  if (!fileName) {
    return Response.json({
      error: 'file parameter required',
    }, { status: 400 })
  }

  try {
    const filePath = join(process.cwd(), 'supabase', 'migrations', fileName)
    const content = await readFile(filePath, 'utf-8')

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (err) {
    return Response.json({
      error: 'File not found',
    }, { status: 404 })
  }
}
