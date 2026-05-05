# 📊 Titan Force - Supabase Data Model Reference

## Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TITAN FORCE DATABASE                         │
│                    (PostgreSQL via Supabase)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   Authentication    │
│   (auth.users)      │
│─────────────────────│
│ • id (UUID)         │
│ • email             │
│ • password_hash     │
└──────────┬──────────┘
           │ (one-to-many)
           │
    ┌──────┴──────────────────────────────────────────┐
    │                                                 │
    ▼                                                 ▼
┌─────────────────────┐              ┌──────────────────────────┐
│  player_profiles    │              │     fan_accounts         │
│─────────────────────│              │──────────────────────────│
│ • id (UUID)         │              │ • id (UUID)              │
│ • user_id (FK) ────┼──────┐       │ • user_id (FK, UNIQUE)   │
│ • jersey (INT)      │      │       │ • bio                    │
│ • position          │      │       │ • favorite_player_id (FK)│
│ • age               │      │       │ • notifications_enabled  │
│ • address           │      │       │ • created_at             │
│ • foot              │      │       │ • updated_at             │
│ • goals             │      │       └──────────────────────────┘
│ • assists           │      │
│ • clean_sheets      │      └─── (many-to-many) ──┐
│ • created_at        │                             │
│ • updated_at        │                             ▼
└─────────┬───────────┘              ┌──────────────────────────┐
          │                          │     fan_favorites        │
          │                          │──────────────────────────│
          ├─ (one-to-many) ─────────▶│ • id (UUID)              │
          │                          │ • fan_user_id (FK)       │
          │                          │ • player_user_id (FK)    │
          │                          │ • created_at             │
          ▼                          └──────────────────────────┘
┌─────────────────────┐
│    player_stats     │
│─────────────────────│
│ • id (UUID)         │
│ • user_id (FK)      │
│ • season            │
│ • goals             │
│ • assists           │
│ • appearances       │
│ • minutes_played    │
│ • yellow_cards      │
│ • red_cards         │
│ • created_at        │
│ • updated_at        │
└─────────────────────┘


          ┌──────────────────────────────────────────┐
          │          MATCH MANAGEMENT               │
          └──────────────────────────────────────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │                                   │
    ▼                                   ▼
┌──────────────────┐        ┌─────────────────────┐
│     matches      │        │ team_formations     │
│──────────────────│        │─────────────────────│
│ • id (UUID)      │        │ • id (UUID)         │
│ • opponent       │        │ • match_id (FK)     │
│ • match_date     │        │ • formation         │
│ • location       │        │ • starting_lineup   │
│ • status         │◄───────│ • substitutions     │
│ • titan_force... │        │ • tactics           │
│ • opponent_goals │        │ • created_at        │
│ • created_by (FK)        │ • updated_at        │
│ • created_at     │        └─────────────────────┘
│ • updated_at     │
└────────┬─────────┘
         │
         ├─ (one-to-many) ──────┐
         │                      │
         ▼                      ▼
    ┌──────────────────────┐  ┌──────────────────┐
    │   match_events       │  │ saved_matches    │
    │──────────────────────│  │──────────────────│
    │ • id (UUID)          │  │ • id (UUID)      │
    │ • match_id (FK)      │  │ • user_id (FK)   │
    │ • event_type         │  │ • match_id (FK)  │
    │ • player_id (FK)     │  │ • created_at     │
    │ • minute             │  └──────────────────┘
    │ • description        │
    │ • metadata (JSONB)   │
    │ • created_at         │
    └──────────────────────┘


          ┌──────────────────────────────────────────┐
          │         NEWS & COMMUNICATION             │
          └──────────────────────────────────────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │                                   │
    ▼                                   ▼
┌──────────────────┐        ┌─────────────────────┐
│   news_posts     │        │  news_comments      │
│──────────────────│        │─────────────────────│
│ • id (UUID)      │        │ • id (UUID)         │
│ • admin_id (FK)  │◄───────│ • post_id (FK)      │
│ • title          │        │ • user_id (FK)      │
│ • content        │        │ • content           │
│ • image_url      │        │ • created_at        │
│ • published      │        │ • updated_at        │
│ • created_at     │        └─────────────────────┘
│ • updated_at     │
└──────────────────┘
```

---

## Entity Relationships

### Player Profile
```
player_profiles {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → auth.users.id)
  jersey: INT (Unique)
  position: TEXT
  age: INT
  address: TEXT (optional)
  foot: TEXT
  goals: INT (default 0)
  assists: INT (default 0)
  clean_sheets: INT (default 0)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

One Player Profile = One User
One User = One Player Profile (unique constraint)
```

### Matches
```
matches {
  id: UUID (Primary Key)
  opponent: TEXT
  match_date: TIMESTAMP
  location: TEXT
  status: TEXT ('upcoming', 'completed', 'cancelled')
  titan_force_goals: INT (optional)
  opponent_goals: INT (optional)
  created_by: UUID (Foreign Key → auth.users.id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

One Match → Many Match Events (cascade delete)
One Match → One Team Formation (unique)
One User → Many Matches (as created_by)
One User → Many Saved Matches
```

### Player Stats
```
player_stats {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → player_profiles.user_id)
  season: TEXT
  goals: INT
  assists: INT
  appearances: INT
  minutes_played: INT
  yellow_cards: INT
  red_cards: INT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

One Player → Many Seasons of Stats
Unique constraint: (user_id, season)
```

### News System
```
news_posts {
  id: UUID (Primary Key)
  admin_id: UUID (Foreign Key → auth.users.id)
  title: TEXT
  content: TEXT
  image_url: TEXT (optional)
  published: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

news_comments {
  id: UUID (Primary Key)
  post_id: UUID (Foreign Key → news_posts.id)
  user_id: UUID (Foreign Key → auth.users.id)
  content: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

One Post → Many Comments (cascade delete)
One User → Many Comments
One Admin → Many News Posts
```

### Fan Features
```
fan_accounts {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → auth.users.id, UNIQUE)
  bio: TEXT (optional)
  favorite_player_id: UUID (Foreign Key)
  notifications_enabled: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

fan_favorites {
  id: UUID (Primary Key)
  fan_user_id: UUID (Foreign Key → auth.users.id)
  player_user_id: UUID (Foreign Key → auth.users.id)
  created_at: TIMESTAMP
  UNIQUE(fan_user_id, player_user_id)
}

saved_matches {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → auth.users.id)
  match_id: UUID (Foreign Key → matches.id)
  created_at: TIMESTAMP
  UNIQUE(user_id, match_id)
}

Many-to-Many: Users ←→ Players (through fan_favorites)
Many-to-Many: Users ←→ Matches (through saved_matches)
```

---

## Row Level Security (RLS) Policies

### player_profiles
```
SELECT: TRUE (Public - everyone can view)
INSERT: auth.uid() = user_id (User can create own)
UPDATE: auth.uid() = user_id (User can update own)
DELETE: auth.uid() = user_id (User can delete own)
```

### matches
```
SELECT: TRUE (Public - everyone can view)
INSERT: auth.uid() = created_by (Creator can insert)
UPDATE: auth.uid() = created_by (Creator can update)
DELETE: auth.uid() = created_by (Creator can delete)
```

### news_posts
```
SELECT: published = TRUE OR admin_id = auth.uid()
  (Public sees published, admin sees all)
INSERT: auth.uid() = admin_id
UPDATE: auth.uid() = admin_id
DELETE: auth.uid() = admin_id
```

### fan_favorites
```
SELECT: auth.uid() = fan_user_id (User sees own favorites)
INSERT: auth.uid() = fan_user_id (User can add own favorites)
DELETE: auth.uid() = fan_user_id (User can remove own favorites)
```

### saved_matches
```
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id
DELETE: auth.uid() = user_id
```

---

## Data Types Reference

```
UUID          = Universally Unique Identifier
INT           = Integer (whole numbers)
TEXT          = Unlimited text
VARCHAR(n)    = Limited text (n characters)
TIMESTAMP     = Date and time
BOOLEAN       = True/False
JSONB         = JSON data (searchable)
DATE          = Date only
TIME          = Time only
FLOAT         = Decimal numbers
```

---

## Indexes (Performance)

```
player_profiles
  ├─ user_id (fast lookups by user)
  └─ position (fast filtering by position)

matches
  ├─ created_by (find user's matches)
  ├─ status (filter by status)
  └─ match_date (sort by date)

player_stats
  ├─ user_id (find stats)
  └─ season (filter by season)

news_posts
  ├─ published (filter public posts)
  └─ admin_id (find admin's posts)

fan_favorites
  └─ fan_user_id (find user's favorites)

saved_matches
  └─ user_id (find user's saved)
```

---

## Sample Data Structure

### Player Example
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "jersey": 9,
  "position": "ST",
  "age": 24,
  "address": "Dhaka, Bangladesh",
  "foot": "Right",
  "goals": 15,
  "assists": 5,
  "clean_sheets": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z"
}
```

### Match Example
```json
{
  "id": "660f8400-e29b-41d4-a716-446655440001",
  "opponent": "City United",
  "match_date": "2024-12-15T15:00:00Z",
  "location": "National Stadium",
  "status": "upcoming",
  "titan_force_goals": null,
  "opponent_goals": null,
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### News Post Example
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "admin_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Titan Force Wins Championship!",
  "content": "In a thrilling final match, Titan Force defeated all opponents...",
  "image_url": "https://example.com/image.jpg",
  "published": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z"
}
```

---

## Query Examples

### Get All Players
```typescript
const { data } = await supabase
  .from('player_profiles')
  .select('*')
  .order('jersey')
```

### Get Player by Position
```typescript
const { data } = await supabase
  .from('player_profiles')
  .select('*')
  .eq('position', 'ST')
```

### Get Upcoming Matches
```typescript
const { data } = await supabase
  .from('matches')
  .select('*')
  .eq('status', 'upcoming')
  .order('match_date')
```

### Get News with Comments
```typescript
const { data } = await supabase
  .from('news_posts')
  .select('*, news_comments(*)')
  .eq('published', true)
```

### Get User's Favorite Players
```typescript
const { data } = await supabase
  .from('fan_favorites')
  .select('*, player_profiles(*)')
  .eq('fan_user_id', userId)
```

---

## File Locations

```
project/
├── DATABASE_SCHEMA.sql
│   └─ Complete SQL schema with all tables and RLS policies
│
├── lib/
│   ├── supabase-crud.ts
│   │   └─ All CRUD functions (copy-paste ready)
│   └── supabase/
│       └── client.ts
│           └─ Supabase client initialization
│
├── app/
│   ├── admin/
│   │   ├── players/page.tsx (✅ Updated with CRUD)
│   │   ├── matches/page.tsx (needs update)
│   │   ├── news/page.tsx (needs update)
│   │   └── formations/page.tsx (needs update)
│   └── ...
│
├── components/
│   ├── squad.tsx (✅ Already uses Supabase)
│   ├── matches.tsx
│   └── ...
│
├── SUPABASE_INTEGRATION_GUIDE.md
│   └─ Step-by-step integration guide
│
├── SUPABASE_COPY_PASTE_PATTERNS.ts
│   └─ Ready-to-use code snippets
│
├── SUPABASE_SETUP_SUMMARY.md
│   └─ Quick reference
│
├── SUPABASE_CHECKLIST.md
│   └─ Implementation checklist
│
└── SUPABASE_DATA_MODEL_REFERENCE.md
    └─ This file
```

---

## Common Operations

| Operation | Function | Returns |
|-----------|----------|---------|
| Get all players | `getPlayers()` | `{data: [], error: null}` |
| Get one player | `getPlayerById(id)` | `{data: {}, error: null}` |
| Create player | `createPlayer(data)` | `{data: {}, error: null}` |
| Update player | `updatePlayer(id, data)` | `{data: {}, error: null}` |
| Delete player | `deletePlayer(id)` | `{data: null, error: null}` |
| Get matches | `getMatches()` | `{data: [], error: null}` |
| Get news | `getPublishedNews()` | `{data: [], error: null}` |
| Add comment | `addNewsComment(postId, content, userId)` | `{data: {}, error: null}` |
| Get favorites | `getFanFavorites(userId)` | `{data: [], error: null}` |
| Save match | `saveMatch(userId, matchId)` | `{data: {}, error: null}` |

---

**Created:** 2024
**Version:** 1.0
**Status:** Production Ready ✅
