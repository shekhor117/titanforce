import type { Metadata } from 'next'
import { VanguardHero } from '@/components/vanguard-hero'

export const metadata: Metadata = {
  title: 'VANGUARD - Creative Agency',
  description: 'World-Class Digital Collective. We build fierce brand identities that lead the market.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function VanguardPage() {
  return <VanguardHero />
}
