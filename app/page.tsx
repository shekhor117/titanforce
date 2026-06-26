"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ClubInfoSection } from "@/components/club-info-section"
import { HomeNextFixture } from "@/components/home-next-fixture"
import { HomeLatestNews } from "@/components/home-latest-news"
import { HomeLeagueStandings } from "@/components/home-league-standings"
import { HomeAboutGallery } from "@/components/home-about-gallery"
import { HomeStatsShowcase } from "@/components/home-stats-showcase"
import { PremiumMatchStats } from "@/components/premium-match-stats"
import { PlayersGrid } from "@/components/players-grid"
import { HomeShopLatest } from "@/components/home-shop-latest"
import { GalleryShowcase } from "@/components/gallery-showcase"
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
        <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
        <ClubInfoSection />
        
        {/* Main 3-Column Layout */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Premium Stats */}
              <div className="lg:col-span-1">
                <PremiumMatchStats />
              </div>

              {/* Center Column - Heatmap & Top Players */}
              <div className="lg:col-span-1">
                <HomeStatsShowcase />
              </div>

              {/* Right Column - Next Fixtures */}
              <div className="lg:col-span-1">
                <HomeNextFixture />
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <HomeLatestNews />

        {/* Upcoming Fixtures & Partners Section */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">UPCOMING FIXTURES</h3>
              <HomeLeagueStandings />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">OUR PARTNERS</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Partners placeholder */}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-red-600 to-red-700">
          <div className="max-w-7xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">JOIN THE TITAN FAMILY!</h2>
            <p className="mb-6 text-red-50">Get the latest news, match updates and exclusive offers.</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded text-black" />
              <button className="px-6 py-3 bg-red-900 hover:bg-red-800 rounded font-bold">SUBSCRIBE</button>
            </form>
          </div>
        </section>

        {/* About */}
        <HomeAboutGallery />

        {/* Shop */}
        <HomeShopLatest />

        {/* Gallery */}
        <GalleryShowcase />

        {/* Contact */}
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
