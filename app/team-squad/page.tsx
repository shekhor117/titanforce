"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Squad } from "@/components/squad"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

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
          item: 'https://titanforcefc.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Squad',
          item: 'https://titanforcefc.com/squad',
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
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4-hj89lpYB8NpO4ab5VhZIM5MIHoQSUr.mp4" type="video/mp4" />
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
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center z-10">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className={`text-xs sm:text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পিছনে" : "Back"}
              </span>
            </button>
            <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-wider text-primary mb-3 sm:mb-4 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {isBn ? "দল স্কোয়াড" : "TEAM SQUAD"}
            </h1>
            <p className={`text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
