#!/usr/bin/env node

/**
 * Migration Runner - Executes all database migrations in order
 * Usage: node run-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, 'supabase', 'migrations');

// Migration files in order
const MIGRATION_FILES = [
  '20250505_role_tables.sql',
  '20250516_fix_rls_performance.sql',
  '20260516163423_create_is_admin_rpc.sql',
  '20260517193131_create_gallery_table.sql',
  '20260517195125_create_products_table.sql',
  '20260517195413_create_trophies_table.sql',
  '20260517202759_add_player_ranking_column.sql',
  '20260618_create_app_users_table.sql',
  '20260618_create_contact_messages_table.sql',
  '20260618_create_otp_codes_table.sql',
  '20260618_fix_contact_messages_rls.sql',
  '20260619_create_articles_table.sql',
  '20260619_create_events_table.sql',
  '20260619_create_pages_table.sql',
  '20260628_create_news_updates_table.sql',
];

async function runMigrations() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL environment variable is not set');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
    console.log(`\n📂 Running ${MIGRATION_FILES.length} migrations...\n`);

    let successCount = 0;
    let failureCount = 0;

    for (const file of MIGRATION_FILES) {
      try {
        const filePath = path.join(MIGRATIONS_DIR, file);
        
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  Skipped: ${file} (file not found)`);
          continue;
        }

        const sql = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`🔄 Running: ${file}`);
        await client.query(sql);
        console.log(`✅ Success: ${file}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error in ${file}:`);
        console.error(`   ${error.message}\n`);
        failureCount++;
      }
    }

    console.log('═══════════════════════════════════════');
    console.log(`📊 Migration Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failureCount}`);
    console.log(`   📈 Total: ${MIGRATION_FILES.length}`);
    console.log('═══════════════════════════════════════\n');

    if (failureCount === 0) {
      console.log('🎉 All migrations completed successfully!');
      console.log('✨ The database schema is now ready.');
      console.log('🚀 You can now use the contact form and other features.\n');
    } else {
      console.log('⚠️  Some migrations failed. Please check the errors above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Database connection closed');
  }
}

runMigrations();
