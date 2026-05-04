"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface MatchData {
  id: string
  title: string
  opponent: string
  date: string
  time?: string
  location: string
  status: "upcoming" | "completed" | "cancelled"
  titan_force_score?: number
  opponent_score?: number
  description?: string
  created_at: string
  updated_at: string
}

export function Matches() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLSection>(null)
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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/matches")
        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }
        const data = await response.json()
        setMatches(data || [])
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching matches:", err)
        setError(err instanceof Error ? err.message : "Failed to load matches")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e", label: isBn ? "সম্পন্ন" : "Completed" }
      case "cancelled":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444", label: isBn ? "বাতিল" : "Cancelled" }
      default:
        return { bg: "rgba(220, 38, 38, 0.2)", text: "var(--primary)", label: isBn ? "আসন্ন" : "Upcoming" }
    }
  }

  const formatScore = (titanForceScore?: number, opponentScore?: number) => {
    if (titanForceScore === undefined || opponentScore === undefined) {
      return "vs"
    }
    return `${titanForceScore} - ${opponentScore}`
  }

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-foreground/60">
          {isBn ? "ম্যাচ লোড হচ্ছে..." : "Loading matches..."}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section ref={sectionRef} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    )
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

        {matches.length === 0 ? (
          <div className={`text-center py-12 text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কোন ম্যাচ নির্ধারিত নেই" : "No matches scheduled"}
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => {
              const statusStyle = getStatusStyle(match.status)
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
                        {match.time || "-"}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="font-[var(--font-display)] text-2xl tracking-wider text-center text-foreground">
                        Titan Force{" "}
                        <span className="text-primary">{formatScore(match.titan_force_score, match.opponent_score)}</span>{" "}
                        {match.opponent}
                      </div>
                      <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {match.location}
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
                  Titan Force <span className="text-primary">{formatScore(selectedMatch.titan_force_score, selectedMatch.opponent_score)}</span> {selectedMatch.opponent}
                </div>
                <div className={`text-sm text-foreground/60 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedMatch.date} • {selectedMatch.time || "-"} • {selectedMatch.location}
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বিবরণ" : "Details"}
                  </h3>
                  <p className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {selectedMatch.description || (isBn ? "বিবরণ পাওয়া যায়নি" : "No description available")}
                  </p>
                </div>

                {selectedMatch.status === "completed" && (
                  <div>
                    <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "চূড়ান্ত ফলাফল" : "Final Result"}
                    </h3>
                    <div className="p-4 rounded-lg bg-secondary/20 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedMatch.titan_force_score} - {selectedMatch.opponent_score}
                      </div>
                      <div className={`text-sm text-foreground/70 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {selectedMatch.titan_force_score! > selectedMatch.opponent_score! 
                          ? (isBn ? "জয়" : "Victory")
                          : selectedMatch.titan_force_score! < selectedMatch.opponent_score!
                          ? (isBn ? "পরাজয়" : "Defeat")
                          : (isBn ? "ড্র" : "Draw")
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
