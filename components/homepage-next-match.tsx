"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"

interface MatchItem {
  id: string
  home: string
  away: string
  date: string
  time: string
  venue: string
  tournament?: string
  homeImage?: string
  awayImage?: string
}

export function HomepageNextMatch() {
  const { language, t } = useLanguage()
  const [nextMatch, setNextMatch] = useState<MatchItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock next match data
    const mockMatch: MatchItem = {
      id: "1",
      home: "TITAN FORCE",
      away: "CITY ROVERS",
      date: "25 MAY 2024",
      time: "15:00",
      venue: "TITAN STADIUM",
      tournament: "PREMIER LEAGUE",
      homeImage: "/logos/titanforce-logo.svg",
      awayImage: "/logos/city-rovers-logo.svg"
    }
    
    setNextMatch(mockMatch)
    setLoading(false)
  }, [])

  if (!nextMatch) return null

  return (
    <section className="py-16 md:py-24 bg-secondary relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-3">
            {language === "bn" ? "পরবর্তী ম্যাচ" : "NEXT MATCH"}
          </p>
          <div className="flex items-center justify-between">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl uppercase tracking-wider text-foreground">
              {language === "bn" ? "আসন্ন খেলা" : "UPCOMING FIXTURE"}
            </h2>
            <Link
              href="/fixtures-results"
              className="text-sm uppercase tracking-wide font-semibold text-primary hover:text-accent transition-colors hidden md:block"
            >
              {language === "bn" ? "সব ম্যাচ দেখুন" : "VIEW ALL MATCHES"}
            </Link>
          </div>
        </div>

        {/* Match Card */}
        <div className="glass-card rounded-lg overflow-hidden p-8 md:p-10">
          {/* Tournament Badge */}
          {nextMatch.tournament && (
            <div className="inline-block mb-6">
              <span className="px-4 py-2 glass-badge rounded text-xs font-bold uppercase tracking-wider text-primary">
                {nextMatch.tournament}
              </span>
            </div>
          )}

          {/* Match Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Home Team */}
            <div className="text-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                {nextMatch.homeImage ? (
                  <Image
                    src={nextMatch.homeImage}
                    alt={nextMatch.home}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">Logo</span>
                  </div>
                )}
              </div>
              <h3 className="font-[var(--font-display)] text-xl md:text-2xl tracking-wide text-foreground">
                {nextMatch.home}
              </h3>
            </div>

            {/* VS and Match Info */}
            <div className="text-center space-y-6">
              <div className="text-4xl md:text-5xl font-[var(--font-display)] tracking-wider text-primary">
                VS
              </div>
              
              {/* Time and Date */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{nextMatch.time}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{nextMatch.date}</span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-wide">{nextMatch.venue}</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                {nextMatch.awayImage ? (
                  <Image
                    src={nextMatch.awayImage}
                    alt={nextMatch.away}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">Logo</span>
                  </div>
                )}
              </div>
              <h3 className="font-[var(--font-display)] text-xl md:text-2xl tracking-wide text-foreground">
                {nextMatch.away}
              </h3>
            </div>
          </div>

          {/* Match Centre Button */}
          <div className="mt-10 flex justify-center">
            <Link
              href={`/fixtures-results/${nextMatch.id}`}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded hover:bg-accent transition-colors duration-300"
            >
              {language === "bn" ? "ম্যাচ সেন্টার" : "MATCH CENTRE"}
            </Link>
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/fixtures-results"
            className="inline-flex items-center gap-2 px-6 py-3 glass-btn-primary rounded font-bold text-sm uppercase tracking-wider text-foreground hover-lift transition-all"
          >
            {language === "bn" ? "সব ম্যাচ দেখুন" : "VIEW ALL MATCHES"}
          </Link>
        </div>
      </div>
    </section>
  )
}
