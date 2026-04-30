"use client"

import { useEffect, useRef, useState } from "react"
import { Trophy, Clock, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface ScoreboardMatch {
  home: string
  away: string
  homeScore: number
  awayScore: number
  date: string
  time: string
  venue: string
  status: "live" | "finished" | "upcoming"
}

const scoreboardMatches: ScoreboardMatch[] = [
  {
    home: "Titan Force",
    away: "FC United",
    homeScore: 2,
    awayScore: 1,
    date: "Jan 15, 2025",
    time: "3:00 PM",
    venue: "Mulikandi Ground",
    status: "finished",
  },
  {
    home: "Star Academy",
    away: "Titan Force",
    homeScore: 0,
    awayScore: 3,
    date: "Jan 10, 2025",
    time: "2:30 PM",
    venue: "Academy Stadium",
    status: "finished",
  },
  {
    home: "Titan Force",
    away: "Royal FC",
    homeScore: 1,
    awayScore: 1,
    date: "Jan 5, 2025",
    time: "4:00 PM",
    venue: "Mulikandi Ground",
    status: "finished",
  },
]

export function MatchScoreboard() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="scoreboard"
      className="relative py-20 px-4 sm:px-8 bg-gradient-to-b from-black/40 to-black/20 border-y-2 border-primary/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {isBn ? "সর্বশেষ ফলাফল" : "Recent Results"}
          </p>
          <h2
            className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}
          >
            {isBn ? "ম্যাচ স্কোরবোর্ড" : "MATCH SCOREBOARD"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scoreboardMatches.map((match, index) => {
            const titanForceHome = match.home === "Titan Force"
            const titanForceWon =
              (titanForceHome && match.homeScore > match.awayScore) ||
              (!titanForceHome && match.awayScore > match.homeScore)
            const titanForceDraw = match.homeScore === match.awayScore

            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border-2 border-primary/50 transition-all duration-600 hover:border-primary hover:shadow-lg hover:shadow-primary/50 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Scoreboard Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
                  <div className={`text-xs uppercase tracking-wider font-bold text-primary-foreground text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {match.date}
                  </div>
                </div>

                {/* Score Display */}
                <div className="bg-card px-6 py-8">
                  {/* Team Names and Scores */}
                  <div className="space-y-4 mb-6">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`font-bold text-lg tracking-wider flex-1 ${titanForceHome ? "text-primary" : "text-foreground"} ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}
                      >
                        {match.home}
                      </div>
                      <div className="font-[var(--font-display)] text-5xl font-bold text-primary ml-4">
                        {match.homeScore}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 text-foreground/40">
                      <div className="flex-1 h-px bg-foreground/20"></div>
                      <span className={`text-xs uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        vs
                      </span>
                      <div className="flex-1 h-px bg-foreground/20"></div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`font-bold text-lg tracking-wider flex-1 ${!titanForceHome ? "text-primary" : "text-foreground"} ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}
                      >
                        {match.away}
                      </div>
                      <div className="font-[var(--font-display)] text-5xl font-bold text-primary ml-4">
                        {match.awayScore}
                      </div>
                    </div>
                  </div>

                  {/* Result Badge */}
                  <div className="flex justify-center mb-4">
                    {titanForceWon && (
                      <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Trophy className="w-4 h-4" />
                        {isBn ? "জয়" : "Win"}
                      </span>
                    )}
                    {titanForceDraw && (
                      <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        {isBn ? "ড্র" : "Draw"}
                      </span>
                    )}
                    {!titanForceWon && !titanForceDraw && (
                      <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        {isBn ? "হার" : "Loss"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Details */}
                <div className="bg-secondary/30 px-4 py-3 space-y-2 border-t border-secondary">
                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
