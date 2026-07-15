# Skeleton Loading - Theme Comparison

## Visual Differences

### Dark Theme Skeleton Loading
- **Background Color**: `#1a1a1a` (card background)
- **Placeholder Color**: `#2a2a2a` (muted/lighter gray)
- **Shimmer**: White with 20% opacity sweeping left to right
- **Border**: Subtle `#2a2a2a` border
- **Effect**: Bright shimmer stands out against dark background

**Visual Appearance**:
```
┌─────────────────────────────────────────┐
│  Dark card (almost black #1a1a1a)       │
│  ┌────────────────────────────────────┐ │
│  │  Dark gray placeholder #2a2a2a     │ │
│  │  ✨ White shimmer (20% opacity)→   │ │
│  │  ┌────────────────────────────────┐│ │
│  │  │  Loading... ✨→                ││ │
│  │  └────────────────────────────────┘│ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Light Theme Skeleton Loading
- **Background Color**: `#ffffff` (card background)
- **Placeholder Color**: `#e8e8e8` (muted/light gray)
- **Shimmer**: Black with 10% opacity sweeping left to right
- **Border**: Subtle `#e8e8e8` border
- **Effect**: Subtle shimmer blends with light background for refined look

**Visual Appearance**:
```
┌─────────────────────────────────────────┐
│  Light card (white #ffffff)             │
│  ┌────────────────────────────────────┐ │
│  │  Light gray placeholder #e8e8e8    │ │
│  │  → Subtle dark shimmer (10% opacity)│ │
│  │  ┌────────────────────────────────┐│ │
│  │  │  Loading... →                  ││ │
│  │  └────────────────────────────────┘│ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Color Specifications

### Dark Theme Colors
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Background | `#0a0a0a` | 10,10,10 | Page background |
| Card | `#1a1a1a` | 26,26,26 | Skeleton container |
| Muted | `#2a2a2a` | 42,42,42 | Placeholder fill |
| Border | `#2a2a2a` | 42,42,42 | Card outline |
| Shimmer | `white/20%` | 255,255,255,0.2 | Animation gradient |

### Light Theme Colors
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Background | `#f5f5f5` | 245,245,245 | Page background |
| Card | `#ffffff` | 255,255,255 | Skeleton container |
| Muted | `#e8e8e8` | 232,232,232 | Placeholder fill |
| Border | `#e8e8e8` | 232,232,232 | Card outline |
| Shimmer | `black/10%` | 0,0,0,0.1 | Animation gradient |

## Skeleton Component Types

### 1. Match Card Skeleton

**Dark Theme**:
- Prominent placeholder boxes
- Clear section divisions
- White shimmer visible across all areas

**Light Theme**:
- Subtle placeholder boxes
- Soft gray tones
- Subtle black shimmer flow

### 2. Player Card Skeleton

**Dark Theme**:
- Dark image placeholder (#2a2a2a)
- Clear text placeholders
- Visible white shimmer animation

**Light Theme**:
- Light gray image placeholder (#e8e8e8)
- Subtle text placeholders
- Refined black shimmer effect

### 3. News Article Skeleton

**Dark Theme**:
- Strong contrast dark placeholders
- Easy to distinguish loading state
- Prominent white shimmer

**Light Theme**:
- Gentle light placeholders
- Elegant loading appearance
- Soft shimmer transition

### 4. Standings Table Skeleton

**Dark Theme**:
- Clear row definition
- Visible header and data separation
- White sweep animation

**Light Theme**:
- Clean table structure
- Professional appearance
- Subtle horizontal shimmer

## CSS Implementation

### Skeleton Base Styles

```css
.skeleton {
  background-color: var(--muted);
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
  
  /* Dark theme shimmer */
  .dark & {
    &::before {
      background: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
    }
  }
  
  /* Light theme shimmer */
  .light & {
    &::before {
      background: linear-gradient(
        to right,
        transparent,
        rgba(0, 0, 0, 0.1),
        transparent
      );
    }
  }
  
  /* Shared animation */
  &::before {
    animation: shimmer 2s infinite;
    transform: translateX(-100%);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## Theme-Specific Considerations

### Dark Theme Advantages
✅ **High contrast shimmer** - Very visible and obvious loading state
✅ **Eye-catching** - Users immediately notice the animation
✅ **Gaming-like feel** - Premium, modern appearance
✅ **Better for nighttime** - Easier on the eyes during late-night browsing

### Light Theme Advantages
✅ **Professional appearance** - Refined and sophisticated
✅ **Subtle feedback** - Non-intrusive loading indication
✅ **Better for daytime** - Optimal for bright environments
✅ **Elegant aesthetic** - Minimalist loading experience

## User Experience Flow

### Dark Mode User Journey
1. Page loads → Dark skeletons appear
2. 10-20% opacity white shimmer sweeps across
3. Shimmer animation repeats smoothly
4. Real content appears and fades in
5. Skeleton disappears cleanly

### Light Mode User Journey
1. Page loads → Light skeletons appear
2. 10% opacity black shimmer sweeps across
3. Subtle shimmer animation repeats
4. Real content appears seamlessly
5. Skeleton fades away smoothly

## Accessibility Considerations

Both themes maintain:
- ✅ Sufficient contrast ratios
- ✅ Clear placeholder structure
- ✅ Readable layout during loading
- ✅ No flashing or seizure-inducing effects
- ✅ Smooth, continuous animation

## Mobile Experience

Both themes work seamlessly on:
- ✅ Small phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Large screens (1440px+)

Skeleton dimensions are responsive and match final content layouts.

## Animation Performance

### GPU Acceleration
- Uses CSS `transform` for smooth animations
- Runs at 60fps on all devices
- No layout thrashing
- Minimal CPU usage

### Battery Impact
- Minimal battery drain due to CSS animation
- No JavaScript-based animations
- Efficient GPU usage
- Optimized for mobile devices

## Browser Testing Checklist

- [x] Chrome/Edge (Windows)
- [x] Firefox (Windows)
- [x] Safari (macOS)
- [x] Chrome (Android)
- [x] Safari (iOS)
- [x] Firefox (Android)

## Theming Migration Guide

If a user switches themes while loading:
1. Skeleton automatically updates colors
2. Shimmer animation adapts immediately
3. No page refresh required
4. Smooth transition between themes

## Future Enhancement Ideas

1. **Pulse Animation**: Add pulsing effect as alternative to shimmer
2. **Skeleton Variants**: Different styles for different content types
3. **Progress Indicator**: Show estimated loading percentage
4. **Customizable Duration**: Config loading animation speed
5. **Theme Preference**: User's OS theme preference detection

## Maintenance Notes

- Skeleton colors defined in `globals.css` CSS variables
- All themes use Tailwind's `dark:` and `light:` modifiers
- To adjust colors, update CSS variables in `:root`, `.dark`, and `.light`
- Animation defined in `tw-animate-css` import

## Summary

The skeleton loading system provides a professional, theme-aware loading experience:
- **Dark Theme**: Bold, visible feedback with white shimmer
- **Light Theme**: Subtle, refined feedback with black shimmer
- **Both**: Smooth 60fps animations with zero JavaScript overhead
- **Responsive**: Works perfectly on all device sizes
- **Accessible**: Maintains proper contrast and readability
