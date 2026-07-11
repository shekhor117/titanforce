#!/usr/bin/env node

/**
 * Diagnostic and Auto-Fix Script for Admin Panel Issues
 * Checks for common problems and provides solutions
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

async function runDiagnostics() {
  section('ADMIN PANEL DIAGNOSTIC CHECK');

  // Load environment variables
  require('dotenv').config({ path: path.join(__dirname, '../.env.development.local') });
  const envPath = '/vercel/share/.env.project';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2];
    });
  }

  // Check 1: Supabase Configuration
  log('1. Checking Supabase Configuration...', 'blue');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    log('   ✗ NEXT_PUBLIC_SUPABASE_URL not set', 'red');
  } else {
    log(`   ✓ Supabase URL configured: ${supabaseUrl.substring(0, 20)}...`, 'green');
  }

  if (!supabaseKey) {
    log('   ✗ NEXT_PUBLIC_SUPABASE_ANON_KEY not set', 'red');
  } else {
    log('   ✓ Supabase anon key configured', 'green');
  }

  if (!serviceKey) {
    log('   ⚠ SUPABASE_SERVICE_ROLE_KEY not set (needed for admin operations)', 'yellow');
  } else {
    log('   ✓ Service role key configured', 'green');
  }

  // Check 2: Migration Files
  log('\n2. Checking Migration Files...', 'blue');
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  if (!fs.existsSync(migrationsDir)) {
    log('   ✗ Migrations directory not found', 'red');
  } else {
    const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    log(`   ✓ Found ${migrations.length} migration files`, 'green');
    
    const hasMainSchema = migrations.some(f => f.includes('setup_complete'));
    if (hasMainSchema) {
      log('   ✓ Main schema migration file found', 'green');
    } else {
      log('   ⚠ Main schema migration file not found', 'yellow');
    }
  }

  // Check 3: Admin Scripts
  log('\n3. Checking Admin Setup Scripts...', 'blue');
  const scripts = ['create-admin.js', 'create-test-user.js', 'run-all-migrations.js'];
  scripts.forEach(script => {
    const scriptPath = path.join(__dirname, script);
    if (fs.existsSync(scriptPath)) {
      log(`   ✓ ${script} exists`, 'green');
    } else {
      log(`   ✗ ${script} missing`, 'red');
    }
  });

  // Check 4: Documentation
  log('\n4. Checking Documentation...', 'blue');
  const docs = [
    'FIX_LOGIN_AND_CONTENT_ISSUES.md',
    'ADMIN_SYNC_GUIDE.md',
    'COMPLETE_ADMIN_SETUP_GUIDE.md',
  ];
  docs.forEach(doc => {
    const docPath = path.join(__dirname, '../', doc);
    if (fs.existsSync(docPath)) {
      log(`   ✓ ${doc} exists`, 'green');
    } else {
      log(`   ⚠ ${doc} not found`, 'yellow');
    }
  });

  // Summary and Next Steps
  section('RECOMMENDED NEXT STEPS');

  if (supabaseUrl && supabaseKey) {
    log('✓ Environment is configured', 'green');
    log('\nTo complete setup:\n', 'cyan');
    log('1. Create Admin User:', 'yellow');
    log('   node scripts/create-admin.js\n', 'blue');
    log('2. Apply Database Migrations:', 'yellow');
    log('   Visit: https://app.supabase.com → SQL Editor', 'blue');
    log('   Open: supabase/migrations/20260702_setup_complete_db_schema.sql', 'blue');
    log('   Copy and paste the entire content, then click RUN\n', 'blue');
    log('3. Test Login:', 'yellow');
    log('   URL: http://localhost:3000/admin/login', 'blue');
    log('   Email: admin@titanforce.com', 'blue');
    log('   Password: Admin123456!\n', 'blue');
  } else {
    log('✗ Environment variables missing', 'red');
    log('\nPlease set up Supabase first:', 'yellow');
    log('1. Create a Supabase project at https://supabase.com', 'blue');
    log('2. Get your credentials from Project Settings → API', 'blue');
    log('3. Add to .env.development.local or Vercel project settings\n', 'blue');
  }

  log('Full documentation: Read FIX_LOGIN_AND_CONTENT_ISSUES.md', 'cyan');
}

// Run diagnostics
runDiagnostics().catch(error => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});
