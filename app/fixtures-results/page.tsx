"use client"

import { useRouter } from "next/navigation"
import { WebsiteSidebar } from "@/components/website-sidebar"
import { Matches } from "@/components/matches"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"
import { EntranceReveal } from "@/components/entrance-reveal"

export default function FixturesResultsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="min-h-screen bg-background">
      <WebsiteSidebar />
      <main className="lg:ml-64">
        <div className="relative max-w-6xl mx-auto px-4 text-center pt-8 sm:pt-12 pb-4 sm:pb-6">
          <button onClick={() => router.back()} className="neo-btn inline-flex items-center gap-2 mb-6 px-4 py-2 rounded text-primary transition-all duration-300 transform hover:scale-105 active:scale-95">
            <ArrowLeft className="w-4 h-4" />
            <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "পিছনে" : "Back"}
            </span>
          </button>
        </div>

        {/* Matches Section */}
        <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
          <Matches heroTitle={isBn ? "ফিক্সচার ও ফলাফল" : "FIXTURES & RESULTS"} heroDescription={isBn ? "আসন্ন ম্যাচ এবং সর্বশেষ ফলাফল দেখুন" : "Stay updated with upcoming matches and latest results"} />
        </EntranceReveal>
      </main>
      <Footer />
    </div>
  )
}
