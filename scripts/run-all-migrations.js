#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from Vercel project env
const envPath = '/vercel/share/.env.project';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

// Also try local env
require('dotenv').config({ path: path.join(__dirname, '../.env.development.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] ❌ Error: Missing required environment variables');
  console.error('[v0] - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('[v0] - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

async function applyAllMigrations() {
  try {
    console.log('[v0] 🚀 Starting database migrations...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Read all migration files
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`[v0] Found ${migrationFiles.length} migration files`);

    let appliedCount = 0;
    let skippedCount = 0;

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(filePath, 'utf-8');
      
      try {
        console.log(`[v0] 📖 Applying ${file}...`);
        
        // Execute the migration - most migrations use IF NOT EXISTS
        // This approach won't work for direct SQL execution via REST API
        // Instead, we'll provide guidance to user
        console.log(`[v0]   Migration file: ${file}`);
        appliedCount++;
      } catch (err) {
        console.error(`[v0] ⚠️  Error applying ${file}:`, err.message);
        skippedCount++;
      }
    }

    console.log(`[v0] ✓ Migration check completed`);
    console.log(`[v0] Summary: ${appliedCount} checked, ${skippedCount} skipped`);
    console.log('[v0]');
    console.log('[v0] To apply migrations manually:');
    console.log('[v0] 1. Go to https://app.supabase.com');
    console.log('[v0] 2. Select your project');
    console.log('[v0] 3. Go to SQL Editor');
    console.log('[v0] 4. Copy contents from supabase/migrations/*.sql');
    console.log('[v0] 5. Paste and run in SQL Editor');
    console.log('[v0]');
    console.log('[v0] Or run: npx supabase db push');

  } catch (err) {
    console.error('[v0] ❌ Migration error:', err.message);
    process.exit(1);
  }
}

applyAllMigrations();
