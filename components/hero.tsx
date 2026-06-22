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
    <section id="home" className="relative overflow-hidden bg-black min-h-[85vh] sm:min-h-[75vh] lg:min-h-[85vh]">
        {/* Stadium Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 100%), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(139,0,0);stop-opacity:0.4" /><stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.8" /></linearGradient></defs><rect width="1920" height="1080" fill="url(%23grad1)"/><circle cx="500" cy="300" r="200" fill="rgba(200,0,0,0.2)"/><circle cx="1400" cy="400" r="250" fill="rgba(255,200,0,0.15)"/></svg>')`,
              backgroundAttachment: 'fixed'
            }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10"></div>
          {/* Red accent glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-5 mix-blend-screen"></div>
        </div>
        
        {/* Two Column Layout - Mobile shows image as background, desktop shows side-by-side */}
        <div className="relative max-w-7xl mx-auto h-full min-h-[85vh] sm:min-h-[75vh] lg:min-h-[85vh] z-10">
          {/* Left Column - Text Content - Positioned on top on mobile, left side on desktop */}
          <div className="relative lg:absolute lg:left-0 lg:top-0 lg:w-1/2 lg:h-full w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-20 z-10 flex flex-col justify-center bg-black">
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
              <p className={`text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                MORE THAN A CLUB, WE ARE <span className="text-white">A FORCE</span>
              </p>
            </div>

            {/* Title */}
            <h2 className={`mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-wider text-white font-black animate-fade-up ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
              <span className="block text-white animate-smoothFadeUp">
                {t.hero.welcome}
              </span>
              <span className="block text-accent mt-2 md:mt-3 animate-smoothFadeUp animation-delay-200">
                {t.hero.clubName}
              </span>
            </h2>

            {/* Description */}
            <p className={`mt-4 md:mt-6 mb-6 md:mb-8 text-sm sm:text-base text-white leading-relaxed max-w-lg font-bold animate-smoothFadeUp animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.hero.tagline}
            </p>

            {/* Buttons */}
            <div className="flex flex-row gap-3 sm:gap-4 animate-buttonSlideIn">
              <TransitionLink
                href="/team-squad"
                className={`bg-accent hover:bg-accent/90 px-5 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded text-white hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.viewSquad}
              </TransitionLink>
              <TransitionLink
                href="/fixtures-results"
                className={`border-2 border-white hover:bg-white/10 px-5 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded text-white hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {t.hero.matches}
              </TransitionLink>
            </div>
          </div>

          {/* Right Column - Team Image with Stadium Effect - Full background on mobile, side column on desktop */}
          <div className="absolute lg:absolute w-full lg:w-1/2 lg:right-0 lg:top-0 h-full lg:h-full min-h-[85vh] sm:min-h-[75vh] flex items-center justify-center lg:justify-end inset-0 lg:inset-auto overflow-hidden z-0 lg:z-5">
            {/* Team background image container */}
            <div className="absolute inset-0">
              {/* Background image */}
              <img 
                src="/images/hero-team-huddle.png" 
                alt="Team huddle" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Primary overlay - gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/30"></div>
              
              {/* Secondary overlay - stadium lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
              
              {/* Red ambient light from top right */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-600/40 via-red-500/20 to-transparent blur-3xl"></div>
              
              {/* Red accent from center right */}
              <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-accent/30 via-accent/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* Top bright lighting effect */}
              <div className="absolute top-0 left-1/2 w-96 h-64 bg-gradient-radial from-yellow-400/20 via-red-500/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* Red accent edge lighting */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Bottom dark vignette */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>
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
  )
}
