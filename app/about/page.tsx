'use client'

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { EntranceReveal } from "@/components/entrance-reveal"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <button 
              onClick={() => router.back()} 
              className="inline-flex items-center gap-2 mb-8 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-5xl md:text-7xl font-black tracking-wider text-foreground mb-4">
              ABOUT US
            </h1>
            <p className="text-lg font-semibold max-w-2xl mx-auto text-foreground/70">
              Learn about Titan Force FC&apos;s history, mission, and values
            </p>
          </div>
        </section>

        {/* Content Section */}
        <EntranceReveal delay={0.3} duration={0.6} variant="fadeInUp">
          <AboutPageContent />
        </EntranceReveal>
      </main>
      <Footer />
    </div>
  )
}
