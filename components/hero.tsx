"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"

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
    <section id="home" className="relative overflow-hidden min-h-[100vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background animated elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Top left curved accent */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a71930" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#d91e3f" stopOpacity="0.08"/>
              </linearGradient>
            </defs>
            {/* Curved wave pattern */}
            <path d="M 0,200 Q 360,100 720,200 T 1440,200 L 1440,0 L 0,0 Z" fill="url(#purpleGrad)" />
            <path d="M 0,400 Q 360,300 720,400 T 1440,400 L 1440,150 Q 720,200 0,150 Z" fill="#d91e3f" opacity="0.1" />
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[100vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-12 md:py-20">
          
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8 max-w-2xl order-2 lg:order-1">
            {/* Logo */}
            <div className="animate-fade-up">
              <div className="relative inline-block">
                <Image
                  src="/logos/titanforce-logo.svg"
                  alt="Titan Force FC Logo"
                  width={60}
                  height={60}
                  className="object-contain drop-shadow-xl w-14 md:w-16"
                  priority
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="animate-smoothFadeUp">
              <p className={`text-xs sm:text-sm uppercase tracking-widest font-bold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                MORE THAN A CLUB
              </p>
            </div>

            {/* Main Title */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-wider animate-smoothFadeUp animation-delay-100 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              <span className="block text-white">{t.hero.welcome}</span>
              <span className="block text-accent mt-2">{t.hero.clubName}</span>
            </h1>

            {/* Description */}
            <p className={`text-base sm:text-lg text-slate-300 leading-relaxed max-w-md animate-smoothFadeUp animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.hero.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-buttonSlideIn">
              <TransitionLink
                href="/team-squad"
                className={`bg-accent hover:bg-accent/90 px-8 py-3 font-bold text-sm uppercase tracking-wider rounded-lg text-white hover:scale-105 transition-all duration-300 text-center flex items-center justify-center group shadow-lg hover:shadow-2xl hover:shadow-accent/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.viewSquad}
              </TransitionLink>
              <TransitionLink
                href="/fixtures-results"
                className={`border-2 border-white hover:border-accent hover:bg-white/10 px-8 py-3 font-bold text-sm uppercase tracking-wider rounded-lg text-white hover:scale-105 transition-all duration-300 text-center flex items-center justify-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.matches}
              </TransitionLink>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="animate-smoothFadeUp animation-delay-300">
                <p className="text-2xl sm:text-3xl font-bold text-accent">{activePlayers.length}+</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Active Players</p>
              </div>
              <div className="animate-smoothFadeUp animation-delay-300">
                <p className="text-2xl sm:text-3xl font-bold text-accent">15+</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Seasons</p>
              </div>
              <div className="animate-smoothFadeUp animation-delay-300">
                <p className="text-2xl sm:text-3xl font-bold text-accent">1000+</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Fans</p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] order-1 lg:order-2">
            <div className="relative w-full h-full">
              <img 
                src="/images/hero-player-illustration.jpg" 
                alt="Player illustration" 
                className="w-full h-full object-contain"
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
