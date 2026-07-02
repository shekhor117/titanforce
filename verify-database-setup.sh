#!/bin/bash

# Database Setup Verification Script
# This script checks if your Supabase database is properly configured

echo "🔍 Checking Titan Force Database Setup..."
echo "=================================="

# Check 1: Environment Variables
echo ""
echo "1️⃣  Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
    echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
else
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    echo "   Key: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
else
    echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
fi

# Check 2: Migration Files
echo ""
echo "2️⃣  Checking migration files..."
if [ -f "supabase/migrations/20260702_setup_complete_db_schema.sql" ]; then
    echo "✅ Complete database schema migration file exists"
    LINE_COUNT=$(wc -l < supabase/migrations/20260702_setup_complete_db_schema.sql)
    echo "   File size: $LINE_COUNT lines"
else
    echo "❌ Complete database schema migration file not found"
fi

# Check 3: Data Service Files
echo ""
echo "3️⃣  Checking data service files..."
if [ -f "lib/data-service.ts" ]; then
    echo "✅ data-service.ts exists"
    if grep -q "async getPlayers" lib/data-service.ts; then
        echo "   - getPlayers() method found"
    fi
    if grep -q "async getMatches" lib/data-service.ts; then
        echo "   - getMatches() method found"
    fi
else
    echo "❌ data-service.ts not found"
fi

if [ -f "lib/store-data-service.ts" ]; then
    echo "✅ store-data-service.ts exists"
    if grep -q "async getFeaturedProducts" lib/store-data-service.ts; then
        echo "   - getFeaturedProducts() method found"
    fi
else
    echo "❌ store-data-service.ts not found"
fi

# Check 4: Admin API Routes
echo ""
echo "4️⃣  Checking admin API routes..."
ADMIN_ROUTES=$(find app/api/admin -name "route.ts" 2>/dev/null | wc -l)
if [ "$ADMIN_ROUTES" -gt 0 ]; then
    echo "✅ Found $ADMIN_ROUTES admin API route files"
    find app/api/admin -name "route.ts" 2>/dev/null | head -5 | sed 's/^/   - /'
else
    echo "❌ No admin API routes found"
fi

# Check 5: Admin Components
echo ""
echo "5️⃣  Checking admin components..."
ADMIN_PAGES=$(find app/admin -name "page.tsx" 2>/dev/null | wc -l)
if [ "$ADMIN_PAGES" -gt 0 ]; then
    echo "✅ Found $ADMIN_PAGES admin page components"
else
    echo "❌ No admin pages found"
fi

# Check 6: App Build Status
echo ""
echo "6️⃣  Checking app build..."
if [ -d ".next" ]; then
    echo "✅ Build directory exists (.next)"
else
    echo "⚠️  Build directory not found - run 'pnpm build'"
fi

# Summary
echo ""
echo "=================================="
echo "📋 Summary"
echo "=================================="
echo ""
echo "To complete setup:"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your 'titanforce' project"
echo "3. Open SQL Editor → New Query"
echo "4. Copy entire contents of:"
echo "   supabase/migrations/20260702_setup_complete_db_schema.sql"
echo "5. Paste and click Run"
echo "6. Refresh website at http://localhost:3000"
echo ""
echo "Then use admin panel at /admin to add your data!"
echo ""
