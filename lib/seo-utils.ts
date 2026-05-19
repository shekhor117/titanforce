import { Metadata } from 'next'

const SITE_NAME = 'Titan Force Mulikandi'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanforcemulikandi.vercel.app'
const SITE_DESCRIPTION = 'Official football club website'
const SITE_IMAGE = `${SITE_URL}/og-image.jpg`
const SITE_LOCALE = 'en_US'

export interface SEOMetadataProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  canonicalUrl?: string
  alternates?: {
    languages?: Record<string, string>
  }
}

/**
 * Generate standard metadata for pages
 */
export function generatePageMetadata(props: SEOMetadataProps): Metadata {
  const {
    title = SITE_NAME,
    description = SITE_DESCRIPTION,
    image = SITE_IMAGE,
    url = SITE_URL,
    type = 'website',
    noindex = false,
    canonicalUrl,
    alternates,
  } = props

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    keywords: [
      'football',
      'Bangladesh',
      'Sylhet',
      'sports',
      'soccer',
      'Titan Force FC',
    ],
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
    },
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url,
      type,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      alternateLocale: ['bn_BD'],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@titanforcefc',
    },
    alternates: {
      canonical: canonicalUrl || url,
      ...alternates,
    },
    metadataBase: new URL(SITE_URL),
  }
}

/**
 * Generate metadata for team/player pages with structured data
 */
export function generatePlayerMetadata(props: {
  name: string
  number: number
  position: string
  image?: string
  description?: string
}): Metadata {
  const { name, number, position, image = SITE_IMAGE, description = '' } = props

  const playerTitle = `${name} #${number} | ${SITE_NAME}`
  const playerDesc =
    description ||
    `${name} plays as ${position} for Titan Force FC. View player profile, statistics, and career highlights.`
  const playerUrl = `${SITE_URL}/player/${number}`

  return generatePageMetadata({
    title: playerTitle,
    description: playerDesc,
    image,
    url: playerUrl,
    type: 'profile',
  })
}

/**
 * Generate metadata for product/shop pages
 */
export function generateProductMetadata(props: {
  name: string
  description: string
  price: number
  image?: string
  id: string
}): Metadata {
  const { name, description, price, image = SITE_IMAGE, id } = props

  const productTitle = `${name} | ${SITE_NAME} Shop`
  const productDesc = `${description} - ${SITE_NAME} Official Shop. Price: $${price}`
  const productUrl = `${SITE_URL}/shop/${id}`

  return generatePageMetadata({
    title: productTitle,
    description: productDesc,
    image,
    url: productUrl,
    type: 'article',
  })
}

/**
 * Organization schema for structured data
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: SITE_NAME,
    alternateName: 'টাইটান ফোর্স এফসি',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: SITE_IMAGE,
    sameAs: [
      'https://facebook.com/titanforcefc',
      'https://instagram.com/titanforcefc',
      'https://twitter.com/titanforcefc',
    ],
    location: {
      '@type': 'Place',
      name: 'Mulikandi, Sylhet',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sylhet',
        addressCountry: 'BD',
      },
    },
    sport: 'Football',
    areaServed: 'Bangladesh',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1XXX-XXXXXX',
      contactType: 'Customer Service',
    },
  }
}

/**
 * BreadcrumbList schema for navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Article/News schema
 */
export function getArticleSchema(props: {
  title: string
  description: string
  image?: string
  author?: string
  datePublished: Date
  dateModified?: Date
  url: string
}) {
  const { title, description, image = SITE_IMAGE, author = SITE_NAME, datePublished, dateModified, url } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

/**
 * SportsEvent schema for matches
 */
export function getSportsEventSchema(props: {
  name: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  homeTeam: string
  awayTeam: string
  image?: string
  url: string
}) {
  const { name, description, startDate, endDate, location = 'Sylhet', homeTeam, awayTeam, image = SITE_IMAGE, url } =
    props

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name,
    description,
    startDate: startDate.toISOString(),
    endDate: (endDate || startDate).toISOString(),
    eventStatus: startDate > new Date() ? 'EventScheduled' : 'EventFinished',
    eventAttendanceMode: 'OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sylhet',
        addressCountry: 'BD',
      },
    },
    image,
    url,
    competitor: [
      {
        '@type': 'SportsTeam',
        name: homeTeam,
      },
      {
        '@type': 'SportsTeam',
        name: awayTeam,
      },
    ],
  }
}

/**
 * Person schema for player profiles
 */
export function getPersonSchema(props: {
  name: string
  number?: number
  position: string
  image?: string
  description?: string
  url: string
}) {
  const { name, number, position, image = SITE_IMAGE, description, url } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    identifier: number?.toString(),
    jobTitle: `${position} - ${SITE_NAME}`,
    image,
    description,
    url,
    sameAs: [`${SITE_URL}/player/${number}`],
  }
}

/**
 * Product schema for shop items
 */
export function getProductSchema(props: {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  inStock?: boolean
  url: string
}) {
  const { name, description, image, price, currency = 'USD', inStock = true, url } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toString(),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
}
