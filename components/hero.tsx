"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"
import { ButtonModern } from "@/components/button-modern"

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
    <section id="home" className="relative overflow-hidden min-h-[100vh]">

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[100vh]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center h-full py-12 md:py-20">
          
          {/* Left Column - Text Content */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-6 md:space-y-8">
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
                className="no-underline"
              >
                <ButtonModern
                  variant="primary"
                  size="lg"
                  className={`w-full sm:w-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {t.hero.viewSquad}
                </ButtonModern>
              </TransitionLink>
              <TransitionLink
                href="/fixtures-results"
                className="no-underline"
              >
                <ButtonModern
                  variant="outline"
                  size="lg"
                  className={`w-full sm:w-auto bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:text-white ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {t.hero.matches}
                </ButtonModern>
              </TransitionLink>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
              <div className="animate-smoothFadeUp animation-delay-300">
                <p className="text-2xl sm:text-3xl font-bold text-accent">12K+</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Fans</p>
              </div>
              <div className="animate-smoothFadeUp animation-delay-300">
                <p className="text-2xl sm:text-3xl font-bold text-accent">{activePlayers.length}</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Players</p>
              </div>
            </div>

          </div>

          {/* Right Column - Football Illustration */}
          <div className="lg:col-span-3 flex items-center justify-center relative">
            <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-red-600/20 rounded-3xl blur-2xl"></div>
              
              {/* Football action illustration */}
              <div className="relative z-10 animate-float">
                <Image
                  src="/images/hero-football-action.png"
                  alt="Football players attacking and defending"
                  width={500}
                  height={600}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
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
