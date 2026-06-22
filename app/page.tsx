"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ClubInfoSection } from "@/components/club-info-section"
import { HomeNextFixture } from "@/components/home-next-fixture"
import { HomeLatestNews } from "@/components/home-latest-news"
import { HomeLeagueStandings } from "@/components/home-league-standings"
import { HomeCommunitySection } from "@/components/home-community-section"
import { HomeAboutGallery } from "@/components/home-about-gallery"
import { HomeStatsShowcase } from "@/components/home-stats-showcase"
import { HomeNewsletter } from "@/components/home-newsletter"
import { GalleryShowcase } from "@/components/gallery-showcase"
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
        <ClubInfoSection />
        
        {/* Three Column Section */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HomeNextFixture />
              <HomeLatestNews />
              <HomeLeagueStandings />
            </div>
          </div>
        </section>

        <HomeCommunitySection />
        <HomeAboutGallery />
        <HomeStatsShowcase />
        <HomeNewsletter />
        <GalleryShowcase />
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
