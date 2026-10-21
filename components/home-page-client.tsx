"use client"

import { useState, useEffect, Suspense } from "react"
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

const PremiumMatchStats = dynamic(() => import("@/components/premium-match-stats").then((m) => ({ default: m.PremiumMatchStats })))
const PlayersGrid = dynamic(() => import("@/components/players-grid").then((m) => ({ default: m.PlayersGrid })))
const HomeShopLatest = dynamic(() => import("@/components/home-shop-latest").then((m) => ({ default: m.HomeShopLatest })))
const GalleryShowcase = dynamic(() => import("@/components/gallery-showcase").then((m) => ({ default: m.GalleryShowcase })))

type InitialData = Record<string, unknown[]>

export function HomePageClient({ initialData }: { initialData: InitialData }) {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://titanforcemulikandi.vercel.app" }],
    }
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)
    const alreadyShown = sessionStorage.getItem("hero-shown")
    setHasSeenAnimation(Boolean(alreadyShown))
    sessionStorage.setItem("hero-shown", "true")
    return () => script.remove()
  }, [])

  return (
    <div className="min-h-screen bg-background" data-initial-data={Object.keys(initialData).join(",")}>
      <Navbar />
      <main className="overflow-hidden">
        <Hero skipAnimation={hasSeenAnimation} />
        <ClubInfoSection />
        <section className="relative bg-background/70 px-4 py-14 md:py-20">
          <div className="mx-auto max-w-7xl"><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><HomeNextFixture /><HomeLeagueStandings /></div></div>
        </section>
        <HomeLatestNews />
        <Suspense fallback={null}><PremiumMatchStats /></Suspense>
        <Suspense fallback={null}><PlayersGrid /></Suspense>
        <HomeAboutGallery />
        <Suspense fallback={null}><HomeShopLatest /></Suspense>
        <Suspense fallback={null}><GalleryShowcase /></Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
