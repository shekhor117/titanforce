# Scroll Animation Guide - Titan Force Mulikandi

Complete guide to using scroll animations throughout the website.

## Overview

The website includes a comprehensive scroll animation system with multiple components and hooks for creating engaging scroll-based interactions. All animations are GPU-accelerated and respect user preferences for reduced motion.

## Components

### 1. ScrollProgressAnimation
Animates elements based on their position in the viewport.

**Features:**
- Scale: 0.85 → 1 (expands when centered)
- Opacity: 0.3 → 1 (becomes fully visible)
- Y Position: 50px → 0px (rises up)
- Rotation: 0° → 2° (slight rotation)

**Usage:**
```tsx
import { ScrollProgressAnimation } from '@/components/scroll-progress-animation'

<ScrollProgressAnimation>
  <div>Content that animates on scroll</div>
</ScrollProgressAnimation>
```

### 2. ScrollParallax
Creates parallax scroll effect with customizable speed.

**Usage:**
```tsx
import { ScrollProgressAnimation } from '@/components/scroll-progress-animation'

<ScrollParallax speed={0.5}>
  <img src="background.jpg" alt="parallax" />
</ScrollParallax>
```

### 3. ScrollAnimatedElement
Wraps elements with scroll-based fade and slide animations.

**Variants:**
- `fadeInUp` - Fade in with upward movement
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `fadeInScale` - Fade in with scale
- `slideInUp` - Slide up animation
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right

**Usage:**
```tsx
import { ScrollAnimatedElement } from '@/components/scroll-animated-element'

<ScrollAnimatedElement variant="fadeInUp" delay={0.2}>
  <h2>Heading</h2>
</ScrollAnimatedElement>
```

### 4. ScrollStaggerContainer
Container that staggers animations for multiple children.

**Usage:**
```tsx
import { ScrollStaggerContainer } from '@/components/scroll-stagger-container'

<ScrollStaggerContainer staggerDelay={0.1} variant="fadeInUp">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ScrollStaggerContainer>
```

### 5. TextReveal
Character/word/line by line text reveal animation.

**Variants:**
- `characters` - Reveal character by character
- `words` - Reveal word by word
- `lines` - Reveal line by line

**Usage:**
```tsx
import { TextReveal } from '@/components/text-reveal'

<TextReveal variant="characters" duration={0.03}>
  Titan Force Mulikandi
</TextReveal>
```

## Hooks

### useScrollIntoView
Detect when element enters viewport.

```tsx
import { useScrollIntoView } from '@/hooks/use-scroll-animations'

const { ref, isInView } = useScrollIntoView({
  threshold: 0.1,
  margin: '0px 0px -100px 0px'
})
```

### useParallaxScroll
Create parallax scroll effect.

```tsx
import { useParallaxScroll } from '@/hooks/use-scroll-animations'

const { ref, yOffset } = useParallaxScroll(0.5)
```

### useScrollCounter
Animate counter numbers on scroll.

```tsx
import { useScrollCounter } from '@/hooks/use-scroll-animations'

const { ref, count } = useScrollCounter(1000, 2) // End: 1000, Duration: 2s
```

## Performance Optimizations

- **GPU Acceleration**: All transforms use `will-change` for optimal performance
- **Passive Event Listeners**: Scroll events are passive to prevent jank
- **Motion Values**: Framer Motion's motion values for smooth 60 FPS animations
- **Intersection Observer**: Efficient viewport detection without continuous polling

## Accessibility

- Respects `prefers-reduced-motion` media query
- All animations have sensible fallbacks
- Content is readable without animations

## Best Practices

1. **Use ScrollProgressAnimation for cards** - Great for grid items
2. **Use ScrollAnimatedElement for sections** - Good for page sections
3. **Use TextReveal for headings** - Impressive text animations
4. **Use ScrollStaggerContainer for lists** - Coordinated multi-item animations
5. **Combine with hooks** - For custom scroll interactions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Animated Card Grid
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item, idx) => (
    <ScrollProgressAnimation key={idx}>
      <Card>{item}</Card>
    </ScrollProgressAnimation>
  ))}
</div>
```

### Staggered List
```tsx
<ScrollStaggerContainer>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</ScrollStaggerContainer>
```

### Hero Text Animation
```tsx
<TextReveal variant="characters" duration={0.05}>
  Welcome to Titan Force
</TextReveal>
```

## Troubleshooting

**Animations not working?**
- Ensure component is within scroll area
- Check console for errors
- Verify Framer Motion is installed

**Performance issues?**
- Reduce number of animated elements
- Use hardware acceleration
- Profile with DevTools

**Not visible?**
- Check `className` prop
- Verify element height is set
- Ensure element is in viewport during scroll
