"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/site-layout"
import { Hero } from "@/components/hero"
import { GalleryShowcase } from "@/components/gallery-showcase"
import { TrophyTimeline } from "@/components/trophy-timeline"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    // Check sessionStorage after mount
    const alreadyShown = sessionStorage.getItem("hero-shown")
    if (alreadyShown) {
      setHasSeenAnimation(true)
      setHeroLoading(false)
    }
  }, [])

  const handleLoadingChange = (loading: boolean) => {
    setHeroLoading(loading)
    if (!loading) {
      sessionStorage.setItem("hero-shown", "true")
    }
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background stripe-bg">
        <main>
          <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
          <GalleryShowcase />
          <TrophyTimeline />
          <Contact />
        </main>
        {!heroLoading && <Footer />}
      </div>
    </SiteLayout>
  )
}
