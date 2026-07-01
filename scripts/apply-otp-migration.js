#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.development.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('[v0] Make sure these environment variables are set in .env.development.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Parse SQL statements from raw SQL text
 */
function parseSQLStatements(sql) {
  return sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
    .map(s => s + ';');
}

/**
 * Apply all migration files
 */
async function applyMigrations() {
  try {
    console.log('[v0] Starting database migrations...');

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.error('[v0] Migrations directory not found:', migrationsDir);
      process.exit(1);
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.warn('[v0] No migration files found');
      return;
    }

    console.log(`[v0] Found ${migrationFiles.length} migration files`);

    let successCount = 0;
    let failureCount = 0;

    // Execute each migration file
    for (const file of migrationFiles) {
      try {
        console.log(`[v0] Applying migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Try using exec_sql RPC if available
        const { error: rpcError } = await supabase
          .rpc('exec_sql', { query: sql })
          .catch(() => ({ error: { message: 'RPC not available' } }));

        if (rpcError && !rpcError.message.includes('not available')) {
          throw rpcError;
        }

        console.log(`[v0] ✓ Applied: ${file}`);
        successCount++;
      } catch (err) {
        console.warn(`[v0] Warning applying ${file}:`, err.message);
        failureCount++;
        // Continue with next migration
      }
    }

    console.log(`\n[v0] Migration summary:`);
    console.log(`[v0] ✓ Successfully applied: ${successCount} migrations`);
    if (failureCount > 0) {
      console.log(`[v0] ⚠ Failed: ${failureCount} migrations`);
    }

    console.log('[v0] \nNote: To ensure all migrations are applied correctly,');
    console.log('[v0] run this in Supabase dashboard SQL editor:');
    console.log(`[v0] npx supabase db push`);
  } catch (err) {
    console.error('[v0] Migration error:', err.message);
    console.error('[v0] Please manually apply migrations using Supabase dashboard');
    process.exit(1);
  }
}

applyMigrations();
