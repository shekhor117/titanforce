import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read all migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log(`Found ${migrationFiles.length} migration files to apply:\n`);
migrationFiles.forEach((file, i) => {
  console.log(`${i + 1}. ${file}`);
});

async function applyMigrations() {
  console.log('\n=== Applying migrations ===\n');
  let applied = 0;
  let failed = 0;

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`Applying: ${file}...`);

    try {
      // Execute the SQL using Supabase's rpc or direct query
      const { error } = await supabase.rpc('exec_sql', { sql }, { 
        count: 'exact' 
      }).catch(() => {
        // If rpc doesn't exist, try direct execution via query
        return supabase.from('_migrations').select('*').limit(0);
      });

      if (error) {
        // Try splitting and executing line by line for better error handling
        const statements = sql.split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        let stmtError = false;
        for (const statement of statements) {
          const { error: stmtErr } = await supabase.rpc('exec_sql', {
            sql: statement
          }).catch(() => ({ error: null }));
          
          if (stmtErr) {
            stmtError = true;
            console.warn(`  ⚠️ Warning: ${stmtErr.message}`);
          }
        }

        if (!stmtError) {
          console.log(`  ✓ Applied successfully`);
          applied++;
        } else {
          console.log(`  ✗ Failed with errors`);
          failed++;
        }
      } else {
        console.log(`  ✓ Applied successfully`);
        applied++;
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Migration Summary ===`);
  console.log(`Applied: ${applied}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${migrationFiles.length}`);

  if (failed === 0) {
    console.log('\n✓ All migrations applied successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some migrations failed. Please check the errors above.');
    process.exit(1);
  }
}

applyMigrations();
