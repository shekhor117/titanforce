import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanforcemulikandi.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/auth', '/dashboard', '/api', '/_next', '/public', '/*.json$'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
