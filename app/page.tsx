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
import { PublicSectionSkeleton } from "@/components/main-site-loading-skeleton"

// Lazy load heavy animation components with loading delay
const PremiumMatchStats = dynamic(() => import("@/components/premium-match-stats").then(m => ({ default: m.PremiumMatchStats })), { 
  ssr: false,
  loading: () => <PublicSectionSkeleton variant="wide" />
})
const PlayersGrid = dynamic(() => import("@/components/players-grid").then(m => ({ default: m.PlayersGrid })), { 
  ssr: false,
  loading: () => <PublicSectionSkeleton variant="players" />
})
const HomeShopLatest = dynamic(() => import("@/components/home-shop-latest").then(m => ({ default: m.HomeShopLatest })), { 
  ssr: false,
  loading: () => <PublicSectionSkeleton variant="shop" />
})
const GalleryShowcase = dynamic(() => import("@/components/gallery-showcase").then(m => ({ default: m.GalleryShowcase })), { 
  ssr: false,
  loading: () => <PublicSectionSkeleton variant="gallery" />
})

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
      <main>
        <Hero skipAnimation={hasSeenAnimation} />
        <ClubInfoSection />
        
        {/* Three Column Section */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HomeNextFixture />
              <HomeLeagueStandings />
            </div>
          </div>
        </section>

        <HomeLatestNews />
        
        <Suspense fallback={<PublicSectionSkeleton variant="wide" />}>
          <PremiumMatchStats />
        </Suspense>
        
        <Suspense fallback={<PublicSectionSkeleton variant="wide" />}>
          <PlayersGrid />
        </Suspense>
        
        <HomeAboutGallery />
        
        <Suspense fallback={<PublicSectionSkeleton variant="wide" />}>
          <HomeShopLatest />
        </Suspense>
        
        <Suspense fallback={<PublicSectionSkeleton variant="wide" />}>
          <GalleryShowcase />
        </Suspense>
        
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
