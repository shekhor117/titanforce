import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Gallery - Titan Force FC',
  description: 'Browse Titan Force FC photo gallery. View team photos, match highlights, and club events.',
  url: 'https://titanforcefc.com/gallery',
})

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
