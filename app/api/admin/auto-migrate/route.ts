import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

// This endpoint provides migration files for manual execution in Supabase
export async function POST(request: Request) {
  try {
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const files = await readdir(migrationsDir)
    const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort()

    console.log(`[v0] Found ${sqlFiles.length} migration files`)

    const results: Array<{
      file: string
      content: string
      success: boolean
    }> = []

    // Read all migration files
    for (const file of sqlFiles) {
      try {
        const filePath = join(migrationsDir, file)
        const content = await readFile(filePath, 'utf-8')

        results.push({
          file,
          content,
          success: true,
        })
        console.log(`[v0] ✓ Read ${file}`)
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        console.error(`[v0] ✗ Failed to read ${file}: ${error}`)
        results.push({
          file,
          content: '',
          success: false,
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return Response.json({
      success: true,
      message: `Ready to migrate ${successCount}/${sqlFiles.length} files`,
      instructions: `
        1. Go to Supabase Dashboard > SQL Editor
        2. For each migration file below, copy the SQL content
        3. Create a new query in SQL Editor
        4. Paste the SQL content
        5. Click "Run"
        6. All tables, RLS policies, and indexes will be created
      `,
      results,
    })
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('[v0] Error reading migrations:', error)
    return Response.json({
      success: false,
      error,
    }, { status: 500 })
  }
}

// GET returns a single migration file content
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
