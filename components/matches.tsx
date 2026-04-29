"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface Match {
  home: string
  away: string
  score: string | null
  date: string
  status: "Upcoming" | "W" | "L" | "D"
}

const matches: Match[] = [
  { home: "Titan Force", away: "TBD", score: null, date: "", status: "Upcoming" }
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
        return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" }
      case "L":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" }
      default:
        return { bg: "rgba(220, 38, 38, 0.2)", text: "var(--primary)" }
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
                className={`rounded-xl p-5 border-2 border-secondary bg-card flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-xs uppercase tracking-wider text-foreground/50 font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {match.date || t.matches.dateTbd}
                </div>
                <div className="font-[var(--font-display)] text-xl tracking-wider text-center text-foreground">
                  {match.home}{" "}
                  <span className="text-primary">{match.score || "vs"}</span>{" "}
                  {match.away}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  style={{ background: statusStyle.bg, color: statusStyle.text }}
                >
                  {match.status === "Upcoming" ? t.matches.upcoming : match.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
