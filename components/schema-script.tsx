'use client'

import { getOrganizationSchema } from '@/lib/seo-utils'

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getOrganizationSchema()),
      }}
    />
  )
}
