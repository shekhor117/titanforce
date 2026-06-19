import { Metadata, Viewport } from 'next'
import { generatePageMetadata, defaultViewport } from '@/lib/seo-utils'

export const viewport: Viewport = defaultViewport

export const metadata: Metadata = generatePageMetadata({
  title: 'Team Squad - Titan Force FC',
  description: 'Explore the Titan Force FC squad. View player profiles, statistics, and team roster.',
  url: 'https://titanforcemulikandi.vercel.app/squad',
})

export default function TeamSquadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
