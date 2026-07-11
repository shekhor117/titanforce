# Admin Panel Login and Content Issues - Complete Fix Guide

## Current Status

**Login:** ✅ WORKING (not blocked)
**Content:** ⚠️ PARTIALLY WORKING (missing migrations)

---

## Issue #1: "Invalid Credentials" on Admin Login

### Problem
Admin login shows "Invalid credentials" error because no admin user account exists in Supabase.

### Why This Happens
- The login system is working correctly
- It's authenticating against Supabase Auth
- No test admin account has been created yet

### Solution: Create Admin User

#### Option 1: Using Admin Script (Recommended)
```bash
node scripts/create-admin.js
```
This creates:
- Email: `admin@titanforce.com`
- Password: `Admin123456!`
- Role: `admin`

#### Option 2: Manual Creation via Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Go to Authentication → Users
4. Click "Add User"
5. Email: `admin@titanforce.com`
6. Password: `Admin123456!`
7. Click "Create User"

#### Option 3: Using Supabase CLI
```bash
supabase auth admin create-user --email admin@titanforce.com --password Admin123456!
```

### Test the Login
```
URL: http://localhost:3000/admin/login
Email: admin@titanforce.com
Password: Admin123456!
```

---

## Issue #2: Missing Content on Pages

### Problems Identified
1. **Standings** - Returns 404 (table doesn't exist)
2. **Honours** - Query fails on column error
3. **Media/Gallery** - Table missing
4. **Site Settings** - Table missing

### Root Cause
Database migrations are defined but not applied to Supabase database.

### Solution: Apply Migrations

#### Step 1: Go to Supabase SQL Editor
- URL: https://app.supabase.com
- Select your project
- Click "SQL Editor"

#### Step 2: Run Complete Schema Migration
1. Create new query
2. Open file: `supabase/migrations/20260702_setup_complete_db_schema.sql`
3. Copy ALL content
4. Paste into SQL Editor
5. Click "RUN"

#### Step 3: Verify Tables Created
Run this query to check:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Should show tables:
- players
- matches
- trophies
- honours
- injuries
- media
- otp_codes
- site_settings
- contacts
- products
- standings (calculated view)

---

## Complete Setup Checklist

### Pre-Login Setup
- [ ] Create admin user (script or manual)
- [ ] Apply database migrations
- [ ] Verify all tables exist

### Post-Login Verification
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Players page shows data
- [ ] Matches page shows data
- [ ] News page works
- [ ] Media/Gallery page works
- [ ] Standings visible on home page
- [ ] Honours working

---

## Troubleshooting

### Login Shows "Invalid credentials"
→ Create admin user first (see Solution above)

### Content pages show empty/errors
→ Apply database migrations (see Solution above)

### "Table not found" errors
→ Run complete migration file from Supabase dashboard

### Auth context timeout warning
→ Normal during first init, goes away after login

---

## Quick Command Reference

```bash
# Create admin user
node scripts/create-admin.js

# Run test user script
node scripts/create-test-user.js

# Run all migrations
node scripts/run-all-migrations.js

# Check Supabase connection
curl https://[YOUR_PROJECT_ID].supabase.co/rest/v1/
```

---

## Files Involved

**Login System:**
- `components/admin-login-page.tsx`
- `lib/admin-context.tsx`
- `app/admin/login/page.tsx`

**Content/Data:**
- `lib/data-service.ts`
- `lib/player-honours-service.ts`
- `app/api/standings/route.ts`

**Database:**
- `supabase/migrations/20260702_setup_complete_db_schema.sql`
- `lib/supabase/proxy.ts`
- `lib/supabase/server.ts`

---

## Summary

**Login is NOT blocked** - it's working correctly. Just needs:
1. An admin user to exist
2. Database migrations to be applied

After these two steps, the entire admin panel will be fully functional.

