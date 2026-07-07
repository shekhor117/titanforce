# Professional Player Profile System Documentation

## Overview
The Player Profile System provides a comprehensive, professional player management solution featuring a Haaland-style player profile page and a full admin panel for managing all player data. The system is fully bilingual (English/Bengali) and responsive across all devices.

---

## 🎯 User-Facing Features

### Player Profile Page (`/player/[number]`)
The public-facing player profile displays comprehensive player information in a professional format.

#### Key Sections:
1. **Professional Hero Section**
   - Large player image with professional framing
   - Player name and jersey number badge
   - Quick info bar (Club, Position, Jersey)
   - Personal details (Nationality, Age, Position)

2. **Tabbed Navigation**
   - **Overview**: Player details and biography
   - **Statistics**: Career stats including goals, assists, appearances, minutes played
   - **Skills**: Attribute ratings displayed with skill bars (Pace, Shooting, Passing, Dribbling, Defending, Physical)
   - **Position**: Field diagram showing player positioning with jersey number

3. **Responsive Design**
   - Mobile: Single column, optimized spacing
   - Tablet: 2-column layouts
   - Desktop: Full multi-column layouts with enhanced visuals

#### Features:
- Bilingual support (English/Bengali)
- Beautiful gradient backgrounds
- Professional typography and spacing
- Smooth transitions and animations
- Real-time data from database
- Admin edit button (for admin users)

---

## 🛠️ Admin Panel Features

### Players Management Dashboard (`/admin/players`)

#### Features:
- **Stats Overview**: Total players, goals, assists, appearances at a glance
- **Search & Filter**: Search by player name or position; filter by position dropdown
- **Player Table**: Sortable table with all key information
  - Jersey number
  - Full name
  - Position
  - Goals, Assists, Appearances
  - Average rating (on desktop)
  - Action buttons (View/Edit)

#### Actions:
- **View**: Navigate to player's public profile
- **Edit**: Open player edit form for comprehensive data management

---

### Player Edit Page (`/admin/players/[id]/edit`)

Comprehensive form for managing all player data with real-time synchronization to player profile.

#### Sections:

##### 1. Basic Information
- Full Name
- Display Name
- Jersey Number
- Position
- Age
- Hometown
- Biography (textarea)

##### 2. Attributes (6-Point System)
Edit player skill levels with sliders (0-100):
- Pace
- Shooting
- Passing
- Dribbling
- Defending
- Physical

##### 3. Statistics
Manage player career statistics:
- Goals
- Assists
- Appearances
- Minutes Played
- Pass Accuracy (%)
- Chances Created
- Yellow Cards
- Red Cards

#### Features:
- Real-time validation
- Loading states while saving
- Success/error notifications
- Cancel and save options
- Bilingual interface
- Mobile-responsive forms

---

## 📁 File Structure

### Components
```
components/player/
├── player-profile-hero.tsx          # Hero section with image and info
├── player-attributes-chart.tsx      # Skill bars visualization
├── player-career-stats.tsx          # Career stats table
└── player-position-diagram.tsx      # Field position diagram
```

### Pages
```
app/
├── player/[number]/page.tsx                    # Public player profile
└── admin/
    └── players/
        ├── page.tsx                           # Players management list
        └── [id]/edit/page.tsx                 # Player edit form
```

### API Routes
```
app/api/
└── admin/
    └── players/
        └── [num]/route.ts                    # PUT: Update player
```

---

## 🔌 API Endpoints

### Update Player Profile
**Endpoint**: `PUT /api/admin/players/[num]`

**Request Body**:
```json
{
  "full_name": "string",
  "name": "string",
  "position": "string",
  "age": number,
  "hometown": "string",
  "bio": "string",
  "goals": number,
  "assists": number,
  "appearances": number,
  "minutes_played": number,
  "pass_accuracy": number,
  "chances_created": number,
  "yellow_cards": number,
  "red_cards": number,
  "pace": number,
  "shooting": number,
  "passing": number,
  "dribbling": number,
  "defending": number,
  "physical": number,
  "foot": "string",
  "status": "string",
  "image_url": "string"
}
```

**Response**:
```json
{
  "message": "Player updated successfully",
  "data": { Player object }
}
```

---

## 💾 Database Schema

The `players` table includes all necessary fields:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| num | INTEGER | Jersey number (unique) |
| full_name | TEXT | Player's full name |
| name | TEXT | Display name |
| position | TEXT | Player position |
| age | INTEGER | Player age |
| hometown | TEXT | Player hometown/nationality |
| bio | TEXT | Player biography |
| goals | INTEGER | Career goals |
| assists | INTEGER | Career assists |
| appearances | INTEGER | Matches played |
| minutes_played | INTEGER | Total minutes |
| pass_accuracy | DECIMAL | Pass accuracy % |
| chances_created | INTEGER | Chances created |
| yellow_cards | INTEGER | Yellow cards received |
| red_cards | INTEGER | Red cards received |
| pace | INTEGER | Pace skill (0-100) |
| shooting | INTEGER | Shooting skill (0-100) |
| passing | INTEGER | Passing skill (0-100) |
| dribbling | INTEGER | Dribbling skill (0-100) |
| defending | INTEGER | Defending skill (0-100) |
| physical | INTEGER | Physical strength (0-100) |
| foot | TEXT | Left/Right/Both |
| status | TEXT | active/injured/suspended |
| image_url | TEXT | Player image URL |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

## 🌐 Bilingual Support

All text supports both English and Bengali:

### Components Translated:
- Player profile page (all sections)
- Admin dashboard (headers, labels, buttons)
- Edit forms (all field labels)
- Notifications and messages
- Tab labels and navigation

Language selection from `useLanguage()` context:
```typescript
const { language } = useLanguage()
const isBn = language === 'bn'
```

---

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#FBBF24)
- **Error**: Red (#EF4444)
- **Neutral**: Slate grays

### Typography
- Display Font: For headings and titles
- Bengali Font: For Bengali text
- Body Font: For regular content

### Components Used
- Neo-panel cards with subtle styling
- Gradient backgrounds
- Glass-morphism effects
- Smooth transitions
- Responsive spacing with Tailwind

---

## 🔄 Workflow

### Editing a Player Profile

1. **Navigate to Admin Panel**
   - Go to `/admin/players`

2. **Select Player to Edit**
   - Use search to find player
   - Click the edit icon (pencil) for the player

3. **Update Player Data**
   - Modify any field as needed
   - Adjust attribute sliders
   - Update statistics

4. **Save Changes**
   - Click "Save Changes" button
   - System saves to database
   - Success message displays
   - Redirects back to player list

5. **View Updated Profile**
   - Click "View" icon to see public profile
   - Changes reflected immediately

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Stacked forms
- Full-width buttons
- Optimized spacing
- Touch-friendly interactions

### Tablet (640px - 1024px)
- 2-column layouts where applicable
- Adjusted card sizing
- Improved spacing

### Desktop (> 1024px)
- Multi-column layouts
- Full table display
- Enhanced visual hierarchy
- All data visible

---

## 🔐 Security

### Admin Access
- Admin users can edit players via localStorage flag
- Edit button only visible to admin users
- API endpoints accept admin requests

### Data Validation
- Input validation on forms
- Type checking for numeric fields
- Error handling with user-friendly messages

---

## 🚀 Deployment

### Environment Variables Required
All env vars are automatically configured:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

### Build & Deploy
```bash
# Install dependencies
npm install

# Build project
npm run build

# Deploy (via Vercel, GitHub, or your platform)
```

---

## 📊 Features Summary

✅ Professional player profile page  
✅ Haaland-style design  
✅ Admin management dashboard  
✅ Comprehensive edit forms  
✅ Real-time data synchronization  
✅ Bilingual support (EN/BN)  
✅ Mobile responsive  
✅ Attribute sliders  
✅ Career stats tracking  
✅ Position diagrams  
✅ Search and filtering  
✅ Beautiful UI/UX  

---

## 🤝 Support

For issues or feature requests, please refer to the GitHub repository or contact the development team.

---

## 📝 Version History

- **v1.0** (Current)
  - Initial release with professional player profiles
  - Admin panel for player management
  - Full bilingual support
  - Responsive design
  - Complete API integration
