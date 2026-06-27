# Neumorphism Design System Guide

Neumorphism (soft skeuomorphism) is a modern design trend that combines flat design with realistic shadows and highlights to create subtle, sophisticated UI elements.

## Available Neumorphic Classes

### Cards

#### `.neo-card` - Extruded Card (Default)
- Creates a raised, 3D appearance with outer shadows
- Best for: Featured content, stats, highlights
- Hover effect: Lifts up with enhanced shadows
- Active effect: Presses down with inset shadows

```html
<div class="neo-card p-6">
  <h3>Featured Card</h3>
  <p>This card appears raised from the surface</p>
</div>
```

#### `.neo-card-inset` - Inset Card (Pressed)
- Creates a sunken, 3D appearance with inset shadows
- Best for: Input areas, inactive states
- Hover effect: Deepens the inset effect

```html
<div class="neo-card-inset p-6">
  <h3>Inset Card</h3>
  <p>This card appears pressed into the surface</p>
</div>
```

#### `.neo-soft` - Soft Shadow Card
- Subtle, delicate shadow without strong depth
- Best for: Content cards, articles, soft UI
- Hover effect: Lifts slightly with shadow enhancement

```html
<div class="neo-soft p-6">
  <h3>Soft Card</h3>
  <p>This card has subtle, elegant shadows</p>
</div>
```

#### `.neo-floating` - Floating Card
- Creates a floating effect with light shadow and highlight
- Best for: Premium content, hero sections, eye-catching elements
- Hover effect: Floats higher with enhanced shadow

```html
<div class="neo-floating p-6">
  <h3>Floating Card</h3>
  <p>This card appears to float above the surface</p>
</div>
```

#### `.neo-panel` - Large Panel
- Large neumorphic container for sections
- Best for: Form sections, modals, large content areas
- Hover effect: Enhanced depth effect

```html
<div class="neo-panel">
  <h2>Large Panel Section</h2>
  <div class="space-y-4">
    <!-- Content here -->
  </div>
</div>
```

### Buttons

#### `.neo-btn` - Default Button
- Neumorphic button with neutral colors
- Hover: Lifts up with enhanced shadows
- Active: Presses down with inset shadows

```html
<button class="neo-btn">Click Me</button>
```

#### `.neo-btn neo-btn-primary` - Primary Button
- Red/primary colored neumorphic button
- Best for: Call-to-action, important actions
- Maintains neumorphic effect with primary color

```html
<button class="neo-btn neo-btn-primary">Primary Action</button>
```

### Form Elements

#### `.neo-input` - Input Field
- Neumorphic text input
- Focus state: Enhanced inset effect with primary color glow
- Best for: Forms, search, text entry

```html
<input type="text" class="neo-input" placeholder="Enter text..." />
```

#### `.neo-badge` - Badge
- Small neumorphic badge for labels and tags
- Circular border-radius
- Best for: Status indicators, tags, small labels

```html
<span class="neo-badge">New</span>
<span class="neo-badge">Featured</span>
```

## Usage Examples

### Using Component Library

```tsx
import { NeoCard, NeoButton, NeoBadge, NeoInput } from '@/components/neo-card'

export function Example() {
  return (
    <div className="space-y-6">
      <NeoCard variant="default" className="p-6">
        <h3>Card Title</h3>
        <p>Card content goes here</p>
      </NeoCard>

      <NeoCard variant="floating" className="p-6">
        <h3>Floating Card</h3>
        <p>This card floats above the surface</p>
      </NeoCard>

      <NeoButton variant="primary" onClick={() => console.log('Clicked!')}>
        Click Me
      </NeoButton>

      <NeoInput placeholder="Enter something..." />
      <NeoBadge>Featured</NeoBadge>
    </div>
  )
}
```

### Using CSS Classes

```html
<div class="neo-card p-6 mb-4">
  <h3 class="mb-2">Stats Overview</h3>
  <p>Content here</p>
</div>

<button class="neo-btn neo-btn-primary">Submit</button>

<input type="text" class="neo-input" placeholder="Search..." />
```

## Theme Variables

The neumorphism system uses theme-aware CSS variables that automatically adjust for light and dark modes:

### Dark Theme
- `--neo-shadow-light`: `rgba(255, 255, 255, 0.05)` - Light highlight shadow
- `--neo-shadow-dark`: `rgba(0, 0, 0, 0.5)` - Dark depth shadow

### Light Theme
- `--neo-shadow-light`: `rgba(255, 255, 255, 0.8)` - Light highlight shadow
- `--neo-shadow-dark`: `rgba(0, 0, 0, 0.15)` - Light depth shadow

## Best Practices

1. **Consistency**: Use the same neumorphic style throughout related elements
2. **Hierarchy**: Use `.neo-floating` for primary content, `.neo-soft` for secondary
3. **Spacing**: Combine with Tailwind spacing utilities (p-4, p-6, etc.)
4. **Contrast**: Ensure text has sufficient contrast with the neumorphic background
5. **Interaction**: Use `.neo-btn` for interactive elements to convey clickability
6. **Responsive**: Add responsive padding with `sm:p-4 md:p-6` etc.

## Integration with Existing Components

Replace existing card borders and shadows with neumorphic classes:

```tsx
// Before
<div className="border border-border rounded-lg p-6">
  Content
</div>

// After
<div className="neo-card p-6">
  Content
</div>
```

## Performance Notes

- Neumorphic shadows use CSS box-shadow (performant)
- Hover effects use `transform` for GPU acceleration
- Light mode uses simpler shadows for better performance
- All styles are theme-aware and responsive

## Customization

You can customize the neumorphic look by modifying CSS variables in `globals.css`:

```css
:root {
  --neo-shadow-light: rgba(255, 255, 255, 0.05);
  --neo-shadow-dark: rgba(0, 0, 0, 0.5);
}
```

Adjust the alpha values to increase/decrease the neumorphic effect intensity.
