"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface Match {
  home: string
  away: string
  score: string | null
  date: string
  time: string
  venue: string
  status: "Upcoming" | "W" | "L" | "D"
}

const matches: Match[] = [
  { home: "Titan Force", away: "FC United", score: null, date: "Jan 15, 2025", time: "3:00 PM", venue: "Mulikandi Ground", status: "Upcoming" },
  { home: "Titan Force", away: "Star Academy", score: "2-1", date: "Jan 10, 2025", time: "2:30 PM", venue: "Mulikandi Ground", status: "W" },
  { home: "Royal FC", away: "Titan Force", score: "1-1", date: "Jan 5, 2025", time: "4:00 PM", venue: "Royal Stadium", status: "D" },
  { home: "Titan Force", away: "City Eagles", score: "0-2", date: "Dec 29, 2024", time: "3:30 PM", venue: "Mulikandi Ground", status: "L" },
]

export function Matches() {
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
              <div
                key={index}
                className={`rounded-xl p-6 border-2 border-secondary bg-card transition-all duration-600 hover:border-primary hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
