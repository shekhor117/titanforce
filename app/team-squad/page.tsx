"use client"

import { Navbar } from "@/components/navbar"
import { Squad } from "@/components/squad"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function TeamSquadPage() {
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
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 animate-fade-up ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "দল স্কোয়াড" : "TEAM SQUAD"}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto animate-fade-up ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
