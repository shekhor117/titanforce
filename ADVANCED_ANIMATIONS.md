# Advanced Scroll Animations Guide

This guide covers the advanced animation components added to enhance the website's visual experience with smooth, performant scroll-triggered animations.

## Components Overview

### 1. **Parallax Hero** (`parallax-hero.tsx`)
Creates parallax scrolling effects and word-by-word text reveals for hero sections.

**Features:**
- Parallax background movement
- Staggered word reveal animation
- Smooth scroll tracking

**Usage:**
```tsx
import { ParallaxHero, TextReveal } from '@/components/parallax-hero'

<ParallaxHero offset={50}>
  <ImageBackground />
</ParallaxHero>

<TextReveal 
  text="TITAN FORCE MULIKANDI"
  className="font-display font-bold"
  delay={0.2}
/>
```

**Applied To:** Hero section with full parallax background and staggered title text

---

### 2. **Counter Animation** (`counter-animation.tsx`)
Animated number counters that increment when elements enter viewport.

**Features:**
- Auto-increments from 0 to target value
- Viewport-triggered activation
- Custom prefix/suffix support
- Progress bar animations

**Usage:**
```tsx
import { CounterAnimation, ProgressBarAnimation } from '@/components/counter-animation'

<CounterAnimation
  end={120}
  suffix="+"
  duration={2}
  delay={0.1}
  className="text-3xl font-bold"
/>

<ProgressBarAnimation
  value={85}
  max={100}
  duration={1.5}
  showLabel={true}
/>
```

**Applied To:** Stats showcase (players, wins, fans, etc.)

---

### 3. **Magnetic Button** (`magnetic-button.tsx`)
Interactive buttons that follow the cursor with magnetic effects and glow pulses.

**Features:**
- Cursor-following magnetic attraction
- Glow pulse animations
- Smooth spring physics
- Customizable magnetic distance

**Usage:**
```tsx
import { MagneticButton, GlowPulse } from '@/components/magnetic-button'

<MagneticButton 
  onClick={handleClick}
  magnetDistance={30}
  pulseGlow={true}
>
  Click Me
</MagneticButton>

<GlowPulse 
  glowColor="rgba(220, 38, 38, 0.5)"
  duration={2}
  className="px-6 py-3 bg-red-600 rounded"
>
  CTA Button
</GlowPulse>
```

**Applied To:** Call-to-action buttons for enhanced interactivity

---

### 4. **Infinite Marquee** (`infinite-marquee.tsx`)
Seamless infinite scrolling content carousel for sponsors or logos.

**Features:**
- Infinite horizontal scroll
- Pause on hover
- Customizable speed and direction
- Perfect loop without gaps

**Usage:**
```tsx
import { InfiniteMarquee, MarqueeItem } from '@/components/infinite-marquee'

<InfiniteMarquee speed={20} direction="left" pauseOnHover={true}>
  {sponsors.map(sponsor => (
    <MarqueeItem key={sponsor.id}>
      <img src={sponsor.logo} alt={sponsor.name} />
    </MarqueeItem>
  ))}
</InfiniteMarquee>
```

**Applied To:** Sponsors section with infinite scrolling logos

---

### 5. **Zoom Gallery** (`zoom-gallery.tsx`)
Gallery items with zoom-in effects and lightbox modal viewing.

**Features:**
- Smooth zoom on hover
- Full-screen lightbox modal
- Backdrop blur effect
- Animated open/close transitions
- Click to expand any gallery item

**Usage:**
```tsx
import { ZoomGalleryItem } from '@/components/zoom-gallery'

{galleryItems.map(item => (
  <ZoomGalleryItem
    key={item.id}
    src={item.image}
    alt={item.title}
    className="col-span-1"
  />
))}
```

**Applied To:** Gallery showcase with enhanced zoom and lightbox effects

---

## Enhanced Components

### Hero Section
- **Parallax Background:** Moves at 50% scroll speed for depth
- **Text Reveal:** Words animate in sequence with stagger effect
- **Button Scale:** Hover and tap animations with spring physics

### Stats Section
- **Counter Animation:** Numbers count up when section scrolls into view
- **Stagger Delay:** Each stat animates with 0.1s delay for cascade effect
- **Hover State:** Cards scale up on interaction

### Match Cards
- **Scale Animation:** Cards scale 0.95 → 1 with stagger
- **Fade In:** Opacity fade from 0 to 1
- **Hover Scale:** Slight scale increase on hover (1 → 1.02)
- **Modal Animation:** Spring-based open/close with AnimatePresence

### Gallery
- **Zoom Scale:** 1 → 1.25 on hover with smooth easing
- **Overlay Gradient:** Appears on hover for context
- **Lightbox:** Smooth scale and fade animations with click to expand

---

## Animation Timing

- **Hero Text:** Staggered at 0.08s per word, 0.2s initial delay
- **Counter Numbers:** 2s duration with 0.1s stagger between items
- **Match Cards:** 0.5s duration with 0.1s delay per card
- **Gallery Zoom:** 0.7s duration for smooth scale effect
- **Modal:** Spring physics (stiffness: 100, damping: 20)

---

## Best Practices

1. **Performance:** All animations use GPU-accelerated transforms (transform, opacity)
2. **Accessibility:** Respects `prefers-reduced-motion` through Framer Motion
3. **Viewport Triggering:** Use `whileInView` to animate only visible elements
4. **Stagger Delays:** Keep between 0.05s - 0.15s for natural cascade feel
5. **Spring Physics:** Stiffness 100, damping 20 for snappy, bouncy feel

---

## Customization

To adjust any animation timing, duration, or effects, modify the component props:

```tsx
// Faster counters
<CounterAnimation end={100} duration={1} />

// Slower parallax
<ParallaxHero offset={100} />

// Different marquee speed
<InfiniteMarquee speed={30} />

// Custom magnetic distance
<MagneticButton magnetDistance={50} />
```

---

## Browser Support

All animations are supported in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

Uses Framer Motion 11+ with full SSR support for Next.js 16.
