# Admin Panel CRUD Verification Checklist

## Overview
This document provides a comprehensive checklist to verify all CRUD (Create, Read, Update, Delete) operations in the admin panel.

**Last Updated:** 2026-07-07
**Status:** Ready for Testing

---

## 1. DASHBOARD & CORE FEATURES

### 1.1 Admin Dashboard
- **Endpoint:** `/admin` or `/admin/dashboard`
- **Read (GET):** Dashboard displays key metrics
  - [ ] Analytics data loads
  - [ ] Recent activity displays
  - [ ] User stats show correctly

---

## 2. PLAYERS MANAGEMENT

### 2.1 Players CRUD
- **API Endpoint:** `/api/admin/players`
- **Database Table:** `players`

#### Create (POST)
- [ ] Add new player with validation
- [ ] Validates required fields (name, number, position)
- [ ] Photo upload works
- [ ] Handles duplicate entries

#### Read (GET)
- [ ] List all players
- [ ] Get specific player by ID
- [ ] Filter by position
- [ ] Sort by number

#### Update (PUT)
- [ ] Update player details
- [ ] Update player photo
- [ ] Validate changes before saving
- [ ] Concurrent updates handled

#### Delete (DELETE)
- [ ] Delete player record
- [ ] Cascade delete player data
- [ ] Confirm deletion before removing
- [ ] Cannot delete active player if tied to matches

**Test Command:**
```bash
# Read all
curl http://localhost:3000/api/admin/players

# Read specific
curl http://localhost:3000/api/admin/players?id=<player_id>

# Create
curl -X POST http://localhost:3000/api/admin/players \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","number":10,"position":"Midfielder"}'

# Update
curl -X PUT http://localhost:3000/api/admin/players \
  -H "Content-Type: application/json" \
  -d '{"id":"<id>","name":"Updated Name"}'

# Delete
curl -X DELETE http://localhost:3000/api/admin/players \
  -H "Content-Type: application/json" \
  -d '{"id":"<id>"}'
```

---

## 3. NEWS MANAGEMENT

### 3.1 News Updates CRUD
- **API Endpoint:** `/api/admin/news`
- **Database Table:** `news_updates`

#### Create (POST)
- [ ] Create news article
- [ ] Set publication status (draft/published)
- [ ] Add featured image
- [ ] Schedule publish date
- [ ] Editor content works (rich text)

#### Read (GET)
- [ ] List all news articles
- [ ] Get specific article by ID
- [ ] Filter by status (published/draft)
- [ ] Sort by date
- [ ] Pagination works

#### Update (PUT)
- [ ] Edit article content
- [ ] Update status
- [ ] Change featured image
- [ ] Save drafts
- [ ] Update publish date

#### Delete (DELETE)
- [ ] Delete article
- [ ] Delete associated images
- [ ] Soft delete vs hard delete handling

**Status:** Check API implementation in `/app/api/admin/news/route.ts`

---

## 4. MATCHES MANAGEMENT

### 4.1 Matches CRUD
- **API Endpoint:** `/api/admin/matches`
- **Database Table:** `matches`

#### Create (POST)
- [ ] Create new match
- [ ] Set opponent
- [ ] Set date/time
- [ ] Set venue
- [ ] Validation for required fields

#### Read (GET)
- [ ] List all matches
- [ ] Get specific match
- [ ] Filter by date range
- [ ] Filter by status (upcoming/completed/cancelled)
- [ ] Sort by date

#### Update (PUT)
- [ ] Update match details
- [ ] Update score (for completed matches)
- [ ] Update lineup
- [ ] Change status

#### Delete (DELETE)
- [ ] Delete match
- [ ] Delete associated lineup
- [ ] Cascade delete match stats

**Status:** Check API implementation in `/app/api/admin/matches/route.ts`

---

## 5. STORE MANAGEMENT

### 5.1 Products CRUD
- **API Endpoint:** `/api/admin/store/products`
- **Database Table:** `products`

#### Create (POST)
- [ ] Create new product
- [ ] Set name, description, price
- [ ] Upload product image
- [ ] Set category
- [ ] Set stock quantity
- [ ] SKU generation

#### Read (GET)
- [ ] List all products
- [ ] Get specific product
- [ ] Pagination with limit/offset
- [ ] Filter by category
- [ ] Search products

#### Update (PUT)
- [ ] Update product details
- [ ] Update price
- [ ] Update inventory
- [ ] Update images
- [ ] Change category

#### Delete (DELETE)
- [ ] Delete product
- [ ] Archive vs delete
- [ ] Cannot delete if in orders

**Test Command:**
```bash
# Read all
curl http://localhost:3000/api/admin/store/products

# Read specific
curl http://localhost:3000/api/admin/store/products?id=<product_id>

# Pagination
curl http://localhost:3000/api/admin/store/products?limit=10&offset=0
```

### 5.2 Orders CRUD
- **API Endpoint:** `/api/admin/store/orders`
- **Database Table:** `orders`

#### Read (GET)
- [ ] List all orders
- [ ] Get specific order
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Calculate totals

#### Update (PUT)
- [ ] Update order status
- [ ] Add tracking number
- [ ] Update delivery info

#### Delete (DELETE) - Rarely used
- [ ] Archive cancelled orders
- [ ] Cannot delete completed orders

### 5.3 Inventory CRUD
- **API Endpoint:** `/api/admin/store/inventory`
- **Database Table:** `inventory`

#### Read (GET)
- [ ] List inventory items
- [ ] Get stock levels
- [ ] Low stock alerts

#### Update (PUT)
- [ ] Update stock quantity
- [ ] Update reorder levels
- [ ] Track inventory adjustments

#### Create (POST)
- [ ] Add inventory record
- [ ] Track received shipments

---

## 6. STANDINGS MANAGEMENT

### 6.1 Standings CRUD
- **API Endpoint:** `/api/admin/standings`
- **Database Table:** `standings`

#### Create (POST)
- [ ] Create standings record
- [ ] Initialize for league season

#### Read (GET)
- [ ] List standings
- [ ] Get specific team standing
- [ ] Sort by points/goal difference

#### Update (PUT)
- [ ] Update points
- [ ] Update wins/draws/losses
- [ ] Update goals for/against
- [ ] Auto-calculation of points

#### Delete (DELETE)
- [ ] Delete standings (rarely used)

---

## 7. INJURIES MANAGEMENT

### 7.1 Injuries CRUD
- **API Endpoint:** `/api/admin/injuries`
- **Database Table:** `injuries`

#### Create (POST)
- [ ] Report new injury
- [ ] Select affected player
- [ ] Set injury type
- [ ] Estimate recovery date

#### Read (GET)
- [ ] List all injuries
- [ ] Get player injury history
- [ ] Filter by status (active/recovered)
- [ ] Show recovery timeline

#### Update (PUT)
- [ ] Update injury status
- [ ] Update recovery date
- [ ] Add medical notes

#### Delete (DELETE)
- [ ] Archive injury record

---

## 8. TROPHIES MANAGEMENT

### 8.1 Trophies CRUD
- **API Endpoint:** `/api/admin/trophies`
- **Database Table:** `trophies`

#### Create (POST)
- [ ] Add new trophy
- [ ] Set season/year
- [ ] Upload trophy image
- [ ] Set achievement type

#### Read (GET)
- [ ] List all trophies
- [ ] Get trophy details
- [ ] Filter by season

#### Update (PUT)
- [ ] Update trophy info
- [ ] Update image
- [ ] Edit description

#### Delete (DELETE)
- [ ] Delete trophy record

---

## 9. FANS MANAGEMENT

### 9.1 Fans CRUD
- **API Endpoint:** `/api/admin/fans`
- **Database Table:** `fans`

#### Read (GET)
- [ ] List all fans
- [ ] Get fan engagement stats
- [ ] Filter by join date

#### Update (PUT)
- [ ] Update fan status
- [ ] Verify fan accounts
- [ ] Update fan tier/status

#### Delete (DELETE)
- [ ] Remove inactive fans
- [ ] Process unsubscribe requests

---

## 10. ANALYTICS

### 10.1 Analytics Dashboard
- **API Endpoint:** `/api/admin/analytics`

#### Read (GET)
- [ ] Page views analytics
- [ ] User engagement
- [ ] Traffic sources
- [ ] Device breakdown
- [ ] Custom date ranges

---

## 11. SETTINGS & USER MANAGEMENT

### 11.1 Settings CRUD
- **API Endpoint:** `/api/admin/settings`
- **Database Table:** `settings`

#### Read (GET)
- [ ] Get all settings
- [ ] Get setting by key

#### Update (PUT)
- [ ] Update team name
- [ ] Update team logo
- [ ] Update contact info
- [ ] Update social links
- [ ] Update site settings

#### Create (POST)
- [ ] Add new setting

### 11.2 User Management CRUD
- **API Endpoint:** `/api/admin/users`
- **Database Table:** `auth.users` / `app_users`

#### Read (GET)
- [ ] List all users
- [ ] Get user details
- [ ] Filter by role
- [ ] Filter by status

#### Update (PUT)
- [ ] Update user role
- [ ] Update user status
- [ ] Update user email
- [ ] Reset password

#### Delete (DELETE)
- [ ] Deactivate user
- [ ] Soft delete user
- [ ] Hard delete if needed

#### Create (POST)
- [ ] Create new admin user
- [ ] Send invitation email
- [ ] Set permissions

---

## ADDITIONAL SYSTEMS

### 12.1 Lineups Management
- **API Endpoint:** `/api/admin/lineup`
- **Database Table:** `lineups`
- [ ] Create match lineup
- [ ] Get lineup by match
- [ ] Update player positions
- [ ] Substitutions management

### 12.2 Player Profiles
- **API Endpoint:** `/api/admin/player-profiles`
- [ ] Create detailed player profile
- [ ] Update statistics
- [ ] Career history

### 12.3 Rankings
- **API Endpoint:** `/api/admin/rankings`
- [ ] Top scorers list
- [ ] Most assists
- [ ] Best goalkeeper
- [ ] Best defender

### 12.4 Man of the Match (MOTM)
- **API Endpoint:** `/api/admin/motm`
- [ ] Select MOTM for match
- [ ] Update MOTM record
- [ ] View MOTM history

---

## API RESPONSE STANDARDS

All endpoints should follow these patterns:

### Success Response (200)
```json
{
  "data": { /* record or array of records */ },
  "message": "Operation successful"
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message",
  "status": 400,
  "code": "ERROR_CODE"
}
```

### Pagination Response
```json
{
  "data": [],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

---

## AUTHENTICATION REQUIREMENTS

- [ ] All admin endpoints require authentication
- [ ] Admin role check implemented
- [ ] Session validation on each request
- [ ] Token refresh handling
- [ ] Logout clears session

---

## TESTING PRIORITY

**Priority 1 (Critical):**
- Players CRUD
- News CRUD
- Matches CRUD
- Store (Products, Orders)

**Priority 2 (Important):**
- Standings
- Injuries
- User Management
- Settings

**Priority 3 (Nice to have):**
- Trophies
- Fans
- Analytics
- MOTM

---

## KNOWN ISSUES & FIXES

- RLS permission issues for anonymous users (FIXED - see RLS_FIX_GUIDE.md)
- News items table permission denied (FIXED - migration 20260707_fix_news_items_rls.sql)

---

## SIGN-OFF

- [ ] All critical CRUD operations tested
- [ ] All important features verified
- [ ] No critical bugs found
- [ ] Admin panel ready for production

**Tested By:** ___________
**Date:** ___________
**Approved By:** ___________
