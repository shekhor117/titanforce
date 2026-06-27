"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"
import { Zap } from "lucide-react"
import { getDataService } from "@/lib/data-service"

export function AboutPageContent() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
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
      }
    }
    loadSettings()
  }, [])

  const activePlayers = Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "active") : []

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 py-[46px] md:py-36 pb-[33px] text-center">
        {/* Logo */}
        <div className="animate-fade-up flex justify-center mb-6 animate-[float_5s_ease-in-out_infinite]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl scale-125 animate-pulse" />
            <Image
              src="/logos/titanforce-logo.svg"
              alt="Titan Force FC Logo"
              width={180}
              height={180}
              className="relative z-10 object-contain drop-shadow-2xl drop-shadow-[0_0_35px_rgba(59,130,246,0.8)] animate-[logoIntro_1.5s_ease] hover:scale-110 transition duration-500"
              priority
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="animate-smoothFadeUp">
          <p className={`text-sm uppercase tracking-[0.3em] mb-0 font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          </p>
        </div>

        {/* Main Heading */}
        <h1 className={`mt-6 mb-6 text-5xl md:text-7xl lg:text-8xl leading-none tracking-wide text-white animate-fade-up animation-delay-100 ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
          <span className="block text-white overflow-hidden animate-smoothFadeUp">
          </span>
        </h1>

        {/* Tagline */}
        <p className={`mt-0 mb-4 text-lg text-white font-semibold max-w-xl mx-auto ml-[205px] animate-smoothFadeUp animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        </p>

          {/* About Section */}
          <div>
            <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-0 text-accent ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.about.location}
            </p>
            <h2 className={`mt-2 text-4xl md:text-5xl tracking-wide mb-2 text-white font-bold ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {aboutSettings.aboutTitle}
            </h2>
            <p className={`text-lg leading-relaxed text-white font-medium max-w-2xl mx-auto mb-[25px] ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {aboutSettings.aboutDescription}
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div>
                <div className="font-[var(--font-display)] text-4xl text-accent font-bold">
                  {activePlayers.length}
                </div>
                <div className={`text-xs uppercase tracking-wider text-white font-semibold mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.about.players}
                </div>
              </div>
              <div>
                <div className="flex justify-center">
                  <Zap className="w-8 h-8 text-accent animate-pulse drop-shadow-[0_0_8px_rgba(217,30,63,0.6)]" />
                </div>
                <div className={`text-xs uppercase tracking-wider text-white font-semibold mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.about.spirit}
                </div>
              </div>
              <div>
                <div className="font-[var(--font-display)] text-4xl text-accent font-bold">
                  1
                </div>
                <div className={`text-xs uppercase tracking-wider text-white font-semibold mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.about.team}
                </div>
              </div>
            </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 animate-buttonSlideIn">
            <TransitionLink
              href="/team-squad"
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded glass-btn-primary text-primary-foreground hover:scale-110 transition-all duration-300 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {t.hero.viewSquad}
            </TransitionLink>
            <TransitionLink
              href="/fixtures-results"
              className={`px-8 py-3 font-bold text-sm uppercase tracking-wider rounded glass-btn text-primary hover:scale-110 transition-all duration-300 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {t.hero.matches}
            </TransitionLink>
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

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </section>
  )
}
