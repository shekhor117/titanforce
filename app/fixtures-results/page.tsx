"use client"

import { Navbar } from "@/components/navbar"
import { Matches } from "@/components/matches"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function FixturesResultsPage() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 opacity-10"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 animate-fade-up ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "ফিক্সচার ও ফলাফল" : "FIXTURES & RESULTS"}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto animate-fade-up animation-delay-100 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আসন্ন ম্যাচ এবং সর্বশেষ ফলাফল দেখুন" : "Stay updated with upcoming matches and latest results"}
            </p>
          </div>
        </section>

        {/* Matches Section */}
        <Matches />
      </main>
      <Footer />
    </div>
  )
}
