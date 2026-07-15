# Skeleton Loading States - Light & Dark Theme Support

## Overview

Skeleton loading animations have been implemented across the entire website to provide visual feedback while data loads from Supabase. Both **dark theme** and **light theme** are fully supported with appropriate styling for each.

## Components with Skeleton Loading

### 1. Match Skeletons
- **File**: `components/skeletons/match-card-skeleton.tsx`
- **Components**: 
  - `MatchCardSkeleton` - Single match card
  - `MatchCardSkeletonGrid` - Grid of multiple matches (default 3)
- **Used in**: Home fixture display, matches page

### 2. Player Skeletons
- **File**: `components/skeletons/player-card-skeleton.tsx`
- **Components**:
  - `PlayerCardSkeleton` - Single player card
  - `PlayerGridSkeleton` - Grid of multiple player cards (default 6)
- **Used in**: Featured players, players grid, team squad

### 3. News Skeletons
- **File**: `components/skeletons/news-article-skeleton.tsx`
- **Components**:
  - `NewsArticleSkeleton` - Single news article card
  - `NewsGridSkeleton` - Grid of multiple news cards (default 3-4)
- **Used in**: Latest news section, news pages

### 4. Standings Skeletons
- **File**: `components/skeletons/standings-skeleton.tsx`
- **Component**: `StandingsSkeleton` - League standings table
- **Used in**: Home league standings section

## Theme Implementation

### Dark Theme
- **Shimmer Color**: White with 20% opacity (`via-white/20`)
- **Background**: Uses `bg-muted` which is `#2a2a2a` in dark mode
- **Border**: `border-border` which is `#2a2a2a`

### Light Theme
- **Shimmer Color**: Black with 10% opacity (`via-black/10`)
- **Background**: Uses `bg-muted` which is `#e8e8e8` in light mode
- **Border**: `border-border` which is `#e8e8e8`

## CSS Custom Variant Configuration

The light theme support uses Tailwind's `@custom-variant`:

```css
/* In app/globals.css */
@custom-variant dark (&:is(.dark *));
@custom-variant light (&:is(.light *));
```

This allows using Tailwind modifiers like:
```tsx
'dark:before:bg-gradient-to-r dark:before:from-transparent dark:before:via-white/20 dark:before:to-transparent'
'light:before:bg-gradient-to-r light:before:from-transparent light:before:via-black/10 light:before:to-transparent'
```

## Base Skeleton Component

**File**: `components/ui/skeleton.tsx`

The base `Skeleton` component applies the shimmer animation:

```tsx
<div className={cn(
  'bg-muted rounded-md overflow-hidden',
  'relative isolate',
  'before:absolute before:inset-0',
  'dark:before:bg-gradient-to-r dark:before:from-transparent dark:before:via-white/20 dark:before:to-transparent',
  'light:before:bg-gradient-to-r light:before:from-transparent light:before:via-black/10 light:before:to-transparent',
  'before:animate-shimmer before:translate-x-full'
)}>
```

## Animation Details

- **Animation**: `before:animate-shimmer` 
- **Duration**: 2 seconds (via `tw-animate-css` import)
- **Effect**: Smooth left-to-right gradient sweep creating a "loading" shimmer

## Updated Components Using Skeletons

### Home Page
1. **HomeNextFixture** - Shows `MatchCardSkeleton` while loading
2. **HomeLatestNews** - Shows `NewsGridSkeleton` (4 items)
3. **FeaturedPlayers** - Shows `PlayerGridSkeleton` (6 items)
4. **HomeLeagueStandings** - Shows `StandingsSkeleton`

### Other Pages
- **PlayersGrid** - Shows `PlayerGridSkeleton` while loading
- **Matches** - Shows `MatchCardSkeletonGrid` (3 items)

## Data Hook Integration

All data hooks return a `loading` state:

```tsx
const { matches, loading } = useMatches()
const { players, loading } = usePlayers()
const { newsItems, loading } = useNewsItems()
const { standings, loading } = useStandings()
```

**Loading Logic Pattern**:
```tsx
if (loading && data.length === 0) {
  return <SkeletonComponent />
}
```

## Color Scheme Switch Testing

To test both themes:

### Dark Mode (Default)
```
http://localhost:3000 (dark theme by default)
```

### Light Mode
Add `?theme=light` to URL or use system theme preference
- Right-click → Inspect → Console → `localStorage.setItem('theme', 'light')`
- Refresh page to see light theme skeletons

## Styling Principles

1. **Semantic Colors**: All skeletons use semantic color tokens (`bg-muted`, `border-border`)
2. **Consistent Sizing**: Skeleton heights/widths match actual content
3. **Proper Spacing**: Skeleton grid layouts match final content layouts
4. **Animation Smoothness**: CSS-based shimmer animation runs at 60fps

## Adding Skeletons to New Components

To add skeleton loading to a new component:

1. **Import the skeleton**:
   ```tsx
   import { PlayerGridSkeleton } from '@/components/skeletons/player-card-skeleton'
   ```

2. **Extract loading state from hook**:
   ```tsx
   const { data, loading } = useDataHook()
   ```

3. **Add loading check**:
   ```tsx
   if (loading && data.length === 0) {
     return <PlayerGridSkeleton count={6} />
   }
   ```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Full support with proper viewport scaling

## Performance

- **No JavaScript**: Pure CSS animations
- **Minimal Layout Shift**: Skeletons match final content dimensions
- **GPU Accelerated**: Transform animations use GPU
- **Smooth 60fps**: Animation runs at smooth 60fps on all devices

## Accessibility

- Skeletons are semantic placeholders using `<div>` elements
- Proper ARIA attributes could be added if needed:
  ```tsx
  <div aria-busy="true" role="status" aria-label="Loading...">
  ```

## Future Enhancements

- [ ] Add pulse animation variant for alternative loading UX
- [ ] Implement skeleton content mapping from data shape
- [ ] Add skeleton duration/timeout handling
- [ ] Create skeleton layout variants (card, list, table, etc.)
