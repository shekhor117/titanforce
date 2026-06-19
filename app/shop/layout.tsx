import { Metadata, Viewport } from 'next'
import { generatePageMetadata, defaultViewport } from '@/lib/seo-utils'

export const viewport: Viewport = defaultViewport

export const metadata: Metadata = generatePageMetadata({
  title: 'Shop - Titan Force FC',
  description: 'Shop official Titan Force FC merchandise, jerseys, and fan gear. Support your favorite team with authentic merchandise.',
  url: 'https://titanforcemulikandi.vercel.app/shop',
})

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
