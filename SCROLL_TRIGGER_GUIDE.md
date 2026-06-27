# Scroll Trigger Animation Guide

এই গাইডটি সব স্ক্রল-ট্রিগার্ড অ্যানিমেশন ফিচার নিয়ে আলোচনা করে যা প্রতিবার স্ক্রল করার সময় চলে।

## Available Components

### 1. ScrollProgressAnimation
স্ক্রল করার সময় রিয়েল-টাইমে অ্যানিমেট হয়

```tsx
import { ScrollProgressAnimation } from '@/components/scroll-progress-animation'

<ScrollProgressAnimation className="my-element">
  <p>এই এলিমেন্ট স্ক্রল করার সময় ফেড ইন হবে</p>
</ScrollProgressAnimation>
```

**বৈশিষ্ট্য:**
- স্ক্রল করার সময় অপ্যাসিটি পরিবর্তন
- ট্রান্সলেট এবং স্কেল ট্রান্সফর্ম
- গতিশীল ভিজ্যুয়াল ফিডব্যাক

### 2. ScrollParallax
স্ক্রল করার সময় প্যারালাক্স ইফেক্ট

```tsx
import { ScrollParallax } from '@/components/scroll-progress-animation'

<ScrollParallax speed={0.5} className="my-element">
  <img src="image.jpg" alt="parallax effect" />
</ScrollParallax>
```

**প্রপস:**
- `speed`: 0-1, প্যারালাক্স ইন্টেনসিটি

### 3. ScrollCounter
স্ক্রল প্রগ্রেসের উপর ভিত্তি করে সংখ্যা বৃদ্ধি

```tsx
import { ScrollCounter } from '@/components/scroll-progress-animation'

<ScrollCounter from={0} to={100} suffix="+" />
```

**প্রপস:**
- `from`: স্টার্ট সংখ্যা (ডিফল্ট: 0)
- `to`: শেষ সংখ্যা (ডিফল্ট: 100)
- `suffix`: যোগ করার টেক্সট (যেমন "+", "%")

### 4. ScrollFill
স্ক্রল করার সময় ফিল অ্যানিমেশন

```tsx
import { ScrollFill } from '@/components/scroll-progress-animation'

<ScrollFill direction="top" className="relative">
  <div>Content here</div>
</ScrollFill>
```

**প্রপস:**
- `direction`: 'top' | 'bottom' | 'left' | 'right'

## Hooks

### useScrollTrigger
স্ক্রল ইভেন্ট ট্র্যাক করার জন্য

```tsx
import { useScrollTrigger } from '@/hooks/use-scroll-trigger'

const ref = useRef(null)
useScrollTrigger(ref, {
  onScroll: (progress, velocity) => {
    console.log('Scroll progress:', progress)
    console.log('Scroll velocity:', velocity)
  },
  onEnter: () => console.log('Element entered viewport'),
  onLeave: () => console.log('Element left viewport'),
})
```

### usePageScrollVelocity
সম্পূর্ণ পেজ জুড়ে স্ক্রল বেগ ট্র্যাক করুন

```tsx
import { usePageScrollVelocity } from '@/hooks/use-scroll-trigger'

const velocity = usePageScrollVelocity()
console.log('Page scroll velocity:', velocity)
```

### useScrollProgress
পেজ টপ থেকে বটম পর্যন্ত স্ক্রল প্রগ্রেস

```tsx
import { useScrollProgress } from '@/hooks/use-scroll-trigger'

const progress = useScrollProgress()
console.log('Page scroll progress (0-1):', progress)
```

## Usage Examples

### Example 1: Stats Section
প্রতিটি স্ক্যাটাস আইটেম স্ক্রল করার সময় অ্যানিমেট হয়

```tsx
{stats.map((stat) => (
  <ScrollProgressAnimation key={stat.id}>
    <div className="stat-card">
      <div>{stat.value}</div>
      <div>{stat.label}</div>
    </div>
  </ScrollProgressAnimation>
))}
```

### Example 2: Parallax Background
ব্যাকগ্রাউন্ড ইমেজ স্ক্রল করার সময় সরে যায়

```tsx
<section>
  <ScrollParallax speed={0.7} className="absolute inset-0">
    <Image src="bg.jpg" fill />
  </ScrollParallax>
  <div className="relative">Content</div>
</section>
```

### Example 3: Progress Counter
ভিউপোর্টে এসে সংখ্যা গণনা শুরু করে

```tsx
<div className="text-4xl font-bold">
  <ScrollCounter from={0} to={120} suffix="+" />
</div>
```

## Performance Tips

1. **willChange সাথে শুরু করুন** - CSS optimizations
2. **Passive event listeners** - সব হুক passive listeners ব্যবহার করে
3. **Debounce if needed** - অনেক এলিমেন্ট থাকলে debounce বিবেচনা করুন
4. **Use requestAnimationFrame** - smooth animations এর জন্য

## Browser Support

- Chrome/Edge: সম্পূর্ণ সমর্থন
- Firefox: সম্পূর্ণ সমর্থন
- Safari: সম্পূর্ণ সমর্থন
- Mobile browsers: সম্পূর্ণ সমর্থন
