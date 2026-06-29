"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { MatchPrediction } from "@/components/match-prediction"
import { MatchDetails } from "@/components/match-details"
import { useMatches } from "@/lib/use-data-store"
import type { Match } from "@/lib/data-service"

interface MatchesProps {
  heroTitle?: string
  heroDescription?: string
}

export function Matches({ heroTitle, heroDescription }: MatchesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  
  // Use realtime hook for matches - automatically syncs when admin updates
  const { matches, loading: isLoading, error } = useMatches()

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

    return () => observer.disconnect()
  }, [])

  const getStatusColor = (match: Match) => {
    if (match.status === "upcoming") {
      return { bg: "rgba(220, 38, 38, 0.2)", text: "var(--primary)", label: t.matches.upcoming }
    }
    if (match.status === "live") {
      return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e", label: "LIVE" }
    }
    // Completed
    if (match.result === "W") {
      return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e", label: "Win" }
    }
    if (match.result === "L") {
      return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444", label: "Loss" }
    }
    return { bg: "rgba(251, 191, 36, 0.2)", text: "#fbbf24", label: "Draw" }
  }

  const getScoreDisplay = (match: Match) => {
    if (match.home_score !== null && match.away_score !== null) {
      return `${match.home_score} - ${match.away_score}`
    }
    return "vs"
  }

  return (
    <section id="matches" ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {heroTitle && heroDescription && (
          <div
            className={`text-center mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <h1 className={`text-5xl md:text-7xl font-black tracking-wider text-primary mb-4 text-center ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
              {heroTitle}
            </h1>
            <p className={`text-lg text-foreground/70 max-w-2xl mx-auto text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {heroDescription}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-foreground/60">
              <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "ম্যাচ লোড হচ্ছে..." : "Loading matches..."}
              </p>
            </div>
          ) : matches.length > 0 ? (
            matches.map((match, index) => {
            const statusStyle = getStatusColor(match)
            return (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`neo-card p-6 cursor-pointer w-full text-left ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date & Time */}
                  <div className="flex flex-col justify-center">
                    <div className={`text-xs uppercase tracking-wider font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {match.date}
                    </div>
                    <div className={`text-sm text-foreground/70 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {match.time}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="font-[var(--font-display)] text-2xl tracking-wider text-center text-foreground">
                      {match.home}{" "}
                      <span className="text-primary">{getScoreDisplay(match)}</span>{" "}
                      {match.away}
                    </div>
                    <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {match.venue}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-end">
                    <span
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                      style={{ background: statusStyle.bg, color: statusStyle.text }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })
          ) : (
            <div className="text-center py-12 text-foreground/60">
              <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "কোন ম্যাচ পাওয়া যায়নি" : "No matches found"}
              </p>
            </div>
          )}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন ম্যাচ নির্ধারিত নেই" : "No matches scheduled"}
            </p>
          </div>
        )}

        {/* Match Details Modal */}
        {selectedMatch && (
          <MatchDetails 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)}
            isModal={true}
          />
        )}
      </div>
    </section>
  )
}
