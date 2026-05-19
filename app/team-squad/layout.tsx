import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Team Squad - Titan Force FC',
  description: 'Explore the Titan Force FC squad. View player profiles, statistics, and team roster.',
  url: 'https://titanforcefc.com/squad',
})

export default function TeamSquadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
