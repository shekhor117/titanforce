"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface MatchEvent {
  id: string
  match_id: string
  event_type: "goal" | "card" | "substitution" | "milestone"
  player_id: string
  minute: number
  description: string
  metadata: Record<string, any>
  profiles: {
    id: string
    full_name: string
    jersey_number: number
    position: string
  }
}

export function MatchEventTimeline({ matchId }: { matchId: string }) {
  const { language } = useLanguage()
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isBn = language === "bn"

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/match-events?matchId=${matchId}`)
        if (!response.ok) throw new Error("Failed to fetch events")
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("[v0] Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [matchId])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "card":
        return "🟨"
      case "substitution":
        return "🔄"
      case "milestone":
        return "⭐"
      default:
        return "•"
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case "goal":
        return isBn ? "গোল" : "Goal"
      case "card":
        return isBn ? "কার্ড" : "Card"
      case "substitution":
        return isBn ? "প্রতিস্থাপন" : "Substitution"
      case "milestone":
        return isBn ? "মাইলস্টোন" : "Milestone"
      default:
        return type
    }
  }

  if (isLoading) {
    return <div className="text-foreground/60">{isBn ? "ইভেন্ট লোড হচ্ছে..." : "Loading events..."}</div>
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/60">
        {isBn ? "কোন ইভেন্ট নেই" : "No events yet"}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className={`font-[var(--font-display)] text-xl tracking-wider text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "ম্যাচ টাইমলাইন" : "Match Timeline"}
      </h3>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4 pb-4 border-b border-secondary last:border-0">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="text-2xl">{getEventIcon(event.event_type)}</div>
              {index < events.length - 1 && <div className="w-0.5 h-12 bg-secondary mt-2" />}
            </div>

            {/* Event Details */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-primary">{event.minute}'</span>
                <span className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {getEventLabel(event.event_type)}
                </span>
              </div>

              <div className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {event.profiles?.full_name} #{event.profiles?.jersey_number}
              </div>

              {event.description && (
                <p className={`text-sm text-foreground/70 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {event.description}
                </p>
              )}

              {event.event_type === "card" && event.metadata?.cardType && (
                <div className="mt-1 text-sm">
                  {event.metadata.cardType === "yellow" ? "🟨 " : "🟥 "}
                  {event.metadata.cardType === "yellow" ? (isBn ? "হলুদ কার্ড" : "Yellow Card") : (isBn ? "লাল কার্ড" : "Red Card")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
