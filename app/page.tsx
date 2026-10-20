"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ClubInfoSection } from "@/components/club-info-section"
import { HomeNextFixture } from "@/components/home-next-fixture"
import { HomeLatestNews } from "@/components/home-latest-news"
import { HomeLeagueStandings } from "@/components/home-league-standings"
import { HomeAboutGallery } from "@/components/home-about-gallery"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
// Load heavy sections without replacing the page with a full-page loader.
const PremiumMatchStats = dynamic(() => import("@/components/premium-match-stats").then(m => ({ default: m.PremiumMatchStats })))
const PlayersGrid = dynamic(() => import("@/components/players-grid").then(m => ({ default: m.PlayersGrid })))
const HomeShopLatest = dynamic(() => import("@/components/home-shop-latest").then(m => ({ default: m.HomeShopLatest })))
const GalleryShowcase = dynamic(() => import("@/components/gallery-showcase").then(m => ({ default: m.GalleryShowcase })))

export default function Home() {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

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
      setHasSeenAnimation(!!alreadyShown)
      sessionStorage.setItem("hero-shown", "true")

      return () => {
        try {
          if (script && script.parentNode) {
            script.parentNode.removeChild(script)
          }
        } catch (e) {
          // Silently ignore cleanup errors
        }
      }
    } catch (error) {
      console.log("[v0] Schema setup error:", error instanceof Error ? error.message : "Unknown error")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="overflow-hidden">
        <Hero skipAnimation={hasSeenAnimation} />
        <ClubInfoSection />
        
        {/* Three Column Section */}
        <section className="relative py-14 md:py-20 px-4 bg-background/70">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HomeNextFixture />
              <HomeLeagueStandings />
            </div>
          </div>
        </section>

        <HomeLatestNews />
        
        <Suspense fallback={null}>
          <PremiumMatchStats />
        </Suspense>
        
        <Suspense fallback={null}>
          <PlayersGrid />
        </Suspense>
        
        <HomeAboutGallery />
        
        <Suspense fallback={null}>
          <HomeShopLatest />
        </Suspense>
        
        <Suspense fallback={null}>
          <GalleryShowcase />
        </Suspense>
        
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
