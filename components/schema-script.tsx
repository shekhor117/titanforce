'use client'

import Script from 'next/script'
import { getOrganizationSchema } from '@/lib/seo-utils'

export function OrganizationSchema() {
  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getOrganizationSchema()),
      }}
    />
  )
}

