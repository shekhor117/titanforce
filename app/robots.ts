import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanforcefc.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/squad', '/fixtures', '/news', '/gallery', '/trophies', '/shop', '/player', '/contact'],
        disallow: ['/admin', '/auth', '/dashboard', '/api', '/_next', '/public', '/*.json$'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    crawlDelay: 1,
  }
}
