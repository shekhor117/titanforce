# Text Reveal Animation Guide

## Overview

The Text Reveal animation component provides character-by-character, word-by-word, or line-by-line text animations that trigger when elements enter the viewport.

## Components

### TextReveal Component

Located in `/components/text-reveal.tsx`

```tsx
import { TextReveal } from '@/components/text-reveal'

export function MyComponent() {
  return (
    <TextReveal 
      variant="characters"
      duration={0.03}
      staggerChildren={0.01}
      className="text-3xl font-bold"
    >
      Your text here
    </TextReveal>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | Required | The text to animate |
| `variant` | `'characters' \| 'words' \| 'lines'` | `'characters'` | Animation style |
| `className` | `string` | `''` | CSS classes |
| `duration` | `number` | `0.05` | Duration per item (seconds) |
| `staggerChildren` | `number` | `0.02` | Delay between items (seconds) |
| `delay` | `number` | `0` | Initial delay before animation starts |

## Variants

### Characters (Default)
Each character animates in individually, creating a typewriter-like effect.

```tsx
<TextReveal variant="characters" duration={0.03} staggerChildren={0.01}>
  TITAN FORCE
</TextReveal>
```

**Best for:**
- Large headings
- Emphasis on impact
- Branding elements

### Words
Each word animates in as a unit.

```tsx
<TextReveal variant="words" duration={0.1} staggerChildren={0.08}>
  We are more than a club
</TextReveal>
```

**Best for:**
- Body text
- Longer descriptions
- Paragraphs

### Lines
Each line animates in separately (split by `\n`).

```tsx
<TextReveal variant="lines" duration={0.15} staggerChildren={0.12}>
  First line
  Second line
  Third line
</TextReveal>
```

**Best for:**
- Multi-line headings
- Structured content
- Testimonials

## Presets

Use the `useTextRevealVariants` hook from `/hooks/use-text-reveal.ts` for quick configurations:

```tsx
import { textRevealPresets } from '@/hooks/use-text-reveal'

// Fast character reveal
<TextReveal {...textRevealPresets.fastCharacter}>Text</TextReveal>

// Word by word
<TextReveal {...textRevealPresets.wordByWord}>Text</TextReveal>

// Line by line
<TextReveal {...textRevealPresets.lineByLine}>Text</TextReveal>
```

## Examples

### Hero Title
```tsx
<h1>
  <TextReveal 
    variant="characters"
    duration={0.03}
    staggerChildren={0.01}
    delay={0.2}
    className="text-5xl font-bold"
  >
    TITAN FORCE
  </TextReveal>
</h1>
```

### Section Heading
```tsx
<TextReveal 
  variant="words"
  duration={0.08}
  staggerChildren={0.06}
  className="text-2xl font-bold text-primary"
>
  Meet Our Squad
</TextReveal>
```

### Multi-line Testimonial
```tsx
<TextReveal 
  variant="lines"
  duration={0.12}
  staggerChildren={0.1}
  className="text-lg italic text-muted-foreground"
>
  We are more than a club
  We are a community
  We are Titan Force
</TextReveal>
```

## Current Usage

The text reveal animation is applied to:

1. **Hero Component** (`/components/hero.tsx`)
   - "TITAN FORCE" title (character reveal)
   - "MULIKANDI" subtitle (character reveal)
   - Staggered with buttons and description

## Integration Tips

1. **Performance:** Character reveals on large text blocks can be resource-intensive. Use `duration={0.05}` or higher for better performance.

2. **Mobile:** Consider using longer durations on mobile for better readability:
   ```tsx
   <TextReveal 
     duration={isMobile ? 0.05 : 0.03}
     staggerChildren={isMobile ? 0.02 : 0.01}
   >
     Text
   </TextReveal>
   ```

3. **Accessibility:** The animation respects `prefers-reduced-motion` through Framer Motion's built-in support.

4. **Stacking Animations:** Combine delays to create sequences:
   ```tsx
   <TextReveal delay={0} variant="characters">Line 1</TextReveal>
   <TextReveal delay={0.5} variant="characters">Line 2</TextReveal>
   <TextReveal delay={1} variant="characters">Line 3</TextReveal>
   ```

## Animation Timing Guide

| Speed | Duration | Stagger | Feel |
|-------|----------|---------|------|
| Fast | 0.02 | 0.005 | Energetic, snappy |
| Medium | 0.03-0.05 | 0.01-0.02 | Balanced, smooth |
| Slow | 0.08-0.1 | 0.03-0.05 | Dramatic, elegant |

## Viewport Triggers

All text reveals trigger when:
- Element enters viewport
- Margin: `-50px` (element starts animating 50px before it's visible)
- `once: true` (animation only plays once)

To customize viewport behavior, modify the `viewport` prop in `/components/text-reveal.tsx`.
