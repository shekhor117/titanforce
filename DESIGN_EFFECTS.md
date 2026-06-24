# Glass Morphism & Neumorphism Design Effects

This document outlines the modern design effects implemented in the Titan Force FC website to create a premium, contemporary user experience.

## Overview

The website implements three primary design effect systems:
1. **Glassmorphism** - Frosted glass effect with backdrop blur
2. **Neumorphism** - Soft shadows creating depth perception
3. **Hybrid Fusion** - Blend of both techniques for visual interest

---

## Glassmorphism Effects

Glassmorphism is a modern design trend that creates a frosted glass aesthetic using CSS blur and transparency effects.

### CSS Classes

#### `.glass-btn`
- **Purpose**: Premium glass button with white/transparent background
- **Features**: Backdrop blur (16px), frosted border, soft shadows
- **Hover**: Lifts up with enhanced glow
- **Use Case**: Primary call-to-action buttons

```html
<button class="glass-btn">Click Me</button>
```

#### `.glass-btn-primary`
- **Purpose**: Glass button with primary brand color (Red #a71930)
- **Features**: Tinted glass effect, colored border, glow on hover
- **Use Case**: Secondary actions, matches section buttons

```html
<button class="glass-btn-primary">View Matches</button>
```

#### `.glass-btn-accent`
- **Purpose**: Glass button with accent color (Deep Red #d91e3f)
- **Features**: Strong color tint, enhanced glow effects
- **Use Case**: Important actions, engagement buttons

#### `.glass-card`
- **Purpose**: Glassmorphic card container
- **Features**: Subtle transparency, frosted appearance, inner glow
- **Use Case**: Content cards, team stats, news previews

```html
<div class="glass-card">
  <!-- Card content -->
</div>
```

#### `.glass-card-accent`
- **Purpose**: Glassmorphic card with brand color gradient
- **Features**: Primary to accent color gradient, enhanced hover effects
- **Use Case**: Featured content, highlighted statistics

```html
<div class="glass-card-accent rounded-lg p-4">
  <!-- Featured content -->
</div>
```

#### `.glass-panel`
- **Purpose**: Premium glassmorphic panel with enhanced blur
- **Features**: 20px backdrop blur, saturated colors, composite shadows
- **Use Case**: Large content sections, form containers

```html
<div class="glass-panel rounded-xl p-8">
  <!-- Panel content -->
</div>
```

#### `.glass-container-premium`
- **Purpose**: Ultra-premium glassmorphic container
- **Features**: 25px blur, extreme saturation, multiple shadow layers
- **Use Case**: Navigation bars, hero sections

#### `.glass-text`
- **Purpose**: Glassmorphic text container with left border
- **Features**: Quote-style design with accent border
- **Use Case**: Testimonials, highlights, important notices

#### `.glass-text-accent`
- **Purpose**: Glassmorphic text with accent border and gradient
- **Features**: Red to pink gradient background
- **Use Case**: Featured quotes, special announcements

### Light Mode Adjustments

All glass effects have light mode variants that automatically adjust:
- Higher opacity backgrounds for visibility
- Adjusted shadow colors for light backgrounds
- Border color adjustments for contrast

---

## Neumorphism Effects

Neumorphism (new + skeuomorphism) creates depth through soft shadows and highlights, mimicking real-world surfaces.

### CSS Classes

#### `.neomorph-base`
- **Purpose**: Base neumorphic element
- **Features**: Gradient background, soft shadows with light/dark play
- **Use Case**: Foundational neumorphic component

#### `.neomorph-btn`
- **Purpose**: Neumorphic button
- **Features**: Gradient background, complex shadow system
- **Hover**: Reduces shadows for pressed effect
- **Active**: Further reduced shadows
- **Use Case**: Interactive buttons, form controls

```html
<button class="neomorph-btn">Submit</button>
```

#### `.neomorph-card`
- **Purpose**: Neumorphic card container
- **Features**: Gradient background, layered shadows, subtle border
- **Hover**: Enhanced shadows, lifts up
- **Use Case**: Player cards, content cards, sections

```html
<div class="neomorph-card rounded-lg p-6">
  <!-- Card content -->
</div>
```

#### `.neomorph-convex`
- **Purpose**: Soft convex neumorphism effect
- **Features**: Symmetric shadows creating raised appearance
- **Use Case**: Decorative elements, background containers

#### `.neomorph-concave`
- **Purpose**: Pressed/recessed neumorphism effect
- **Features**: Inset shadows creating sunken appearance
- **Use Case**: Active states, pressed buttons, input fields

### Animation Classes

#### `.glass-glow`
- **Purpose**: Pulsing glow animation for glassmorphic elements
- **Duration**: 3 seconds
- **Use Case**: Highlighted cards, featured sections

```html
<div class="glass-card glass-glow">
  <!-- Glowing content -->
</div>
```

#### `.neomorph-pulse`
- **Purpose**: Pulsing shadow animation for neumorphic elements
- **Duration**: 2.5 seconds
- **Use Case**: Call-to-action elements, important cards

```html
<button class="neomorph-btn neomorph-pulse">Important Action</button>
```

---

## Hybrid Fusion Effects

Fusion effects blend glassmorphism and neumorphism for a unique visual style.

### CSS Classes

#### `.fusion-modern`
- **Purpose**: Modern blend of glass and neumorphic effects
- **Features**: Blur background, layered shadows, gradient overlay
- **Hover**: Enhanced glow and lift effect
- **Use Case**: Contact forms, premium containers

```html
<div class="fusion-modern rounded-lg p-8">
  <!-- Fused content -->
</div>
```

#### `.fusion-accent`
- **Purpose**: Fusion with primary brand color
- **Features**: Gradient with primary color, enhanced effects
- **Hover**: Strong glow effect with accent color
- **Use Case**: Featured sections, hero containers, main CTAs

```html
<div class="fusion-accent rounded-xl p-8">
  <!-- Accent fusion content -->
</div>
```

---

## Implementation Examples

### Hero Section
```tsx
<section className="fusion-modern">
  {/* Hero content */}
</section>
```

### Club Stats
```tsx
<div className="glass-card-accent rounded-lg p-4">
  <p className="text-2xl font-bold">2025</p>
  <p className="text-sm">Founded</p>
</div>
```

### News Cards
```tsx
<Link href="/news/1" className="glass-card-accent">
  {/* News content */}
</Link>
```

### Navigation Bar
```tsx
<nav className="glass-container-premium">
  {/* Nav items */}
</nav>
```

### Contact Form
```tsx
<div className="glass-panel rounded-xl p-8">
  <form>
    {/* Form fields */}
  </form>
</div>
```

### Showcase Component
```tsx
<div className="fusion-modern rounded-lg p-8">
  {/* Showcase content */}
</div>
```

---

## Color Palette

The effects use the following color scheme:

- **Primary**: `#a71930` (Red)
- **Accent**: `#d91e3f` (Deep Red)
- **Background**: `#0a0a0a` (Dark)
- **Foreground**: `#f5f5f5` (Light)
- **Card**: `#1a1a1a` (Dark Gray)

---

## Browser Support

All effects are optimized for modern browsers with support for:
- CSS Backdrop-filter
- CSS Transforms
- CSS Gradients
- CSS Animations

**Supported Browsers**:
- Chrome/Edge 76+
- Firefox 103+
- Safari 18+

---

## Performance Considerations

1. **Backdrop-filter Performance**: Use sparingly for heavy blur effects
2. **Animation Performance**: Prefer `transform` and `opacity` for smooth 60fps animations
3. **Mobile Optimization**: Reduce blur intensity on mobile devices (handled automatically)
4. **Light Mode**: Slightly higher blur opacity due to lighter backgrounds

---

## Dark/Light Mode Support

All effects automatically adapt to the current theme:

- **Dark Mode** (Default): Enhanced blues, reds, and purples
- **Light Mode**: Adjusted transparency and shadow values

The theme is controlled via:
```tsx
<html className="dark"> {/* or "light" */}
```

---

## Customization Guide

### Adjusting Blur Amount
```css
.glass-card {
  backdrop-filter: blur(20px); /* Increase from 16px for more blur */
}
```

### Changing Shadow Intensity
```css
.neomorph-card:hover {
  box-shadow: 
    12px 12px 24px rgba(0,0,0,0.5), /* Increase from 10px 10px 20px */
    -5px -5px 15px rgba(255,255,255,0.1);
}
```

### Custom Gradient
```css
.fusion-accent {
  background: linear-gradient(135deg, rgba(255, 100, 100, 0.2) 0%, rgba(20, 20, 28, 0.8) 100%);
}
```

---

## Component Reference

### Used in Components

- **Navbar**: `.glass-container-premium`
- **Hero Stats**: `.glass-card-accent`
- **Club Info**: `.glass-card-accent`
- **Fixtures**: `.fusion-accent`
- **News Cards**: `.glass-card-accent`
- **Contact Form**: `.glass-panel` + `.fusion-modern`
- **Showcase**: Interactive toggle between all three effect types
- **Featured Players**: `.glass-card-accent`

---

## Future Enhancements

Potential additions for future updates:

1. **3D Perspective Effects**: Add depth with CSS transforms
2. **Animated Backgrounds**: Moving gradients behind glass
3. **Micro-interactions**: Detailed hover animations
4. **Accessibility**: High-contrast mode variants
5. **Performance**: Variable intensity options for mobile

---

## Resources

- [CSS Backdrop-filter - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [Glassmorphism UI - Design Trend](https://glassmorphism.com/)
- [Neumorphism - Design System](https://neumorphism.io/)
- [CSS Gradients - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient)

---

Last Updated: 2025
Version: 1.0
