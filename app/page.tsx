'use client'

import { Hero3D } from '@/components/hero-3d'
import { Features3D } from '@/components/features-3d'
import { Showcase3D } from '@/components/showcase-3d'
import { CTA3D } from '@/components/cta-3d'
import { Footer3D } from '@/components/footer-3d'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero3D />
        <Features3D />
        <Showcase3D />
        <CTA3D />
      </main>
      <Footer3D />
    </div>
  )
}
