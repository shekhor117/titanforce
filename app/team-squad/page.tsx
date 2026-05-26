"use client"

import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Squad } from "@/components/squad"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

const Squad3DScene = dynamic(() => import('@/components/3d-squad-scene').then(mod => ({ default: mod.Squad3DScene })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 rounded-lg" />,
})

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
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient relative overflow-hidden py-12 sm:py-16 md:py-24">
          <div className="absolute inset-0 opacity-10"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center">
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
        
        {/* 3D Scene Section */}
        <div className="w-full h-64 md:h-80 px-4 mt-12 mb-8">
          <Squad3DScene />
        </div>
      </main>
      <Footer />
    </div>
  )
}
