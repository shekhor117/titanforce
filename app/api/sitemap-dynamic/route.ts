'use client'

import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanforcefc.com'

/**
 * Dynamic sitemap that includes player pages, matches, news, and products
 * This is a separate endpoint to handle client-side data fetching
 */
export async function GET() {
  try {
    // In production, fetch from your API or Supabase
    // For now, return a placeholder with instructions
    
    const dynamicSitemapUrl = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Dynamic content would be added here -->
  <!-- Player pages: /player/[number] -->
  <!-- News articles: /news/[id] -->
  <!-- Shop products: /shop/[id] -->
  <!-- Matches: /fixture/[id] -->
</urlset>
    `

    return new NextResponse(dynamicSitemapUrl, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[v0] Error generating dynamic sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
