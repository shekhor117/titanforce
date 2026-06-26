"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"
import { Play } from "lucide-react"

interface HeroProps {
  onLoadingChange?: (loading: boolean) => void
  skipAnimation?: boolean
}

export function Hero({ onLoadingChange, skipAnimation = false }: HeroProps) {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [loading, setLoading] = useState(!skipAnimation)
  const { players } = usePlayers()

  const activePlayers = Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "active") : []

  useEffect(() => {
    // Skip animation if requested
    if (skipAnimation) {
      setLoading(false)
      onLoadingChange?.(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
      onLoadingChange?.(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [onLoadingChange, skipAnimation])

  return (
    <section id="home" className="relative overflow-hidden min-h-screen bg-background dark:bg-gradient-to-br dark:from-black dark:via-red-900 dark:to-pink-600">
      {/* Background Shape - Curved diagonal */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Light mode background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 dark:hidden"></div>
        
        {/* Dark mode animated elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl animate-blob hidden dark:block"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-blob animation-delay-2000 hidden dark:block"></div>
        <div className="absolute bottom-20 right-32 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-4000 hidden dark:block"></div>
        
        {/* Curved background shape for light mode */}
        <svg className="absolute inset-0 w-full h-full hidden dark:hidden" viewBox="0 0 1440 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f3d5dd', stopOpacity: 0.6 }} />
              <stop offset="50%" style={{ stopColor: '#e0c3f0', stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: '#fce8ec', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <path d="M0,300 Q360,100 720,150 T1440,250 L1440,800 L0,800 Z" fill="url(#heroGradient)" />
        </svg>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full py-12 md:py-20">
          
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            {/* Red accent line */}
            <div className="animate-fade-up">
              <div className="h-1 w-12 bg-accent rounded-full"></div>
            </div>

            {/* Tagline */}
            <div className="animate-smoothFadeUp">
              <p className={`text-xs sm:text-sm uppercase tracking-widest font-bold text-accent ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                RISE LIKE TITANS
              </p>
            </div>

            {/* Main Title */}
            <h1 className={`text-6xl sm:text-7xl md:text-8xl font-black leading-tight tracking-tight animate-smoothFadeUp animation-delay-100 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              <span className="block text-slate-900 dark:text-white">TITAN FORCE</span>
              <span className="block text-accent mt-1">MULIKANDI</span>
            </h1>

            {/* Description */}
            <p className={`text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-md animate-smoothFadeUp animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-buttonSlideIn">
              <TransitionLink
                href="/team-squad"
                className="no-underline"
              >
                <button className={`px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  OURPLAYER <span className="text-lg">›</span>
                </button>
              </TransitionLink>
              <TransitionLink
                href="/fixtures-results"
                className="no-underline"
              >
                <button className={`px-8 py-3 border-2 border-accent text-slate-900 dark:text-white font-bold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  <Play size={18} className="fill-current" /> MATCHES
                </button>
              </TransitionLink>
            </div>
          </div>

          {/* Right Column - Football Illustration & Decorative Elements */}
          <div className="flex items-center justify-center relative h-[400px] md:h-[600px]">
            {/* Decorative dots and circles */}
            <div className="absolute top-10 right-20 w-4 h-4 bg-accent rounded-full opacity-60 animate-float"></div>
            <div className="absolute top-32 right-10 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-float animation-delay-2000"></div>
            <div className="absolute bottom-20 right-32 w-5 h-5 bg-red-500 rounded-full opacity-50 animate-float animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
            
            {/* Soccer ball icon */}
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border-4 border-slate-400 dark:border-slate-600 rounded-full opacity-20 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            
            {/* Football player illustration */}
            <div className="relative z-10 animate-float">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-06-27%20002413-E6PDnfFwMalWBD6f6f4ml4RwZfUhWC.png"
                alt="Football player kicking ball"
                width={500}
                height={600}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes smoothFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .animate-smoothFadeUp {
          animation: smoothFadeUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-buttonSlideIn {
          animation: buttonSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  )
}
