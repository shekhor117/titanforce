"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HomeNextFixture } from "@/components/home-next-fixture"
import { HomeLatestNews } from "@/components/home-latest-news"
import { HomeAboutGallery } from "@/components/home-about-gallery"
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
        <HomeLatestNews />
        <PremiumMatchStats />
        <HomeNextFixture />
        <PlayersGrid />
        <HomeAboutGallery />
        <Contact />
        <HomeShopLatest />
        <GalleryShowcase />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
