"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"
import { Zap } from "lucide-react"
import { getDataService } from "@/lib/data-service"

interface HeroProps {
  onLoadingChange?: (loading: boolean) => void
  skipAnimation?: boolean
}

export function Hero({ onLoadingChange, skipAnimation = false }: HeroProps) {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [loading, setLoading] = useState(!skipAnimation)
  const { players } = usePlayers()
  const [aboutSettings, setAboutSettings] = useState({
    aboutTitle: t.about.title,
    aboutDescription: t.about.description
  })

  useEffect(() => {
    // Fetch settings from data service
    const loadSettings = async () => {
      try {
        const service = getDataService()
        const settings = await service.getSettings?.()
        if (settings) {
          setAboutSettings({
            aboutTitle: settings.aboutTitle || t.about.title,
            aboutDescription: settings.aboutDescription || t.about.description
          })
        }
      } catch (err) {
        // Using default about settings
      }
    }
    loadSettings()
  }, [])

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
    <>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-accent/20" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl animate-pulse animation-delay-1000" />

              <Image
                src="/logos/titanforce-logo.svg"
                alt="Opening Logo"
                width={160}
                height={160}
                className="w-40 md:w-56 animate-[openingLogo_2.5s_cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_0_40px_rgba(167,25,48,0.9)]"
                priority
              />
            </div>

            <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-[10px] text-white animate-[openingText_2.2s_cubic-bezier(0.25,0.46,0.45,0.94)] font-[var(--font-display)]">
              TITAN FORCE
            </h1>

            <div className="mt-6 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent animate-[loadingBar_3s_cubic-bezier(0.42,0,0.58,1)_forwards]" />
            </div>

            <p className="mt-4 text-gray-400 tracking-[6px] text-sm animate-pulse">
              LOADING EXPERIENCE
            </p>
          </div>
        </div>
      )}

      <section id="home" className="relative overflow-hidden bg-black min-h-screen md:min-h-[80vh]">
        {/* Soccer Hero Background Image */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(/images/hero-bg-soccer.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundAttachment: 'fixed'
        }} />

        {/* Overlay for text readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-1"></div>
        
        {/* Two Column Layout */}
        <div className="relative max-w-7xl mx-auto h-full min-h-screen md:min-h-[80vh] flex flex-col md:flex-row items-center z-10">
          {/* Left Column - Text Content */}
          <div className="w-full md:w-1/2 px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
            {/* Logo */}
            <div className="animate-fade-up mb-6 md:mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <Image
                  src="/logos/titanforce-logo.svg"
                  alt="Titan Force FC Logo"
                  width={80}
                  height={80}
                  className="relative z-10 object-contain drop-shadow-xl w-16 md:w-20"
                  priority
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="animate-smoothFadeUp mb-6">
              <p className={`text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                MORE THAN A CLUB, WE ARE <span className="text-white">A FORCE</span>
              </p>
            </div>

            {/* Title */}
            <h2 className={`mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-wider text-white animate-fade-up ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
              <span className="block text-white animate-smoothFadeUp">
                {t.hero.welcome}
              </span>
              <span className="block text-accent mt-2 md:mt-3 animate-smoothFadeUp animation-delay-200">
                {t.hero.clubName}
              </span>
            </h2>

            {/* Description */}
            <p className={`mt-4 md:mt-6 mb-6 md:mb-8 text-sm sm:text-base text-white leading-relaxed max-w-lg animate-smoothFadeUp animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.hero.tagline}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-buttonSlideIn">
              <TransitionLink
                href="/team-squad"
                className={`glass-btn-primary px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded text-white hover:scale-105 transition-all duration-300 whitespace-nowrap ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.viewSquad}
              </TransitionLink>
              <TransitionLink
                href="/fixtures-results"
                className={`glass-btn px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded text-white hover:scale-105 transition-all duration-300 whitespace-nowrap ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.matches}
              </TransitionLink>
            </div>
          </div>

          {/* Right Column - Team Image (Hidden on mobile, shown on md+) */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-end relative overflow-hidden">
            {/* Team Image Background */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'url(/images/hero-bg-soccer.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              backgroundAttachment: 'fixed'
            }} />
            
            {/* Overlay gradient to blend with left side */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60" />
            
            {/* Lighting effect for team visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes smoothFadeUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes smoothScale {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes glow {
            0% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            }

            50% {
              box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
            }

            100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            }
          }

          @keyframes slide {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes logoIntro {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-15deg);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          @keyframes smoothLogoIntro {
            0% {
              opacity: 0;
              transform: scale(0.4) rotate(-20deg);
              filter: blur(15px);
            }

            50% {
              transform: scale(1.05) rotate(5deg);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          @keyframes openingLogo {
            0% {
              opacity: 0;
              transform: scale(0.2) rotate(-30deg);
              filter: blur(20px);
            }

            50% {
              opacity: 0.8;
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          @keyframes openingText {
            0% {
              opacity: 0;
              letter-spacing: 30px;
              transform: translateY(40px);
            }

            60% {
              opacity: 0.9;
            }

            100% {
              opacity: 1;
              letter-spacing: 10px;
              transform: translateY(0px);
            }
          }

          @keyframes loadingBar {
            0% {
              width: 0%;
              opacity: 0.3;
            }

            50% {
              opacity: 1;
            }

            100% {
              width: 100%;
              opacity: 1;
            }
          }

          @keyframes buttonSlideIn {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulseGlow {
            0%,
            100% {
              opacity: 0.5;
              filter: blur(30px);
            }

            50% {
              opacity: 1;
              filter: blur(20px);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }

          .animate-smoothFadeUp {
            animation: smoothFadeUp 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .animate-smoothScale {
            animation: smoothScale 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .animate-buttonSlideIn {
            animation: buttonSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .delay-300 {
            animation-delay: 0.3s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }

          .animation-delay-100 {
            animation-delay: 0.1s;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .transition-smooth {
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        `}</style>
      </section>
    </>
  )
}
