# Squad Manager Implementation Guide

## Overview

The Squad Manager is a comprehensive admin tool for managing the football team's roster with real-time synchronization to the Supabase `players` table. It provides a professional UI for adding, editing, and managing player profiles with advanced features like player attributes, training data, and trophy tracking.

## Architecture

### Components

1. **`/components/SquadManager.tsx`** - Main UI component
   - Reusable React component with full squad management interface
   - Displays player list with filtering and search
   - Add/Edit/Delete player forms with validation
   - Training data and trophy management
   - Photo upload with drag-and-drop support
   - Player attributes visualization (pace, shooting, passing, etc.)

2. **`/app/admin/squad-manager/page.tsx`** - Admin page
   - Server-side admin route with authentication protection
   - Loads real player data from Supabase via DataService
   - Handles CRUD operations and data persistence
   - Photo uploads to Vercel Blob storage
   - Maps SquadManager schema to Supabase player fields

### Data Flow

```
Supabase players table
        ↓
DataService.getPlayers()
        ↓
Convert to SquadManager format
        ↓
SquadManager component displays data
        ↓
User edits/adds/deletes player
        ↓
Admin page handler (handleAddPlayer, handleUpdatePlayer, handleDeletePlayer)
        ↓
Upload photo to Vercel Blob (if new)
        ↓
DataService.createPlayer/updatePlayer/deletePlayer
        ↓
Persisted to Supabase players table
```

## Database Schema Mapping

The SquadManager uses the following Supabase `players` table fields:

| SquadManager Field | Supabase Field | Type | Notes |
|---|---|---|---|
| id | id | UUID | Primary key |
| name | name | varchar | Player name |
| fullName | full_name | varchar | Full player name |
| number | num | integer | Jersey number |
| position | position | varchar | Position (e.g., 'MID') |
| category | category | enum | Category: GK, DEF, MID, FWD |
| age | age | integer | Player age |
| nationality | nationality | varchar | Player nationality |
| goals | goals | integer | Total goals scored |
| assists | assists | integer | Total assists |
| photo | image_url | varchar | Player photo URL (Vercel Blob) |
| status | status | varchar | Active, Injured, Suspended |
| bio | bio | text | Player biography |
| rating | average_rating | decimal | Average player rating |
| dob | date_of_birth | date | Date of birth |
| joinDate | join_date | date | Join date |
| season | season_year | varchar | Season (e.g., '2024-2025') |
| hometown | hometown | varchar | Player hometown |
| preferredFoot | foot | varchar | Right, Left, Both |
| club | club | varchar | Club name |
| minutesPlayed | minutes_played | integer | Minutes played |
| passAccuracy | pass_accuracy | decimal | Pass accuracy % |
| chancesCreated | chances_created | integer | Chances created |
| cleanSheets | clean_sheets | integer | Clean sheets |
| cleanSheets | clean_sheets | integer | Clean sheets |
| yellowCards | yellow_cards | integer | Yellow cards received |
| redCards | red_cards | integer | Red cards received |
| matches | appearances | integer | Total appearances |
| attributes.pace | pace | integer | Player pace stat (0-100) |
| attributes.shooting | shooting | integer | Player shooting stat |
| attributes.passing | passing | integer | Player passing stat |
| attributes.dribbling | dribbling | integer | Player dribbling stat |
| attributes.defending | defending | integer | Player defending stat |
| attributes.physical | physical | integer | Player physical stat |

## Features

### 1. Squad Overview
- View all players in a filterable list
- KPI summary: Average rating, Total goals, Average age
- Quick stats display for each player

### 2. Player Management
- **Add Player**: Create new player with full details
- **Edit Player**: Modify player information and stats
- **Delete Player**: Remove player from squad (with confirmation)

### 3. Player Details
- Basic info (name, position, number, age, nationality)
- Statistics (goals, assists, matches, cards)
- Physical attributes (pace, shooting, passing, dribbling, defending, physical)
- Career info (join date, hometown, preferred foot)
- Biography and player status

### 4. Advanced Features
- **Photo Management**: Drag-and-drop photo upload to Vercel Blob
- **Trophy Tracking**: Add and manage player trophies
- **Training Data**: Track weekly training metrics (Fitness, Intensity, Speed, Strength)
- **Rating System**: Player ratings with vote count
- **Position Filtering**: Filter by GK, DEF, MID, FWD

## API Endpoints Used

### DataService Methods

```typescript
// Get all players
const players = await dataService.getPlayers();

// Create new player
const newPlayer = await dataService.createPlayer({
  name: "John Doe",
  full_name: "John Doe",
  num: 7,
  position: "MID",
  category: "MID",
  // ... other fields
});

// Update player
const updated = await dataService.updatePlayer(playerId, {
  goals: 5,
  assists: 3,
  // ... other updates
});

// Delete player
await dataService.deletePlayer(playerId);
```

## File Upload

Photos are uploaded to Vercel Blob storage:

```typescript
// Base64 image from form → Blob → Upload to Vercel
const blob = await fetch(base64Image).then(res => res.blob());
const fileName = `player_${Date.now()}.${blob.type.split('/')[1]}`;
const result = await put(`squad/${fileName}`, blob, { access: 'public' });
const photoUrl = result.url; // Use this URL
```

## Authentication & Authorization

- Squad Manager is protected by `AdminProtectedRoute`
- Requires authenticated user with admin role
- Unauthenticated users redirect to `/login`

## Accessing Squad Manager

### Via Admin Panel
1. Navigate to admin dashboard: `http://localhost:3000/admin`
2. Click "Squad Manager" (🎯) in sidebar
3. Login with admin credentials if needed

### Direct URL
- `http://localhost:3000/admin/squad-manager`

## Error Handling

- Upload errors: "Photo upload failed" logged to console
- Validation: Player name and nationality required
- Jersey number: Must be 1-99 and unique across squad
- Database errors: Displayed in red error banner
- Network errors: Shows "Failed to [add/update/delete] player"

## Form Validation

- **Player Name**: Required field
- **Nationality**: Required field
- **Jersey Number**: 1-99, must be unique
- **Age**: Non-negative integer
- **Stats**: Non-negative integers (goals, assists, matches, etc.)
- **Attributes**: 0-100 scale (pace, shooting, passing, etc.)
- **Photo**: Max 2MB, image formats only (PNG, JPG, WEBP)

## UI/UX Features

- **Drag & Drop**: Drag images onto photo zone
- **Search & Filter**: Filter by name, nationality, jersey number
- **Position Filter**: Quick filter by GK, DEF, MID, FWD
- **KPI Cards**: Dashboard-style metrics display
- **Responsive Design**: Works on desktop and tablet
- **Dark Mode**: Integrated with theme system
- **Bilingual**: English and Bengali support via language context
- **Loading States**: Spinner during async operations
- **Success/Error Feedback**: Toast-style notifications

## Performance Considerations

- Players loaded once on component mount
- Lazy loading for large squads
- Photo uploads handled asynchronously
- Optimistic UI updates for better UX
- Efficient filtering and search

## Troubleshooting

### Squad Manager not loading
- Check if logged in with admin credentials
- Verify Supabase connection
- Check browser console for errors

### Photos not uploading
- Verify Vercel Blob is configured
- Check file size (max 2MB)
- Verify file format (PNG, JPG, WEBP)

### Player updates not persisting
- Check Supabase database connection
- Verify user has admin permissions
- Check network tab for API errors

## Future Enhancements

- Bulk player import/export (CSV, Excel)
- Advanced analytics dashboard
- Player comparison tool
- Injury tracking and recovery timeline
- Contract management
- Medical records integration
- Performance analytics from match data
- Automated player recommendations
- Integration with external player databases

## Technical Stack

- **Frontend**: React 19, TypeScript, Framer Motion
- **UI Components**: Lucide React, Recharts
- **State Management**: React hooks
- **Data Persistence**: Supabase
- **File Storage**: Vercel Blob
- **Styling**: Tailwind CSS
- **Charts**: Recharts (bar, line, radar charts)

## Code Quality

- TypeScript for type safety
- Error boundaries and try-catch blocks
- Loading and error states
- Validation on both client and server
- Console logging for debugging
- Clean component composition
