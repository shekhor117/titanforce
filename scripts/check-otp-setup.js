#!/usr/bin/env node

/**
 * OTP Setup Status Checker
 * 
 * Usage: node scripts/check-otp-setup.js
 * 
 * This script checks if OTP sending is properly configured.
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== OTP Setup Status Checker ===\n');

let allGood = true;

// 1. Check environment variables
console.log('📋 Checking Environment Variables:\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const emailEnvVars = {
  brevo: ['BREVO_SMTP_HOST', 'BREVO_SMTP_USER', 'BREVO_SMTP_PASS'],
  resend: ['RESEND_API_KEY']
};

// Check Supabase
let supabaseConfigured = true;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar} - Set`);
  } else {
    console.log(`  ❌ ${envVar} - NOT SET`);
    supabaseConfigured = false;
    allGood = false;
  }
});

// Check Email Service
console.log('\n📧 Checking Email Service:\n');

const brevoConfigured = emailEnvVars.brevo.every(v => process.env[v]);
const resendConfigured = emailEnvVars.resend.every(v => process.env[v]);

if (brevoConfigured) {
  console.log('  ✅ Brevo SMTP configured');
} else {
  console.log('  ❌ Brevo SMTP NOT configured');
  if (process.env.BREVO_SMTP_HOST) console.log('     - BREVO_SMTP_HOST: Set');
  else console.log('     - BREVO_SMTP_HOST: NOT SET');
  if (process.env.BREVO_SMTP_USER) console.log('     - BREVO_SMTP_USER: Set');
  else console.log('     - BREVO_SMTP_USER: NOT SET');
  if (process.env.BREVO_SMTP_PASS) console.log('     - BREVO_SMTP_PASS: Set');
  else console.log('     - BREVO_SMTP_PASS: NOT SET');
}

if (resendConfigured) {
  console.log('  ✅ Resend API configured');
} else {
  console.log('  ❌ Resend API NOT configured');
  console.log('     - RESEND_API_KEY: NOT SET');
}

if (!brevoConfigured && !resendConfigured) {
  console.log('\n  ⚠️  No email service configured!');
  console.log('     In development: OTP codes will be logged to console');
  console.log('     In production: OTP sending will FAIL\n');
  allGood = false;
} else {
  console.log('  ✅ Email service is configured');
}

// 2. Check files exist
console.log('\n📁 Checking Required Files:\n');

const files = [
  'app/api/auth/send-otp/route.ts',
  'app/api/auth/verify-otp/route.ts',
  'app/admin/migrations/page.tsx',
  'supabase/migrations/20260702_create_otp_codes.sql'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    allGood = false;
  }
});

// 3. Summary
console.log('\n=== Setup Status ===\n');

if (supabaseConfigured && (brevoConfigured || resendConfigured)) {
  console.log('✅ OTP Sender is fully configured and ready!\n');
  console.log('Next steps:');
  console.log('  1. Create otp_codes table (run migration in /admin/migrations)');
  console.log('  2. Send test OTP: POST /api/auth/send-otp');
  console.log('  3. Verify OTP: POST /api/auth/verify-otp\n');
} else {
  console.log('⚠️  OTP Sender needs setup!\n');
  console.log('Missing configuration:');
  if (!supabaseConfigured) {
    console.log('  - Supabase credentials not set');
  }
  if (!brevoConfigured && !resendConfigured) {
    console.log('  - Email service not configured (Brevo or Resend)');
  }
  console.log('\nSee OTP_SETUP_INSTRUCTIONS.md for setup guide\n');
}

process.exit(allGood ? 0 : 1);
