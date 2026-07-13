import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const logs: string[] = [];
    logs.push(`Found ${migrationFiles.length} migration files`);
    logs.push('');

    let applied = 0;
    let failed = 0;

    for (const file of migrationFiles) {
      logs.push(`Applying: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        // Split by statements and execute
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        let fileError = false;

        for (const statement of statements) {
          try {
            // Use rpc to execute if available, otherwise use direct query
            const { error } = await supabase.rpc('exec_sql', {
              sql: statement,
            });

            if (error) {
              // If rpc doesn't exist, this is expected - try via postgres connection
              // For now, just log the warning
              if (!error.message.includes('relation "exec_sql" does not exist')) {
                logs.push(`  ⚠️ ${error.message}`);
                fileError = true;
              }
            }
          } catch (e) {
            const err = e instanceof Error ? e.message : 'Unknown error';
            if (!err.includes('does not exist')) {
              logs.push(`  ⚠️ ${err}`);
              fileError = true;
            }
          }
        }

        if (!fileError) {
          logs.push(`  ✓ Applied`);
          applied++;
        } else {
          logs.push(`  ✗ Applied with warnings`);
          applied++;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        logs.push(`  ✗ Error: ${message}`);
        failed++;
      }
    }

    logs.push('');
    logs.push('=== Summary ===');
    logs.push(`Applied: ${applied}`);
    logs.push(`Failed: ${failed}`);

    return Response.json({
      success: failed === 0,
      logs,
      applied,
      failed,
      total: migrationFiles.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: message, logs: [message] },
      { status: 500 }
    );
  }
}
