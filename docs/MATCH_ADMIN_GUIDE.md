# Match Admin & CRUD System Guide

## Overview

The Titan Force FC match details system is now fully integrated with Supabase CRUD (Create, Read, Update, Delete) operations. This guide explains how to use the admin panel to create, edit, and manage matches with comprehensive FotMob-style details.

## Database Schema

The `public.matches` table contains the following fields:

### Core Match Information
- `id` (UUID) - Primary key
- `home_team` (TEXT) - Home team name
- `away_team` (TEXT) - Away team name
- `match_date` (DATE) - Match date
- `match_time` (TIME) - Kick-off time
- `venue` (TEXT) - Stadium/venue name
- `league` (TEXT) - League name (default: 'Premier League')
- `status` (TEXT) - 'upcoming', 'live', 'completed', or 'postponed'
- `result` (TEXT) - 'W' (Win), 'D' (Draw), or 'L' (Loss)

### Match Statistics
#### Possession & Basic Stats
- `home_possession`, `away_possession` - Possession percentage
- `home_shots`, `away_shots` - Total shots
- `home_shots_on_target`, `away_shots_on_target` - Shots on target
- `home_big_chances`, `away_big_chances` - Big chances created
- `home_corners`, `away_corners` - Corners taken
- `home_offsides`, `away_offsides` - Offsides

#### Discipline
- `home_fouls`, `away_fouls` - Fouls committed
- `home_yellow_cards`, `away_yellow_cards` - Yellow cards
- `home_red_cards`, `away_red_cards` - Red cards

#### Advanced Stats
- `home_pass_accuracy`, `away_pass_accuracy` - Pass accuracy percentage
- `home_passes`, `away_passes` - Total passes
- `home_tackles`, `away_tackles` - Tackles made
- `home_clearances`, `away_clearances` - Defensive clearances
- `home_interceptions`, `away_interceptions` - Interceptions
- `home_saves`, `away_saves` - Goalkeeper saves
- `home_blocked_shots`, `away_blocked_shots` - Blocked shots

#### Advanced Metrics
- `home_xg`, `away_xg` - Expected Goals (xG)
- `home_win_probability`, `away_win_probability` - Win probability percentage
- `draw_probability` - Draw probability percentage

### Complex Data (JSON)
- `goals` (JSONB) - Array of goals with player, minute, and assist
- `events` (JSONB) - Array of match events (cards, substitutions, etc.)
- `home_lineup` (JSONB) - Starting XI with player details
- `away_lineup` (JSONB) - Starting XI with player details
- `home_substitutes` (JSONB) - Substitute players
- `away_substitutes` (JSONB) - Substitute players

### Match Details & Weather
- `referee` (TEXT) - Referee name
- `attendance` (INTEGER) - Attendance count
- `weather_temp` (DECIMAL) - Temperature in Celsius
- `weather_condition` (TEXT) - Weather condition description
- `weather_wind_speed` (DECIMAL) - Wind speed in km/h

### Metadata
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /api/matches
Fetch all matches with optional filtering.

**Query Parameters:**
- `status` - Filter by status ('upcoming', 'live', 'completed', 'postponed')
- `league` - Filter by league name
- `limit` - Number of matches to return (default: 50)

**Example:**
```bash
GET /api/matches?status=completed&limit=10
```

**Response:**
```json
[
  {
    "id": "uuid",
    "home_team": "Titan Force",
    "away_team": "City United",
    "home_score": 3,
    "away_score": 1,
    "match_date": "2024-07-15",
    "match_time": "19:45",
    "venue": "Mulikandi Stadium",
    "status": "completed",
    ...
  }
]
```

#### GET /api/matches/[id]
Fetch a single match by ID.

**Example:**
```bash
GET /api/matches/550e8400-e29b-41d4-a716-446655440000
```

### Admin Endpoints (Authentication Required)

#### POST /api/admin/matches
Create a new match.

**Request Body:**
```json
{
  "home_team": "Titan Force",
  "away_team": "City United",
  "match_date": "2024-07-15",
  "match_time": "19:45",
  "venue": "Mulikandi Stadium",
  "league": "Premier League",
  "status": "upcoming",
  "referee": "Michael Oliver",
  "attendance": 60200
}
```

#### PUT /api/admin/matches
Update an existing match.

**Request Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "home_score": 3,
  "away_score": 1,
  "status": "completed",
  "result": "W",
  "home_possession": 62,
  "away_possession": 38,
  ...
}
```

#### DELETE /api/admin/matches
Delete a match.

**Query Parameters:**
- `id` - Match ID to delete

**Example:**
```bash
DELETE /api/admin/matches?id=550e8400-e29b-41d4-a716-446655440000
```

## Admin Panel Usage

### Accessing the Admin Panel
1. Navigate to `/admin/matches`
2. You must be authenticated as an admin user
3. The admin panel displays all matches with their basic information

### Creating a New Match
1. Click the **"New Match"** button
2. Fill in the **Basic** tab with:
   - Home Team name
   - Away Team name
   - Match date
   - Match time
   - Venue/Stadium
   - League
   - Referee
   - Attendance (optional)

3. Optionally add statistics and lineups by switching to other tabs
4. Click **Save**

### Editing a Match
1. Find the match in the list
2. Click to expand the match details
3. Click the **Edit** button
4. Modify any fields:
   - **Basic**: Core match information
   - **Stats**: Comprehensive match statistics
   - **Lineups**: Starting XI and substitutes
   - **Events**: Goals, cards, substitutions

5. Click **Save**

### Deleting a Match
1. Find the match in the list
2. Click to expand the match details
3. Click the **Delete** button
4. Confirm the deletion

### Match Statistics Tab

The Stats tab is organized into categories:

#### Basic Stats
- Possession (%) - up to 100
- Shots - total shots taken
- Shots on Target - shots that forced a save
- Big Chances - clear goal-scoring opportunities

#### Attack
- Big Chances Created
- Expected Goals (xG) - statistical measure of shot quality

#### Discipline
- Fouls committed
- Yellow Cards
- Red Cards

#### Probability
- Home team win probability (%)
- Away team win probability (%)
- Draw probability (%)

### Lineups Tab

Each team's starting XI can be edited:

1. Expand the team section
2. For each player, enter:
   - Jersey number (1-99)
   - Player name
   - Position (GK, LB, CB, RB, CM, CDM, CAM, LM, RM, FW, LW, RW, ST)

3. Add substitutes by clicking "Add Player"
4. Remove players with the X button
5. Click **Save Lineups**

### Events Tab

Track match events with minute markers:

#### Adding Goals
1. Enter player name
2. Enter minute (0-120)
3. Enter assisting player (optional)
4. Click **Add**

#### Adding Events
1. Select event type: Card, Goal, Substitution, or VAR
2. Select team
3. Enter player name
4. Enter minute
5. If card event, select Yellow or Red
6. Click **Add**

Events are displayed chronologically in the match timeline.

## Bilingual Support

The admin panel supports both English and Bengali. Language is automatically detected from user settings. All labels, placeholders, and messages adapt accordingly.

### Supported Languages
- English (default)
- Bengali (বাংলা)

## Data Validation

The system validates all input data:

- Team names are required (must not be empty)
- Match date is required
- Possession percentages must be 0-100
- Card quantities must be non-negative
- Win probabilities must add up to ~100
- Player positions must be valid

## Security

All admin endpoints require authentication. The Row Level Security (RLS) policies enforce:

- **Public read access**: Anyone can view completed matches
- **Admin-only modifications**: Only authenticated users can create/update/delete matches
- **Data integrity**: Foreign key constraints and validation rules prevent invalid data

## Integration with Match Details Page

The FotMob-style match details page automatically fetches data from the database:

1. When `/match/[id]` is loaded, it fetches match data via `/api/matches/[id]`
2. All statistics, lineups, and events are displayed dynamically
3. The page updates whenever admin makes changes
4. Both modal and standalone page views use the same data source

## Example Workflow

### Complete Match Entry

1. **Create Match** (before match starts)
   - Set status: 'upcoming'
   - Enter teams, date, time, venue

2. **Update During Match** (while match is live)
   - Change status: 'live'
   - Add events as they happen
   - Update possession and shot counts in real-time

3. **Finalize After Match** (after match ends)
   - Set status: 'completed'
   - Set result: 'W', 'D', or 'L'
   - Complete all statistics
   - Add full lineups and goals
   - Enter final events

4. **Publish**
   - Match is now visible on public pages
   - Fans can view complete match details on `/fixtures-results`
   - Individual match pages visible at `/match/[id]`

## Troubleshooting

### Cannot Save Match
- Verify team names are not empty
- Check internet connection
- Ensure you're logged in as admin user
- Check browser console for error messages

### Match Not Appearing
- Verify match status is set to a valid value
- Check that match_date is valid
- Ensure match was saved successfully
- Refresh the page

### Statistics Not Updating
- Save changes in the Stats tab explicitly
- Check that percentages are valid (0-100)
- Verify numbers are non-negative

## Technical Details

The admin system uses:
- **Frontend**: React hooks with TypeScript for type safety
- **Backend**: Next.js API routes with Supabase integration
- **Database**: PostgreSQL via Supabase
- **RLS**: Row-Level Security policies for access control
- **Validation**: Server-side validation on all inputs

## Future Enhancements

Potential improvements:
- Bulk import/export functionality
- Advanced filtering and sorting
- Player performance analytics
- Historical match data
- Match replay features
