"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Matches } from "@/components/matches"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"

export default function FixturesResultsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        {/* Hero Section with Video Background */}
        <section className="hero-gradient relative overflow-hidden py-16 md:py-24">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20video%203-w32iIRzTDPsT2QMQG0U9xuY8e1c4YY.mp4" type="video/mp4" />
          </video>

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden z-1">
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl animate-blob" />
          </div>

          <div
            className="absolute inset-0 opacity-10 z-1"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />

          {/* Hero Content */}
          <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="w-4 h-4" />
              <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পিছনে" : "Back"}
              </span>
            </button>
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "ফিক্সচার ও ফলাফল" : "FIXTURES & RESULTS"}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
