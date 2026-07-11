# Admin Panel CRUD Operations - Complete Fix Guide

## Overview
This document outlines all fixes applied to admin panel CRUD (Create, Read, Update, Delete) operations and database table setup.

## Issues Fixed

### 1. Inconsistent Client Usage in API Routes

**Problem**: Many API routes were using `createClient()` (regular authenticated client) instead of `createAdminClient()` for write operations (POST, PUT, DELETE). This caused permission issues and RLS policy failures.

**Solution**: All write operations now follow this pattern:
```typescript
// Check authentication with regular client
const userClient = await createClient()
const { data: { user }, error: authError } = await userClient.auth.getUser()
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Use admin client for database operations
const supabase = createAdminClient()
```

### 2. Routes Fixed

The following API routes have been fixed:

#### Trophies (`/app/api/admin/trophies/route.ts`)
- GET: Added auth check
- POST: Now uses `createAdminClient()`
- PUT: Now uses `createAdminClient()`
- DELETE: Now uses `createAdminClient()`

#### Injuries (`/app/api/admin/injuries/route.ts`)
- GET: Added auth check
- POST: Now uses `createAdminClient()`
- PUT: Now uses `createAdminClient()`
- DELETE: Now uses `createAdminClient()`

#### Store Products (`/app/api/admin/store/products/route.ts`)
- POST: Now uses `createAdminClient()`
- PUT: Now uses `createAdminClient()`
- DELETE: Now uses `createAdminClient()`

#### Media (`/app/api/admin/media/route.ts`)
- POST: Now uses `createAdminClient()`
- PUT: Now uses `createAdminClient()`
- DELETE: Now uses `createAdminClient()`

### 3. Database Migrations

All required tables have migration files in `/supabase/migrations/`:

**Core Tables:**
- `players` - Player information and statistics
- `matches` - Match details and scores
- `standings` - League standings
- `products` - Store products
- `trophies` - Team trophies and awards
- `gallery` - Gallery images
- `articles` - News and blog articles
- `match_lineups` - Player lineups for matches
- `match_events` - Match events (goals, cards, etc)

**Additional Tables:**
- `honours` - Player honours and awards
- `injuries` - Player injuries
- `player_positions` - Player position history
- `profiles` - User profiles
- `app_users` - Application users
- `contact_messages` - Contact form messages
- `otp_codes` - OTP verification codes
- `site_settings` - Global site settings
- `media_items` - Media library items
- `partners` - Partnership/sponsor information
- `news_items` - News articles
- `news_updates` - News updates

## Testing Checklist

- [ ] Players CRUD: Create, read, update, delete players
- [ ] Matches CRUD: Create, read, update, delete matches
- [ ] Trophies CRUD: Create, read, update, delete trophies
- [ ] Media CRUD: Create, read, update, delete media items
- [ ] Products CRUD: Create, read, update, delete products
- [ ] News CRUD: Create, read, update, delete news articles
- [ ] Contacts CRUD: View, update, delete contact messages
- [ ] Injuries CRUD: Create, read, update, delete injuries
- [ ] Gallery: Upload and manage gallery images

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Copy content from `supabase/migrations/` files
5. Paste and run each migration

### Option 2: CLI
```bash
npx supabase db push
```

### Option 3: Node Script
```bash
node scripts/run-all-migrations.js
```

## How to Test CRUD Operations

Visit the admin dashboard at `/admin/` to test all CRUD operations:

- **Dashboard** - `/admin/` - View analytics and stats
- **Squad Manager** - `/admin/squad-manager/` - Manage players
- **Matches** - `/admin/matches/` - Manage matches
- **Trophies** - `/admin/trophies/` - Manage trophies
- **Media** - `/admin/media/` - Manage gallery and media
- **News** - `/admin/news/` - Manage news articles
- **Contacts** - `/admin/contacts/` - View contact messages
- **Settings** - `/admin/settings/` - Manage settings

## Response Format Standardization

All API responses now follow a consistent format:

### Success Response
```typescript
// For GET/single operations
return NextResponse.json(data)

// For POST/creation
return NextResponse.json(data, { status: 201 })

// For PUT/update
return NextResponse.json(data)

// For DELETE
return NextResponse.json({ success: true }, { status: 200 })
```

### Error Response
```typescript
return NextResponse.json({ error: 'Error message' }, { status: 400 })
```

## Security Improvements

- All CRUD operations now properly authenticate users
- Admin client is only used for database operations after auth check
- RLS policies are respected through admin client
- Service role bypass is used appropriately for admin operations

## Related Files

- API Routes: `/app/api/admin/*/route.ts`
- Data Service: `/lib/data-service.ts`
- Migrations: `/supabase/migrations/`
- Admin Components: `/app/admin/**/page.tsx`

## Support

If CRUD operations fail:
1. Check that all migrations have been applied
2. Verify authentication is working (`/login`)
3. Check browser console for API error details
4. View server logs for detailed error messages
