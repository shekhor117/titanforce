"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { TransitionLink } from "@/components/transition-link"
import { usePlayers } from "@/lib/use-data-store"
import { Zap, Trophy, Users, Activity } from "lucide-react"
import { getDataService } from "@/lib/data-service"

interface HeroProps {
  onLoadingChange?: (loading: boolean) => void
  skipAnimation?: boolean
}

export function HeroModern({ onLoadingChange, skipAnimation = false }: HeroProps) {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [loading, setLoading] = useState(!skipAnimation)
  const { players } = usePlayers()
  const [aboutSettings, setAboutSettings] = useState({
    aboutTitle: t.about.title,
    aboutDescription: t.about.description
  })

  useEffect(() => {
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
    if (skipAnimation) {
      setLoading(false)
      onLoadingChange?.(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
      onLoadingChange?.(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onLoadingChange, skipAnimation])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

              <Image
                src="/logos/titanforce-logo.svg"
                alt="Opening Logo"
                width={160}
                height={160}
                className="w-40 md:w-56 animate-[openingLogo_2s_cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_0_40px_rgba(217,30,63,0.6)]"
                priority
              />
            </div>

            <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-[3px] text-primary font-[var(--font-display)] animate-[openingText_1.8s_cubic-bezier(0.25,0.46,0.45,0.94)]">
              TITAN
            </h1>

            <div className="mt-6 w-48 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent animate-[loadingBar_2.5s_ease-out_forwards]" />
            </div>
          </div>
        </div>
      )}

      <section id="home" className="relative overflow-hidden pt-0">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-20 sm:py-28 md:py-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-up">
              <div>
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold uppercase tracking-[0.1em] text-primary">
                    {isBn ? "প্রিমিয়াম ফুটবল ক্লাব" : "Elite Football Club"}
                  </span>
                </div>

                <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] mb-6 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
                  <span className="block text-foreground">{isBn ? "টাইটান" : "Titan"}</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{isBn ? "ফোর্স" : "Force"}</span>
                </h1>

                <p className={`text-lg md:text-xl text-foreground/70 leading-relaxed max-w-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {aboutSettings.aboutDescription}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-border/50">
                <div className="group cursor-pointer">
                  <div className="flex items-end gap-2 mb-2">
                    <div className="text-3xl font-bold text-primary">{activePlayers.length}</div>
                  </div>
                  <p className={`text-xs uppercase tracking-wider text-foreground/50 group-hover:text-primary transition-colors ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.about.players}
                  </p>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-end gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <p className={`text-xs uppercase tracking-wider text-foreground/50 group-hover:text-primary transition-colors ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "চ্যাম্পিয়ন" : "Champions"}
                  </p>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-end gap-2 mb-2">
                    <Zap className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <p className={`text-xs uppercase tracking-wider text-foreground/50 group-hover:text-primary transition-colors ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.about.spirit}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <TransitionLink
                  href="/team-squad"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 text-white font-bold uppercase tracking-wide rounded text-sm transition-all duration-300 hover-lift"
                >
                  {t.hero.viewSquad}
                </TransitionLink>

                <TransitionLink
                  href="/fixtures-results"
                  className="px-8 py-3 border-2 border-foreground/20 hover:border-primary text-foreground hover:text-primary font-bold uppercase tracking-wide rounded text-sm transition-all duration-300 hover-lift"
                >
                  {t.hero.matches}
                </TransitionLink>
              </div>
            </div>

            {/* Right Visual Element */}
            <div className="relative hidden md:flex items-center justify-center h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl" />

              <div className="relative z-10 w-80 h-80 rounded-3xl overflow-hidden border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 group">
                <Image
                  src="/logos/titanforce-logo.svg"
                  alt="Titan Force FC"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-accent/10 rounded-full border border-accent/30 animate-[float_6s_ease-in-out_infinite]" />
              <div className="absolute bottom-12 left-8 w-12 h-12 bg-primary/10 rounded-full border border-primary/30 animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
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

          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% center;
            }
            50% {
              background-position: 100% center;
            }
          }

          @keyframes openingLogo {
            0% {
              opacity: 0;
              transform: scale(0.3) rotate(-45deg);
              filter: blur(20px);
            }
            60% {
              opacity: 0.9;
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
              letter-spacing: 20px;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              letter-spacing: 3px;
              transform: translateY(0px);
            }
          }

          @keyframes loadingBar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
        `}</style>
      </section>
    </>
  )
}
