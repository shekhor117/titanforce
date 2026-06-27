'use client'

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { EntranceReveal } from "@/components/entrance-reveal"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Content Section */}
        <EntranceReveal delay={0.3} duration={0.6} variant="fadeInUp">
          <AboutPageContent />
        </EntranceReveal>
      </main>
      <Footer />
    </div>
  )
}
