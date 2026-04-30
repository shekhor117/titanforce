"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Goal {
  player: string
  minute: string
  assist?: string
}

interface Lineup {
  position: string
  player: string
  number: number
}

interface Match {
  home: string
  away: string
  score: string | null
  date: string
  time: string
  venue: string
  status: "Upcoming" | "W" | "L" | "D"
  homeGoals?: Goal[]
  awayGoals?: Goal[]
  homeLineup?: Lineup[]
  awayLineup?: Lineup[]
}

const matches: Match[] = [
  { 
    home: "Titan Force", 
    away: "FC United", 
    score: null, 
    date: "Jan 15, 2025", 
    time: "3:00 PM", 
    venue: "Mulikandi Ground", 
    status: "Upcoming" 
  },
  { 
    home: "Titan Force", 
    away: "TBD", 
    score: "", 
    date: "", 
    time: "", 
    venue: "Mulikandi Ground", 
    status: "W",
    homeGoals: [
      { player: "", minute: "'", assist: "" },
      { player: "", minute: "'" }
    ],
    awayGoals: [
      { player: "Ahmed Hassan", minute: "45'" }
    ],
    homeLineup: [
      { position: "GK", player: "Shuronjit Ahmed", number: 1 },
      { position: "DEF", player: "Srijon Das", number: 3 },
      { position: "DEF", player: "Akash Rahman", number: 4 },
      { position: "DEF", player: "Shekhor Chandra Das", number: 17 },
      { position: "MID", player: "Sujon Ahmed", number: 6 },
      { position: "MID", player: "Sojib Hossain", number: 8 },
      { position: "FWD", player: "Shuvo Islam", number: 7 },
      { position: "FWD", player: "Sajon Khan", number: 9 },
      { position: "FWD", player: "Kourov Ahmed", number: 11 }
    ],
    awayLineup: [
      { position: "GK", player: "John Smith", number: 1 },
      { position: "DEF", player: "Mike Johnson", number: 2 },
      { position: "DEF", player: "Chris Brown", number: 3 },
      { position: "MID", player: "David Lee", number: 4 },
      { position: "MID", player: "Robert Taylor", number: 5 },
      { position: "FWD", player: "Ahmed Hassan", number: 7 },
      { position: "FWD", player: "James Wilson", number: 9 }
    ]
  },
  { 
    home: "Royal FC", 
    away: "Titan Force", 
    score: "1-1", 
    date: "Jan 5, 2025", 
    time: "4:00 PM", 
    venue: "Royal Stadium", 
    status: "D",
    homeGoals: [
      { player: "Hassan Malik", minute: "31'" }
    ],
    awayGoals: [
      { player: "Sujon Ahmed", minute: "52'", assist: "Sojib Hossain" }
    ]
  },
  { 
    home: "Titan Force", 
    away: "City Eagles", 
    score: "0-2", 
    date: "Dec 29, 2024", 
    time: "3:30 PM", 
    venue: "Mulikandi Ground", 
    status: "L",
    homeGoals: [],
    awayGoals: [
      { player: "Carlos Silva", minute: "18'" },
      { player: "Diego Martinez", minute: "64'" }
    ]
  },
]

export function Matches() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
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

    return () => observer.disconnect()
  }, [])

  const getStatusColor = (status: Match["status"]) => {
    switch (status) {
      case "W":
        return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e", label: "Win" }
      case "L":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444", label: "Loss" }
      case "D":
        return { bg: "rgba(251, 191, 36, 0.2)", text: "#fbbf24", label: "Draw" }
      default:
        return { bg: "rgba(220, 38, 38, 0.2)", text: "var(--primary)", label: t.matches.upcoming }
    }
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
            const statusStyle = getStatusColor(match.status)
            return (
            <button
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
                      <span className="text-primary">{match.score || "vs"}</span>{" "}
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
                      {match.status === "Upcoming" ? t.matches.upcoming : statusStyle.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

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
                  {selectedMatch.home} <span className="text-primary">{selectedMatch.score || "vs"}</span> {selectedMatch.away}
                </div>
                <div className={`text-sm text-foreground/60 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedMatch.date} • {selectedMatch.time} • {selectedMatch.venue}
                </div>
              </div>

              {selectedMatch.status === "Upcoming" ? (
                <div className={`text-center text-foreground/70 py-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "এই ম্যাচটি এখনও খেলা হয়নি" : "Match not yet played"}
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
                  {selectedMatch.homeLineup && (
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
