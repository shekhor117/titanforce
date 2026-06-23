"use client"

import { Calendar, MapPin, Clock, Edit2, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { Match } from "@/lib/data-service"

interface MatchManagementCardProps {
  match: Match
  onEdit?: (match: Match) => void
  onDelete?: (matchId: string) => void
  showActions?: boolean
}

export function MatchManagementCard({
  match,
  onEdit,
  onDelete,
  showActions = true,
}: MatchManagementCardProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "live":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getResultStyle = (result?: string) => {
    switch (result) {
      case "W":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "L":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "D":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getResultLabel = (result?: string) => {
    switch (result) {
      case "W":
        return isBn ? "জয়" : "Win"
      case "L":
        return isBn ? "হার" : "Loss"
      case "D":
        return isBn ? "ড্র" : "Draw"
      default:
        return ""
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-card/40 p-4 hover:border-primary/60 match-card-hover field-pattern transition-all">
      {/* Team highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold border ${getStatusStyle(match.status || "upcoming")}`}>
          {match.status === "live" && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />}
          {match.status === "upcoming" ? (isBn ? "আসন্ন" : "Upcoming") : match.status === "live" ? "LIVE" : isBn ? "সম্পন্ন" : "Completed"}
        </span>
      </div>

      {/* Match Info Header */}
      <div className="mb-4 pb-3 border-b border-primary/20">
        <h4 className="font-semibold text-foreground text-sm mb-2 match-title">{match.opponent || "Match"}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 text-primary" />
          <span>{match.date}</span>
          {match.time && (
            <>
              <Clock className="w-3 h-3 text-primary ml-2" />
              <span>{match.time}</span>
            </>
          )}
          {match.venue && (
            <>
              <MapPin className="w-3 h-3 text-primary ml-2" />
              <span className="truncate">{match.venue}</span>
            </>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-4 pb-4 border-b border-primary/20">
        <div className="grid grid-cols-3 gap-3 items-center">
          {/* Home Team */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 stadium-announcement">Home</p>
            <div className="score-display text-xl font-bold text-primary">
              {match.home_score !== null ? match.home_score : "-"}
            </div>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-bold uppercase text-foreground/50">vs</div>
            <div className="w-0.5 h-6 bg-primary/20" />
          </div>

          {/* Away Team */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 stadium-announcement">Away</p>
            <div className="score-display text-xl font-bold text-accent">
              {match.away_score !== null ? match.away_score : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Match Type & Result */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold border ${
            match.match_type === "home" ? "bg-primary/20 text-primary border-primary/30" : "bg-accent/20 text-accent border-accent/30"
          }`}>
            {match.match_type === "home" ? (isBn ? "বাড়ি" : "Home") : isBn ? "দূরে" : "Away"}
          </span>
        </div>
        {match.result && (
          <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getResultStyle(match.result)}`}>
            {getResultLabel(match.result)}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 border-t border-primary/20">
          {onEdit && (
            <button
              onClick={() => onEdit(match)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Edit2 className="w-4 h-4" />
              {isBn ? "সম্পাদনা" : "Edit"}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(match.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {isBn ? "মুছুন" : "Delete"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
