import { Metadata, Viewport } from 'next'
import { generatePageMetadata, defaultViewport } from '@/lib/seo-utils'

export const viewport: Viewport = defaultViewport

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Titan Force FC',
  description: 'Get in touch with Titan Force FC. Contact us for inquiries, sponsorships, or feedback.',
  url: 'https://titanforcemulikandi.vercel.app/contact',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
