# SEO Setup Guide - Titan Force FC

## Overview
Complete SEO optimization has been implemented for Titan Force FC website including:
- Comprehensive metadata and Open Graph tags
- JSON-LD structured data schemas
- Dynamic sitemap and robots.txt
- PWA manifest for progressive web app
- Page-specific metadata for all key pages
- Bilingual support (English & Bengali)

## What's Been Implemented

### 1. ✅ Enhanced Root Metadata (`app/layout.tsx`)
- **Title & Description**: Comprehensive, keyword-rich metadata
- **Open Graph Tags**: Proper og:title, og:description, og:image, og:url, og:type
- **Twitter Cards**: Twitter-specific meta tags for social sharing
- **Alternate Languages**: Language alternates for bilingual content (en, bn)
- **Organization Schema**: JSON-LD schema with club information

### 2. ✅ Page-Specific Metadata
All major pages now have optimized metadata:
- `about/` - About page with proper description
- `team-squad/` - Squad page with team information
- `fixtures-results/` - Fixtures page with event details
- `gallery/` - Gallery page with media descriptions
- `shop/` - Shop page with product information
- `contact/` - Contact page

**Files Created:**
- `app/about/page.tsx` - Updated with BreadcrumbList schema
- `app/team-squad/layout.tsx` - Added metadata
- `app/team-squad/page.tsx` - Updated with BreadcrumbList schema
- `app/fixtures-results/layout.tsx` - Added metadata
- `app/gallery/layout.tsx` - Added metadata
- `app/shop/layout.tsx` - Added metadata
- `app/contact/layout.tsx` - Added metadata

### 3. ✅ SEO Utilities (`lib/seo-utils.ts`)
Reusable functions for consistent metadata generation:

```typescript
// Generate standard page metadata
generatePageMetadata({
  title: 'Page Title',
  description: 'Page description',
  url: 'https://titanforcemulikandi.vercel.app/page'
})

// Generate player profile metadata
generatePlayerMetadata({
  name: 'Player Name',
  number: 7,
  position: 'Forward',
  image: '/player-image.jpg'
})

// Generate product metadata
generateProductMetadata({
  name: 'Product Name',
  description: 'Product description',
  price: 29.99,
  id: 'product-id'
})

// Get structured data schemas
getOrganizationSchema()
getBreadcrumbSchema(items)
getArticleSchema(article)
getSportsEventSchema(match)
getPersonSchema(player)
getProductSchema(product)
```

### 4. ✅ Dynamic Sitemap (`app/sitemap.ts`)
- Automatically generates sitemap.xml at `https://titanforcemulikandi.vercel.app/sitemap.xml`
- Includes all public routes with priorities:
  - Home page: priority 1.0
  - Key pages: priority 0.8-0.9
  - Dynamic routes (players, matches, news): priority 0.6-0.7
- Updates change frequency based on content type
- Excludes admin and auth routes

**Indexing:**
- Static pages: weekly/daily
- Player pages: weekly
- Match pages: never (fixed content)
- News articles: never (fixed content)
- Products: weekly

### 5. ✅ Robots.txt (`app/robots.ts`)
- Generates `robots.txt` file automatically
- Allows crawling of all public pages
- Blocks admin (/admin), auth (/auth), and dashboard routes
- Points to sitemap: `https://titanforcemulikandi.vercel.app/sitemap.xml`
- Crawl delay: 1 second for politeness

### 6. ✅ PWA Manifest (`public/manifest.json`)
- Progressive Web App configuration
- App name and branding
- Install shortcuts for Squad, Fixtures, and News
- Share target configuration
- Icons for different sizes (192px, 512px, maskable)
- Theme colors and display settings

### 7. ✅ JSON-LD Structured Data
Multiple schema types for rich search results:

- **Organization/SportsTeam**: Club information, location, contact
- **BreadcrumbList**: Navigation structure for better UX in search results
- **SportsEvent**: Match schedules and results
- **Person**: Player profiles with statistics
- **Article/NewsArticle**: News and updates
- **Product**: Shop merchandise with pricing
- **LocalBusiness**: Location and contact information

### 8. ✅ Home Page & Core Pages
Updated with:
- BreadcrumbList schema
- Proper metadata export
- SEO utilities integration

## How to Use the SEO Utilities

### For Adding Metadata to New Pages

**Option 1: Using Layout Files (Recommended)**
```typescript
// app/new-section/layout.tsx
import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Page Title - Titan Force FC',
  description: 'Detailed page description for search engines.',
  url: 'https://titanforcemulikandi.vercel.app/new-section',
})

export default function Layout({ children }) {
  return <>{children}</>
}
```

**Option 2: Using Page Component (Client Components)**
```typescript
// app/new-page/page.tsx
'use client'

import { useEffect } from 'react'
import { getBreadcrumbSchema } from '@/lib/seo-utils'

export default function Page() {
  useEffect(() => {
    // Add breadcrumb schema
    const breadcrumbs = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Section', url: '/section' },
      { name: 'Page', url: '/page' },
    ])

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(breadcrumbs)
    document.head.appendChild(script)

    return () => script.parentNode?.removeChild(script)
  }, [])

  return <div>{/* page content */}</div>
}
```

### For Dynamic Routes (Players, Products, News)

Create a `route` segment configuration:
```typescript
// app/player/[number]/route.ts
import { generatePlayerMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }) {
  const player = await getPlayer(params.number)
  return generatePlayerMetadata({
    name: player.name,
    number: player.number,
    position: player.position,
    image: player.imageUrl,
    description: player.bio,
  })
}
```

## Testing Your SEO

### 1. Check Sitemap
Visit: `https://titanforcemulikandi.vercel.app/sitemap.xml`
- Should show all public routes
- Verify priorities and change frequencies

### 2. Check Robots.txt
Visit: `https://titanforcemulikandi.vercel.app/robots.txt`
- Verify public routes are allowed
- Confirm admin routes are disallowed

### 3. Test with Google Search Console
1. Go to Google Search Console
2. Add your domain
3. Submit sitemap: `https://titanforcemulikandi.vercel.app/sitemap.xml`
4. Check for any indexing issues
5. Monitor coverage and indexing status

### 4. Test with Lighthouse
```bash
# Run Lighthouse audit
npm run build
npm run start
# Open http://localhost:3000 and run Lighthouse
```

### 5. Validate Structured Data
Use Google's Rich Results Test:
- Go to: https://search.google.com/test/rich-results
- Enter: https://titanforcemulikandi.vercel.app
- Check for rich results (SportsTeam, SportsEvent, etc.)

### 6. Check Open Graph Tags
Use: https://www.opengraphcheck.com/
- Enter your URL
- Verify og: tags display correctly
- Check preview image

## Environment Variables

Make sure these are set:
```env
NEXT_PUBLIC_SITE_URL=https://titanforcemulikandi.vercel.app
```

This is used in:
- Open Graph URLs
- Canonical tags
- Sitemap generation
- JSON-LD schemas

## Performance Considerations

### Core Web Vitals
The SEO setup includes considerations for:
- **LCP (Largest Contentful Paint)**: Hero image optimization
- **FID (First Input Delay)**: React concurrent features
- **CLS (Cumulative Layout Shift)**: Proper image dimensions

### Image Optimization
- Use Next.js Image component
- Provide proper dimensions
- Use modern formats (WebP)
- Add alt text for accessibility

### Font Loading
- Google Fonts are optimized (Bebas Neue, Barlow, Noto Sans Bengali)
- Using font-display: swap for better performance

## Multilingual SEO

The setup supports English and Bengali:

```typescript
alternates: {
  languages: {
    en: 'https://titanforcemulikandi.vercel.app/en',
    bn: 'https://titanforcemulikandi.vercel.app/bn',
  },
}
```

Update this as you implement language routing.

## Analytics Integration

The AdSense script is already integrated. For additional analytics:

```typescript
// Add to layout.tsx head
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID');
    `,
  }}
/>
```

## Maintenance Checklist

- [ ] Regularly update content with fresh information
- [ ] Monitor Google Search Console for errors
- [ ] Check Core Web Vitals monthly
- [ ] Update player profiles and statistics
- [ ] Add new match results to news
- [ ] Review and update meta descriptions
- [ ] Monitor search rankings for target keywords
- [ ] Test mobile responsiveness regularly

## Keywords for Titan Force FC

Primary keywords:
- Titan Force Mulikandi
- Titan Force
- Titan Force FC
- Titanforcemulikandi
- titanforcemulikandi

Long-tail keywords:
- Titan Force Mulikandi squad
- Titan Force Mulikandi fixtures
- Titan Force Mulikandi news
- Titan Force Mulikandi players
- Mulikandi sports club

## Useful Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Schemas](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

## Support

For questions or issues:
1. Check Google Search Console for errors
2. Use Lighthouse for performance insights
3. Validate markup with structured data test tools
4. Review logs in Next.js dev server

---

**Last Updated:** May 20, 2026
**Status:** ✅ Complete Implementation
