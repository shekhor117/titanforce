"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"
import { Activity, AlertCircle, CheckCircle, TrendingUp, Edit3, Clock } from "lucide-react"

interface PlayerUpdatesActivityProps {
  players: Player[]
}

export function PlayerUpdatesActivity({ players }: PlayerUpdatesActivityProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Generate player update events
  const generatePlayerEvents = () => {
    const events: Array<{
      id: string
      type: "status_change" | "stat_update" | "achievement" | "injury"
      player: Player
      description: string
      timestamp: Date
      icon: JSX.Element
      color: string
    }> = []

    players.forEach((player) => {
      // Status events
      if (player.status === "injured") {
        events.push({
          id: `${player.id}-injury`,
          type: "injury",
          player,
          description: isBn ? "আহত অবস্থায় আপডেট" : "Updated to injured status",
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          icon: <AlertCircle className="w-4 h-4" />,
          color: "text-yellow-400",
        })
      }

      // Achievement events
      if ((player.goals || 0) > 0) {
        events.push({
          id: `${player.id}-goals`,
          type: "achievement",
          player,
          description: `${isBn ? "স্কোর করেছে" : "Scored"} ${player.goals} ${isBn ? "গোল" : "goals"}`,
          timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
          icon: <TrendingUp className="w-4 h-4" />,
          color: "text-red-400",
        })
      }

      // Stats update events
      if ((player.appearances || 0) > 0) {
        events.push({
          id: `${player.id}-stats`,
          type: "stat_update",
          player,
          description: `${isBn ? "পরিসংখ্যান আপডেট" : "Stats updated"} - ${player.appearances} ${isBn ? "ম্যাচ" : "appearances"}`,
          timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
          icon: <Edit3 className="w-4 h-4" />,
          color: "text-accent",
        })
      }

      // Status change to active
      if (player.status === "active") {
        events.push({
          id: `${player.id}-active`,
          type: "status_change",
          player,
          description: isBn ? "সক্রিয় অবস্থায় ফিরেছে" : "Returned to active status",
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-green-400",
        })
      }
    })

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
  }

  const events = generatePlayerEvents()

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return isBn ? "এখনই" : "Just now"
    if (minutes < 60) return `${minutes} ${isBn ? "মিনিট আগে" : "min ago"}`
    if (hours < 24) return `${hours} ${isBn ? "ঘন্টা আগে" : "hr ago"}`
    if (days < 7) return `${days} ${isBn ? "দিন আগে" : "days ago"}`
    return date.toLocaleDateString()
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "injury":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case "achievement":
        return <TrendingUp className="w-4 h-4 text-red-400" />
      case "status_change":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "stat_update":
        return <Edit3 className="w-4 h-4 text-accent" />
      default:
        return <Activity className="w-4 h-4 text-foreground/50" />
    }
  }

  return (
    <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-display text-lg tracking-wider text-foreground flex items-center gap-2 ${isBn ? "font-bengali" : ""}`}>
          <Activity className="w-5 h-5 text-primary" />
          {isBn ? "সাম্প্রতিক আপডেট" : "Recent Updates"}
        </h3>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-3 rounded-lg border border-secondary/30 bg-secondary/10 hover:border-primary/50 transition"
            >
              <div className="mt-1 flex-shrink-0">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{event.player.name}</p>
                    <p className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-bengali" : ""}`}>
                      {event.description}
                    </p>
                  </div>
                  <span className="text-xs text-foreground/40 flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-foreground/50">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className={isBn ? "font-bengali" : ""}>
              {isBn ? "কোনো সাম্প্রতিক আপডেট নেই" : "No recent updates"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
