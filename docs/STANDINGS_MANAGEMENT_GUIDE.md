# Standings Management System

## Overview

The standings management system provides a complete CRUD interface for managing league standings. Admins can add, edit, and delete teams from the standings table, which is automatically displayed on the frontend with real-time updates.

## Database Schema

### `standings` Table

Located in Supabase, the standings table contains the following fields:

```sql
id (UUID)                 -- Unique identifier
position (INTEGER)        -- Team position (1st, 2nd, etc.) - UNIQUE
team_name (TEXT)         -- Team name - UNIQUE
played (INTEGER)         -- Matches played
won (INTEGER)            -- Matches won
drawn (INTEGER)          -- Matches drawn
lost (INTEGER)           -- Matches lost
goals_for (INTEGER)      -- Goals scored
goals_against (INTEGER)  -- Goals conceded
goal_difference (INTEGER) -- Auto-calculated: goals_for - goals_against
points (INTEGER)         -- Total points
is_highlighted (BOOLEAN) -- Whether to highlight this team (e.g., Titan Force)
created_at (TIMESTAMP)   -- Creation timestamp
updated_at (TIMESTAMP)   -- Last update timestamp
```

## API Endpoints

### Public Endpoints

#### GET `/api/standings`
Fetch all standings sorted by position.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "position": 1,
    "team_name": "Titan Force Mulikandi",
    "played": 6,
    "won": 5,
    "drawn": 1,
    "lost": 0,
    "goals_for": 18,
    "goals_against": 6,
    "goal_difference": 12,
    "points": 16,
    "is_highlighted": true,
    "created_at": "2024-01-14T10:00:00Z",
    "updated_at": "2024-01-14T15:30:00Z"
  }
]
```

### Admin Endpoints

#### POST `/api/admin/standings`
Create a new standing.

**Request:**
```json
{
  "position": 1,
  "team_name": "Titan Force Mulikandi",
  "played": 6,
  "won": 5,
  "drawn": 1,
  "lost": 0,
  "goals_for": 18,
  "goals_against": 6,
  "points": 16,
  "is_highlighted": true
}
```

**Response:** Created standing object (HTTP 201)

#### PUT `/api/admin/standings`
Update an existing standing.

**Request:**
```json
{
  "id": "uuid-string",
  "position": 1,
  "team_name": "Titan Force Mulikandi",
  "played": 7,
  "won": 6,
  "drawn": 1,
  "lost": 0,
  "goals_for": 21,
  "goals_against": 6,
  "points": 19,
  "is_highlighted": true
}
```

**Response:** Updated standing object (HTTP 200)

#### DELETE `/api/admin/standings?id={id}`
Delete a standing.

**Response:** `{ "success": true }` (HTTP 200)

## Admin Interface

### Access

Navigate to `/admin/standings` to access the standings management interface.

### Features

1. **View All Standings**
   - Table showing all teams with their statistics
   - Sorted by position
   - Highlighted rows for teams marked with `is_highlighted: true`

2. **Add New Team**
   - Click "Add Team" button to open form
   - Fill in team information (position, name, statistics)
   - Select checkbox to highlight team (optional)
   - Submit to create new standing

3. **Edit Standings**
   - Click edit icon (✏️) next to any team
   - Modify form fields
   - Click checkmark to save or X to cancel

4. **Delete Standings**
   - Click delete icon (🗑️) next to any team
   - Confirm deletion
   - Team is removed from standings

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Position | Number | Yes | Team's position (1-based) |
| Team Name | Text | Yes | Full team name |
| Played | Number | No | Matches played |
| Won | Number | No | Matches won |
| Drawn | Number | No | Matches drawn |
| Lost | Number | No | Matches lost |
| Goals For | Number | No | Goals scored |
| Goals Against | Number | No | Goals conceded |
| Points | Number | No | Total points earned |
| Highlight | Checkbox | No | Show as highlighted team |

## Frontend Integration

### HomeLeagueStandings Component

The standings component (`components/home-league-standings.tsx`) displays the top standings on the homepage:

- Fetches data from `/api/standings` on mount
- Shows loading spinner while fetching
- Displays standings in table format (Position, Team, P, GD, Pts)
- Highlighted rows for teams with `is_highlighted: true`
- Links to `/league-standings` for full table view

### Automatic Updates

Frontend standings are updated automatically:
1. Admin makes changes in `/admin/standings`
2. Changes are saved to Supabase
3. Next time user visits homepage or refreshes, latest data is displayed
4. No page refresh needed - component fetches on mount

## Bilingual Support

All admin interface text supports both English and Bengali:

- Menu labels
- Form titles and labels
- Button text
- Error and success messages
- Table headers

Language is controlled by the `useLanguage()` hook and responds to the app's language setting.

## Row Level Security (RLS)

- **Public Read**: Anyone can view standings via `/api/standings`
- **Admin Write**: Only authenticated admin users can create, update, or delete standings
- Enforced at database level by Supabase RLS policies

## Color Scheme

- **Highlighted Team**: Light primary background color with primary text
- **Other Teams**: Default background with hover effect
- **Action Buttons**: Edit (standard), Delete (destructive color)

## Example Workflow

### Adding Titan Force to Standings

1. Go to `/admin/standings`
2. Click "Add Team" button
3. Fill form:
   - Position: 1
   - Team Name: Titan Force Mulikandi
   - Played: 6
   - Won: 5
   - Drawn: 1
   - Lost: 0
   - Goals For: 18
   - Goals Against: 6
   - Points: 16
   - Check "Highlight" checkbox
4. Click "Add" button
5. Success message shows
6. Table updates with new team

### Editing Standings

1. Find team in table
2. Click edit icon (✏️)
3. Modify any fields (e.g., update points after new match)
4. Click checkmark to save
5. Table updates immediately
6. Homepage will show updated data on next visit

### Deleting Standings

1. Find team in table
2. Click delete icon (🗑️)
3. Confirm deletion in dialog
4. Team is removed from standings
5. Positions may need manual adjustment if needed

## Performance Considerations

- **Indexes**: `standings` table is indexed on `position` and `is_highlighted` for fast queries
- **Caching**: Frontend fetches on component mount; add React Query/SWR for caching if needed
- **RLS**: Minimal performance impact; only affects write operations

## Troubleshooting

### Standings not showing on frontend
- Check that standings exist in `/admin/standings`
- Verify Supabase connection in browser console
- Check that `/api/standings` endpoint is working (test in browser address bar)

### Admin can't edit/delete
- Verify you're logged in as admin
- Check Supabase RLS policies are correctly configured
- Check browser console for error messages

### Form validation errors
- Position and Team Name are required fields
- Position should be a positive integer
- Team Name should be unique

## Future Enhancements

Potential improvements to the standings system:

- Automatic standings calculation from match results
- Historical standings tracking (standings by date)
- Import/export standings functionality
- Standings visualization (charts, trends)
- Integration with match results for live updates
- Drag-and-drop position reordering
- Bulk operations (import CSV, export data)
