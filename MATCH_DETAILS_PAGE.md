# Match Details Page - Complete Documentation

## Overview

The match details page provides a comprehensive, fully responsive view of individual match information. Users can access it by clicking on any match card in the matches section.

## Features

### 1. **Responsive Design**
- **Mobile**: Single column layout with optimized spacing and touch targets
- **Tablet**: 2-column layouts for better space utilization
- **Desktop**: Full multi-column layouts with enhanced visuals

### 2. **Navigation**
- **Back Button**: Easy navigation to previous page/matches section
- **Match Card Click**: Direct navigation from match cards to full page
- **Sticky Tab Navigation**: Tab navigation stays visible while scrolling

### 3. **Hero Section**
- Team badges with color gradients (home: emerald, away: indigo)
- Large score display with responsive font sizing
- Match status badge (LIVE, WIN, LOSS, DRAW, UPCOMING)
- Date, time, and venue information
- Status indicators with appropriate styling

### 4. **Five-Tab System**

#### Overview Tab
- Match information panel (date, time, venue, season)
- Goals section showing all goals for both teams
- Goal scorers with minute timestamps
- Clean, organized layout

#### Statistics Tab
- Placeholder for detailed match statistics
- Ready for extended data (possession, shots, cards, etc.)
- Responsive grid layout

#### Lineups Tab
- Home team lineup with player numbers and positions
- Away team lineup with player numbers and positions
- Hover effects for better interactivity
- Color-coded team badges (emerald for home, indigo for away)

#### Match Events Tab
- Timeline of all match events
- Event types with icons and styling
- Minute-by-minute breakdown
- Team and player information

#### Player Ratings Tab
- Placeholder for player performance ratings
- Ready for star ratings and performance metrics
- Future expansion capability

### 5. **Language Support**
- Full bilingual support (English & Bengali)
- Context-aware language switching
- Proper typography for both scripts

### 6. **Visual Design**
- Neo-panel styling consistent with site design
- Color-coded sections for better visual hierarchy
- Responsive images and badges
- Smooth transitions and hover effects
- Dark/light mode compatible

## File Structure

```
/app/match/[id]/
  └── page.tsx                      # Main match details page
/components/match/
  ├── match-hero.tsx               # Hero section component
  ├── match-details-sections.tsx    # Tab content sections
  └── enhanced-match-card.tsx       # Match card with navigation
/app/api/matches/
  └── [id]/route.ts                # Public API endpoint
```

## API Endpoints

### GET `/api/matches/[id]`
Fetch individual match details

**Parameters:**
- `id` (string): Match ID

**Response:**
```json
{
  "id": "match_id",
  "home": "Team Name",
  "away": "Team Name",
  "date": "2026-07-07",
  "time": "19:00",
  "venue": "Stadium Name",
  "home_score": 2,
  "away_score": 1,
  "status": "completed",
  "result": "W",
  "goals": [...],
  "home_lineup": [...],
  "away_lineup": [...],
  "match_events": [...]
}
```

## Navigation Flow

```
Matches List
    ↓
[Click Match Card] (fullPageLink enabled)
    ↓
Match Details Page (/match/[id])
    ↓
[Browse Tabs] [View Stats] [Check Lineups]
    ↓
[Back Button] → Matches List
```

## Usage

### Viewing Match Details
1. Navigate to matches section
2. Click on any match card
3. Browser navigates to `/match/[matchId]`
4. Full match details page loads with responsive layout
5. Use tabs to view different information
6. Click back button to return

### Adding Match Data
Match details are populated from the database:
- Match basic info: date, time, venue, teams
- Goals: player names and minutes
- Lineups: player numbers and positions
- Events: goals, cards, substitutions

### Extending Functionality
- Add stats calculations for statistics tab
- Implement player ratings system
- Add social sharing features
- Add match voting/predictions

## Responsive Breakpoints

- **Mobile (< 640px)**: Single column, full width sections
- **Tablet (640px - 1024px)**: 2-column grids, optimized spacing
- **Desktop (> 1024px)**: 2-3 column layouts with enhanced spacing

## Accessibility

- Proper semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly tab system
- High contrast badges and text

## Performance Optimizations

- Server-side rendering for initial load
- Client-side data caching via SWR
- Lazy loading of tab content
- Optimized image sizing
- Efficient CSS with Tailwind

## Styling

Uses existing design system:
- Color tokens: primary, secondary, foreground, background
- Typography: display font for headings, sans font for body
- Spacing: Tailwind scale (4px base unit)
- Components: neo-panel, rounded-lg, transition effects

## Future Enhancements

1. **Statistics Dashboard**
   - Possession percentage
   - Shots on target
   - Pass completion
   - Tackles and interceptions

2. **Player Analytics**
   - Individual player ratings (1-10 scale)
   - Heat maps
   - Pass accuracy
   - Distance covered

3. **Social Features**
   - Share match details
   - Vote man of the match
   - Predict match outcome
   - Comments/reactions

4. **Admin Features**
   - Edit match details
   - Add/remove events
   - Update scores in real-time
   - Add match statistics

## Testing

### Manual Testing Checklist
- [ ] Match card click navigates to details page
- [ ] All tabs load correctly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Bengali language switching works
- [ ] Back button navigation works
- [ ] Data loads from API correctly
- [ ] No console errors
- [ ] Images load properly
- [ ] Hover effects work on interactive elements

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Match Not Found
- Check match ID in URL
- Verify match exists in database
- Check admin has created the match

### Data Not Loading
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure authentication is working

### Styling Issues
- Clear browser cache
- Check CSS file compilation
- Verify Tailwind configuration

## Related Components

- **EnhancedMatchCard**: Match card component with navigation
- **MatchHero**: Hero section component
- **Matches**: Matches list component
- **MatchDetailsSections**: Tab content sections

## Summary

The match details page provides a complete, responsive experience for viewing match information. It supports multiple tabs, languages, and devices while maintaining consistent design and performance. The page is production-ready and can be easily extended with additional features.
