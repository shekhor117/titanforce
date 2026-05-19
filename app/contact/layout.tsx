import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Titan Force FC',
  description: 'Get in touch with Titan Force FC. Contact us for inquiries, sponsorships, or feedback.',
  url: 'https://titanforcefc.com/contact',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
