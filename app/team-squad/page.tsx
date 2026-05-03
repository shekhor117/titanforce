"use client"

import { Navbar } from "@/components/navbar"
import { Squad } from "@/components/squad"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TeamSquadPage() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="min-h-screen bg-background stripe-bg">
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
            <Link href="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="w-4 h-4" />
              <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বাড়িতে ফিরুন" : "Back Home"}
              </span>
            </Link>
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "দল স্কোয়াড" : "TEAM SQUAD"}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আমাদের প্রতিভাবান খেলোয়াড়দের দেখুন যারা টাইটান ফোর্সের গর্বের প্রতিনিধিত্ব করে" : "Meet the talented players representing Titan Force on the pitch"}
            </p>
          </div>
        </section>

        {/* Squad Section */}
        <Squad />
      </main>
      <Footer />
    </div>
  )
}
