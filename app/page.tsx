"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ClubInfoSection } from "@/components/club-info-section"
import { HomeNextFixture } from "@/components/home-next-fixture"
import { HomeLatestNews } from "@/components/home-latest-news"
import { PremiumMatchStats } from "@/components/premium-match-stats"
import { HomeAboutGallery } from "@/components/home-about-gallery"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    try {
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
        // Cleanup - safely remove script
        try {
          if (script && script.parentNode) {
            script.parentNode.removeChild(script)
          }
        } catch (e) {
          // Silently ignore cleanup errors
        }
      }
    } catch (error) {
      // Silently handle any DOM errors
      console.log("[v0] Schema setup error:", error instanceof Error ? error.message : "Unknown error")
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
        {/* Hero Section */}
        <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
        
        {/* Club Info Stats Strip */}
        <ClubInfoSection />

        {/* Main 3-Column Layout */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Premium Stats & Heatmap */}
              <div className="lg:col-span-1">
                <PremiumMatchStats />
              </div>

              {/* Center Column - Top Players */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">TOP PLAYERS</h3>
                    <a href="/team-squad" className="text-sm text-red-600 hover:text-red-700 font-semibold">
                      VIEW ALL
                    </a>
                  </div>
                  {/* Top Players Grid - will be populated from data */}
                  <div className="space-y-4">
                    {/* Player cards would go here */}
                  </div>
                </div>
              </div>

              {/* Right Column - Next Matches */}
              <div className="lg:col-span-1">
                <HomeNextFixture />
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <HomeLatestNews />

        {/* Upcoming Fixtures */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">UPCOMING FIXTURES</h2>
              <a href="/fixtures-results" className="text-sm text-red-600 hover:text-red-700 font-semibold">
                VIEW ALL FIXTURES →
              </a>
            </div>
            {/* Fixtures table will go here */}
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">OUR PARTNERS</h3>
            {/* Partner logos grid */}
          </div>
        </section>

        {/* About Section */}
        <HomeAboutGallery />

        {/* Contact Section */}
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
