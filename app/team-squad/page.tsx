"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Squad } from "@/components/squad"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { EntranceReveal } from "@/components/entrance-reveal"

export default function TeamSquadPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  useEffect(() => {
    // Add BreadcrumbList schema
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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Squad',
          item: 'https://titanforcemulikandi.vercel.app/squad',
        },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center pt-8 sm:pt-12 pb-4 sm:pb-6">
          <button onClick={() => router.back()} className="neo-btn inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded border-2 border-primary text-primary transition-all duration-300 transform hover:scale-105 active:scale-95">
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className={`text-xs sm:text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "পিছনে" : "Back"}
            </span>
          </button>
        </div>

        {/* Squad Section */}
        <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
          <Squad />
        </EntranceReveal>
      </main>
      <Footer />
    </div>
  )
}
