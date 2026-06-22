"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { NextFixture } from "@/components/next-fixture"
import { LatestNews } from "@/components/latest-news"
import { LeagueStandings } from "@/components/league-standings"
import { StatsOverview } from "@/components/stats-overview"
import { AboutSection } from "@/components/about-section"
import { JoinClubCTA } from "@/components/join-club-cta"
import { GalleryShowcase } from "@/components/gallery-showcase"
import { TrophyTimeline } from "@/components/trophy-timeline"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    // Add JSON-LD BreadcrumbList
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://titanforcemulikandi.vercel.app',
        },
      ],
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    // Check sessionStorage after mount
    const alreadyShown = sessionStorage.getItem("hero-shown")
    if (alreadyShown) {
      setHasSeenAnimation(true)
      setHeroLoading(false)
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handleLoadingChange = (loading: boolean) => {
    setHeroLoading(loading)
    if (!loading) {
      sessionStorage.setItem("hero-shown", "true")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
        
        {/* Main Content Sections */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Left Column - Next Fixture */}
              <div className="md:col-span-1">
                <NextFixture />
              </div>

              {/* Middle Column - Latest News */}
              <div className="md:col-span-1">
                <LatestNews />
              </div>

              {/* Right Column - League Standings */}
              <div className="md:col-span-1">
                <LeagueStandings />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <StatsOverview />

        {/* About Section */}
        <AboutSection />

        {/* Join Club CTA */}
        <JoinClubCTA />

        {/* Gallery & Timeline */}
        <GalleryShowcase />
        <TrophyTimeline />
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
