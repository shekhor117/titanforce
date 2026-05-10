"use client"

import { useState, useEffect } from "react"
import { dataStore } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"

interface MatchPredictionProps {
  matchId: string
  homeTeam: string
  awayTeam: string
  disabled?: boolean
}

export function MatchPrediction({ matchId, homeTeam, awayTeam, disabled = false }: MatchPredictionProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [voteCounts, setVoteCounts] = useState({ home: 0, draw: 0, away: 0 })
  const [userVote, setUserVote] = useState<"home" | "draw" | "away" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setVoteCounts(dataStore.getMatchVoteCounts(matchId))
    setUserVote(dataStore.getVisitorMatchVote(matchId))
  }, [matchId])

  const handleVote = (prediction: "home" | "draw" | "away") => {
    if (disabled) return
    
    dataStore.voteForMatch(matchId, prediction)
    setUserVote(prediction)
    setVoteCounts(dataStore.getMatchVoteCounts(matchId))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const total = voteCounts.home + voteCounts.draw + voteCounts.away
  const getPercentage = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-4">
      <h4 className={`text-xs font-semibold text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "আপনার ভবিষ্যদ্বাণী" : "Your Prediction"}
      </h4>

      <div className="flex gap-2">
        {/* Home Win */}
        <button
          onClick={() => handleVote("home")}
          disabled={disabled}
          className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
            userVote === "home"
              ? "border-primary bg-primary/10 text-primary"
              : "border-secondary hover:border-primary/50 text-foreground/70"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${isAnimating && userVote === "home" ? "scale-105" : ""}`}
        >
          <div className="text-center">
            <div className={`font-semibold text-sm mb-1 truncate ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {homeTeam}
            </div>
            <div className="text-xs text-foreground/50">{isBn ? "জয়" : "Win"}</div>
          </div>
        </button>

        {/* Draw */}
        <button
          onClick={() => handleVote("draw")}
          disabled={disabled}
          className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
            userVote === "draw"
              ? "border-primary bg-primary/10 text-primary"
              : "border-secondary hover:border-primary/50 text-foreground/70"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${isAnimating && userVote === "draw" ? "scale-105" : ""}`}
        >
          <div className="text-center">
            <div className={`font-semibold text-sm mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ড্র" : "Draw"}
            </div>
            <div className="text-xs text-foreground/50">{isBn ? "সমান" : "Tie"}</div>
          </div>
        </button>

        {/* Away Win */}
        <button
          onClick={() => handleVote("away")}
          disabled={disabled}
          className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
            userVote === "away"
              ? "border-primary bg-primary/10 text-primary"
              : "border-secondary hover:border-primary/50 text-foreground/70"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${isAnimating && userVote === "away" ? "scale-105" : ""}`}
        >
          <div className="text-center">
            <div className={`font-semibold text-sm mb-1 truncate ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {awayTeam}
            </div>
            <div className="text-xs text-foreground/50">{isBn ? "জয়" : "Win"}</div>
          </div>
        </button>
      </div>

      {/* Vote Results Bar */}
      {total > 0 && (
        <div className="space-y-2">
          <div className="flex h-2 rounded-full overflow-hidden bg-secondary/30">
            <div
              className="bg-primary transition-all duration-500"
              style={{ width: `${getPercentage(voteCounts.home)}%` }}
            />
            <div
              className="bg-secondary transition-all duration-500"
              style={{ width: `${getPercentage(voteCounts.draw)}%` }}
            />
            <div
              className="bg-foreground/30 transition-all duration-500"
              style={{ width: `${getPercentage(voteCounts.away)}%` }}
            />
          </div>
          
          <div className={`flex justify-between text-[10px] text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <span>{getPercentage(voteCounts.home)}%</span>
            <span>{getPercentage(voteCounts.draw)}%</span>
            <span>{getPercentage(voteCounts.away)}%</span>
          </div>
          
          <div className={`text-center text-[10px] text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {total} {isBn ? "ভোট" : "votes"}
          </div>
        </div>
      )}
    </div>
  )
}
