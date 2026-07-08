"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { HeroNewDesign } from "@/components/hero-new-design"
import { AboutSectionNew } from "@/components/about-section-new"
import { ClubStatsSection } from "@/components/club-stats-section-new"
import { MatchResultsGrid } from "@/components/match-results-grid-new"
import { TeamRosterGrid } from "@/components/team-roster-grid-new"
import { ChallengesSection } from "@/components/challenges-section-new"
import { SpotlightSection } from "@/components/spotlight-section-new"
import { NewsletterSection } from "@/components/newsletter-section-new"
import { FooterNew } from "@/components/footer-new"

// Lazy load contact form
const Contact = dynamic(() => import("@/components/contact").then(m => ({ default: m.Contact })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-card animate-pulse rounded-lg" />
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
        {/* Redesigned Landing Page Sections */}
        <HeroNewDesign skipAnimation={hasSeenAnimation} />
        <AboutSectionNew />
        <ClubStatsSection />
        <MatchResultsGrid />
        <TeamRosterGrid />
        <ChallengesSection />
        <SpotlightSection />
        <NewsletterSection />
        
        {/* Contact Section */}
        <Suspense fallback={<div className="py-12 bg-background" />}>
          <Contact />
        </Suspense>
      </main>
      <FooterNew />
    </div>
  )
}
