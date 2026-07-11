#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
const postgresUrl = process.env.POSTGRES_URL;

if (!supabaseUrl || !postgresUrl) {
  console.error('[v0] ❌ Error: Missing required environment variables');
  console.error('[v0] - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('[v0] - POSTGRES_URL:', postgresUrl ? '✓' : '✗');
  process.exit(1);
}

async function applyMigration() {
  try {
    console.log('[v0] 🚀 Starting OTP table migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260702_create_otp_codes.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('[v0] ❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('[v0] 📖 Read migration file successfully');
    console.log('[v0] 🔗 Using PostreSQL URL:', postgresUrl.substring(0, 20) + '...');
    
    // Use pg library to connect directly to the database
    const { Client } = require('pg');
    const client = new Client({
      connectionString: postgresUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('[v0] 📡 Connecting to database...');
    await client.connect();
    console.log('[v0] ✓ Connected to database');

    // Execute the migration
    console.log('[v0] 🔨 Executing migration SQL...');
    await client.query(migrationSQL);
    
    console.log('[v0] ✓ Migration completed successfully!');
    console.log('[v0] ✓ OTP table has been created');
    console.log('[v0] ✓ Indexes created');
    console.log('[v0] ✓ Row-level security enabled');
    console.log('[v0] ✓ Auto-cleanup function created');
    
    await client.end();
    
    console.log('[v0] ✅ Ready! You can now use OTP functionality.');
    
  } catch (err) {
    console.error('[v0] ❌ Migration error:', err.message);
    
    if (err.code === 'ENOENT') {
      console.error('[v0] Migration file not found. Expected at:', '/supabase/migrations/20260702_create_otp_codes.sql');
    } else if (err.code === 'MODULE_NOT_FOUND' && err.message.includes('pg')) {
      console.error('[v0] The "pg" package is not installed.');
      console.error('[v0] Run: npm install pg');
    } else if (err.message?.includes('relation') || err.message?.includes('already exists')) {
      console.log('[v0] ✓ OTP table already exists, skipping creation');
    } else {
      console.error('[v0] Please try running the migration manually:');
      console.error('[v0] 1. Go to https://app.supabase.com');
      console.error('[v0] 2. Select your project and go to SQL Editor');
      console.error('[v0] 3. Open the file: supabase/migrations/20260702_create_otp_codes.sql');
      console.error('[v0] 4. Copy and paste the entire content');
      console.error('[v0] 5. Click Run');
    }
    
    process.exit(1);
  }
}

applyMigration();
