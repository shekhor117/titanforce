# Scroll Animation System

This project includes a comprehensive scroll animation system powered by Framer Motion. Animations trigger when elements scroll into view.

## Components Available

### 1. ScrollAnimatedElement
Single element animation wrapper for fade-in and slide effects.

**Usage:**
```tsx
import { ScrollAnimatedElement } from '@/components/scroll-animated-element'

<ScrollAnimatedElement 
  variant="fadeInUp"
  delay={0.2}
  duration={0.6}
>
  <div>Your content here</div>
</ScrollAnimatedElement>
```

**Props:**
- `variant`: Animation type - 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'slideInUp' | 'slideInLeft' | 'slideInRight'
- `delay`: Delay before animation starts (default: 0)
- `duration`: Animation duration in seconds (default: 0.6)
- `once`: Animation triggers only once (default: true)
- `margin`: IntersectionObserver margin for trigger point (default: '0px 0px -100px 0px')

### 2. ScrollStaggerContainer
Container that staggers animations of its children for wave effects.

**Usage:**
```tsx
import { ScrollStaggerContainer } from '@/components/scroll-stagger-container'

<ScrollStaggerContainer 
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  staggerDelay={0.1}
  variant="fadeInUp"
>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</ScrollStaggerContainer>
```

**Props:**
- `staggerDelay`: Delay between each child animation (default: 0.1)
- `duration`: Animation duration in seconds (default: 0.6)
- `variant`: Animation type for children
- `once`: Animations trigger only once (default: true)
- `margin`: IntersectionObserver margin

### 3. useScrollAnimation Hook
Custom hook for manually controlling scroll animations.

**Usage:**
```tsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

function MyComponent() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={customVariants}
    >
      Content
    </motion.div>
  )
}
```

## Animation Variants

### Available Animations:
- **fadeInUp**: Fade in with upward movement (40px)
- **fadeInLeft**: Fade in with leftward movement (40px)
- **fadeInRight**: Fade in with rightward movement (40px)
- **fadeInScale**: Fade in with scale effect (0.8 to 1)
- **slideInUp**: Fade in with larger upward movement (80px)
- **slideInLeft**: Fade in with larger leftward movement (80px)
- **slideInRight**: Fade in with larger rightward movement (80px)

## Examples in Use

The following components already use scroll animations:
- **ClubInfoSection**: Staggered fadeInUp for info cards
- **HomeLatestNews**: Staggered fadeInUp for news grid
- **HomeNextFixture**: fadeInLeft for fixture card
- **PlayersGrid**: fadeInUp for players carousel

## Customization

To add custom animations, edit the `animationVariants` object in:
- `/components/scroll-animated-element.tsx`
- `/components/scroll-stagger-container.tsx`

Add new variants:
```tsx
const animationVariants = {
  // ... existing variants
  customFade: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 },
  }
}
```

## Performance Tips

1. Use `once={true}` to prevent re-animations on scroll back (better performance)
2. Adjust the `margin` value to trigger animations earlier or later
3. Keep `staggerDelay` between 0.05-0.15 for smooth cascading effects
4. Use `duration` between 0.4-0.8 seconds for natural motion

## Browser Support

Scroll animations use Intersection Observer API which is supported in all modern browsers. Fallback for older browsers: animations will still play but won't wait for scroll.
