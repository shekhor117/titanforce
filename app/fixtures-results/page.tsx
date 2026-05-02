"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Matches } from "@/components/matches"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"

export default function FixturesResultsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [isLoaded, setIsLoaded] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleBack = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.back()
    }, 600)
  }

  return (
    <div className={`min-h-screen bg-background stripe-bg transition-all duration-600 ${isLoaded && !isExiting ? "opacity-100" : isExiting ? "opacity-0 scale-95" : "opacity-0"}`}>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 opacity-10"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <button onClick={handleBack} className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700`}>
              <ArrowLeft className="w-4 h-4" />
              <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বাড়িতে ফিরুন" : "Back Home"}
              </span>
            </button>
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 animate-fade-up ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} transition-all duration-1000 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "ফিক্সচার ও ফলাফল" : "FIXTURES & RESULTS"}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} transition-all duration-1000 delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আসন্ন ম্যাচ এবং সর্বশেষ ফলাফল দেখুন" : "Stay updated with upcoming matches and latest results"}
            </p>
          </div>
        </section>

        {/* Matches Section */}
        <div className={`${isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"} transition-all duration-1000 delay-300`}>
          <Matches />
        </div>
      </main>
      <Footer />
    </div>
  )
}
