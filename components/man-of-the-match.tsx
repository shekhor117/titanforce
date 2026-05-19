"use client"

import { useEffect, useState, useRef } from "react"
import { Trophy } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useMatches, usePlayers } from "@/lib/use-data-store"

export function ManOfTheMatch() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMotm, setSelectedMotm] = useState<string | null>(null)

  // Use realtime hooks - automatically syncs when admin updates
  const { matches, loading: matchesLoading } = useMatches()
  const { players, loading: playersLoading } = usePlayers()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const isLoading = matchesLoading || playersLoading
  const latestMatch = matches.find(m => m.status === 'completed') || matches[0] || null

  const handleMotmSelection = (playerId: string) => {
    setSelectedMotm(selectedMotm === playerId ? null : playerId)
  }

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto text-center text-foreground/60">
          {isBn ? "লোড হচ্ছে..." : "Loading..."}
        </div>
      </section>
    )
  }

  if (!latestMatch) {
    return (
      <section ref={sectionRef} className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto text-center text-foreground/60">
          {isBn ? "কোন ম্যাচ পাওয়া যায়নি" : "No matches found"}
        </div>
      </section>
    )
  }

  const matchTitle = `${latestMatch.home} ${latestMatch.home_score !== null ? latestMatch.home_score : ""} - ${latestMatch.away_score !== null ? latestMatch.away_score : ""} ${latestMatch.away}`

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className={`text-center mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl tracking-wider text-foreground mb-4">
            {isBn ? "ম্যাচ অফ দ্য ম্যাচ" : "MAN OF THE MATCH"}
          </h2>
        </div>

        {/* Match Info */}
        <div className={`text-center mb-8 transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-[var(--font-display)] text-2xl md:text-3xl tracking-wide text-foreground mb-2">
            {matchTitle}
          </p>
          <p className="text-foreground/60 text-sm">
            {isBn ? "সর্বশেষ ম্যাচ • " : "Latest Match • "}
            {latestMatch.date}
          </p>
        </div>



        {/* Player Cards Grid */}
        <div className={`transition-all duration-600 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handleMotmSelection(player.id)}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMotm === player.id
                    ? "border-primary bg-primary/10"
                    : "border-secondary bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Jersey Number */}
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition">
                    <span className="font-[var(--font-display)] text-2xl font-bold text-foreground">
                      {player.num}
                    </span>
                  </div>

                  {/* Player Name */}
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">{player.name}</p>
                    <p className="text-xs text-foreground/60 uppercase tracking-wider">
                      {player.category}
                    </p>
                  </div>

                  {/* MOTM Badge */}
                  {selectedMotm === player.id && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                      <Trophy className="w-3 h-3" />
                      {isBn ? "নির্বাচিত" : "Selected"}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {selectedMotm && (
          <div className={`text-center mt-12 transition-all duration-600 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <button className="px-8 py-3 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold rounded-lg transition">
              {isBn ? "ম্যাচ অফ দ্য ম্যাচ নির্বাচন করুন" : "Confirm Man of the Match"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
