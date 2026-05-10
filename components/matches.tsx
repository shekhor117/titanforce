"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Match, useDataStore } from "@/lib/data-store"
import { MatchPrediction } from "@/components/match-prediction"

export function Matches() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  // Get matches from data store
  const matches = useDataStore(dataStore.getMatches, "matches")

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
    if (match.homeScore !== null && match.awayScore !== null) {
      return `${match.homeScore} - ${match.awayScore}`
    }
    return "vs"
  }

  return (
    <section id="matches" ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {t.matches.subtitle}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {t.matches.title}
          </h2>
        </div>

        <div className="space-y-4">
          {matches.map((match, index) => {
            const statusStyle = getStatusColor(match)
            return (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`rounded-xl p-6 border-2 border-secondary bg-card transition-all duration-600 hover:border-primary hover:-translate-y-1 cursor-pointer w-full text-left ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          })}
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
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMatch(null)}
          >
            <div 
              className="relative w-full max-w-2xl bg-card border-2 border-primary rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Match Header */}
              <div className="mb-6">
                <div className={`text-2xl md:text-3xl font-[var(--font-display)] tracking-wider text-center mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedMatch.home} <span className="text-primary">{getScoreDisplay(selectedMatch)}</span> {selectedMatch.away}
                </div>
                <div className={`text-sm text-foreground/60 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedMatch.date} {selectedMatch.time && `• ${selectedMatch.time}`} • {selectedMatch.venue}
                </div>
              </div>

              {selectedMatch.status === "upcoming" ? (
                <div className="space-y-6">
                  <div className={`text-center text-foreground/70 py-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "এই ম্যাচটি এখনও খেলা হয়নি" : "Match not yet played"}
                  </div>
                  
                  {/* Match Prediction for Upcoming Matches */}
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <MatchPrediction
                      matchId={selectedMatch.id}
                      homeTeam={selectedMatch.home}
                      awayTeam={selectedMatch.away}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Goals */}
                  {(selectedMatch.homeGoals?.length || 0) > 0 && (
                    <div>
                      <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "গোলকারী" : "Goal Scorers"}
                      </h3>
                      <div className="space-y-2">
                        {selectedMatch.homeGoals?.map((goal, i) => (
                          <div key={i} className={`flex items-center justify-between p-3 rounded bg-secondary/30 text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                            <span className="text-foreground">{goal.player}</span>
                            <div className="flex items-center gap-2">
                              {goal.assist && (
                                <span className="text-foreground/60 text-xs">
                                  {isBn ? "অ্যাসিস্ট" : "Assist"}: {goal.assist}
                                </span>
                              )}
                              <span className="text-primary font-semibold">{goal.minute}</span>
                            </div>
                          </div>
                        ))}
                        {selectedMatch.awayGoals?.map((goal, i) => (
                          <div key={`away-${i}`} className={`flex items-center justify-between p-3 rounded bg-secondary/30 text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                            <span className="text-foreground">{goal.player}</span>
                            <div className="flex items-center gap-2">
                              {goal.assist && (
                                <span className="text-foreground/60 text-xs">
                                  {isBn ? "অ্যাসিস্ট" : "Assist"}: {goal.assist}
                                </span>
                              )}
                              <span className="text-primary font-semibold">{goal.minute}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lineups */}
                  {selectedMatch.homeLineup && selectedMatch.homeLineup.length > 0 && (
                    <div>
                      <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "লাইনআপ" : "Lineups"}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Home Lineup */}
                        <div>
                          <div className="text-sm font-semibold text-foreground mb-3">{selectedMatch.home}</div>
                          <div className="space-y-2">
                            {selectedMatch.homeLineup?.map((player, i) => (
                              <div key={i} className={`flex items-center gap-2 p-2 rounded bg-secondary/20 text-xs ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                                <span className="text-primary font-bold w-6">#{player.number}</span>
                                <span className="flex-1 text-foreground">{player.player}</span>
                                <span className="text-foreground/60 text-[10px] uppercase">{player.position}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Away Lineup */}
                        {selectedMatch.awayLineup && selectedMatch.awayLineup.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-foreground mb-3">{selectedMatch.away}</div>
                            <div className="space-y-2">
                              {selectedMatch.awayLineup?.map((player, i) => (
                                <div key={i} className={`flex items-center gap-2 p-2 rounded bg-secondary/20 text-xs ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                                  <span className="text-primary font-bold w-6">#{player.number}</span>
                                  <span className="flex-1 text-foreground">{player.player}</span>
                                  <span className="text-foreground/60 text-[10px] uppercase">{player.position}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
