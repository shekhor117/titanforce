#!/usr/bin/env node

/**
 * Script to fix all admin API routes to use the admin client instead of anon client
 * This ensures proper authentication and database access for admin operations
 */

const fs = require('fs');
const path = require('path');

const apiDir = '/vercel/share/v0-project/app/api/admin';

function fixApiFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Fix import statement
  if (content.includes("import { createClient } from '@/lib/supabase/server'")) {
    content = content.replace(
      "import { createClient } from '@/lib/supabase/server'",
      "import { createClient, createAdminClient } from '@/lib/supabase/server'"
    );
  }

  // Fix createClient() calls to createAdminClient() for database operations
  // But keep createClient() for auth checks
  
  // Pattern 1: const supabase = createClient() -> use both clients
  // First, replace auth check pattern to use userClient
  content = content.replace(
    /const supabase = createClient\(\)\s+const \{ data: \{ user \}, error: authError \} = await supabase\.auth\.getUser\(\)/g,
    'const userClient = createClient()\n    const { data: { user }, error: authError } = await userClient.auth.getUser()'
  );

  // Then replace database queries with admin client
  if (content.includes('const supabase = createClient()')) {
    // Find all occurrences and replace
    content = content.replace(
      /const supabase = createClient\(\)/g,
      'const userClient = createClient()\n    const supabase = createAdminClient()'
    );
  }

  // Fix error handling to include details
  content = content.replace(
    /console\.error\('\[v0\] Unexpected error:'\s*error\)\s*return NextResponse\.json\(\{ error: 'Internal server error' \}, \{ status: 500 \}\)/g,
    `console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })`
  );

  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

function findAndFixApiRoutes(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixedCount += findAndFixApiRoutes(fullPath);
    } else if (file === 'route.ts') {
      if (fixApiFile(fullPath)) {
        console.log(`✓ Fixed: ${fullPath}`);
        fixedCount++;
      } else {
        console.log(`- Skipped: ${fullPath} (no changes needed)`);
      }
    }
  });

  return fixedCount;
}

console.log('🔧 Starting API endpoint fixes...\n');
const fixed = findAndFixApiRoutes(apiDir);
console.log(`\n✅ Fixed ${fixed} API endpoints`);
