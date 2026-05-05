## Titan Force - Supabase Integration Guide

### Current Database Status

✅ **Already Connected & Working:**
- `matches` table - Fully integrated with admin and public pages
- `player_profiles` table - Has player data with user relationships
- `profiles` table - Auth integration ready
- Various stat tables (player_stats, news_posts, team_formations, etc.)

🔄 **Needs Real Data Connection:**
- `Squad component` - Currently using hardcoded player data, needs to fetch from `player_profiles`

---

## 1. EXISTING DATABASE SCHEMA

### Matches Table
```sql
id (UUID)
title (TEXT)
opponent (TEXT)
date (DATE)
time (TIME)
location (TEXT)
status (enum: 'upcoming', 'completed', 'cancelled')
titan_force_score (INT)
opponent_score (INT)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Player Profiles Table
```sql
id (UUID) - Primary Key
user_id (UUID) - Foreign Key to profiles
phone (TEXT)
age (INT)
position (TEXT)
jersey (INT)
height (INT)
weight (INT)
foot (TEXT: 'Left', 'Right', 'Both')
address (TEXT)
experience (INT)
photo_url (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 2. QUICK SETUP CHECKLIST

- [x] Supabase project connected
- [x] Authentication working (login/signup)
- [x] Basic tables created with RLS
- [x] Matches management working
- [ ] Squad component using real player data
- [ ] Error handling in place

---

## 3. KEY SUPABASE UTILITIES

### Using Supabase Client in Components
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Fetch data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
```

### Using Supabase Server
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

---

## 4. NEXT STEPS

1. Update Squad component to fetch players from Supabase
2. Add admin players management (add/edit/delete players)
3. Connect remaining features (news, formations, stats)
4. Add image uploads for player photos
