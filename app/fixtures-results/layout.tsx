import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Fixtures & Results - Titan Force FC',
  description: 'View Titan Force FC match fixtures, results, and upcoming games. Follow our football team schedule and scores.',
  url: 'https://titanforcemulikandi.vercel.app/fixtures',
})

export default function FixturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
