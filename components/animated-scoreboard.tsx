"use client"

import { useEffect, useState } from "react"

interface AnimatedScoreboardProps {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  isLive?: boolean
}

export function AnimatedScoreboard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  isLive = false,
}: AnimatedScoreboardProps) {
  const [displayHomeScore, setDisplayHomeScore] = useState(homeScore)
  const [displayAwayScore, setDisplayAwayScore] = useState(awayScore)
  const [animatingHome, setAnimatingHome] = useState(false)
  const [animatingAway, setAnimatingAway] = useState(false)

  useEffect(() => {
    if (homeScore !== displayHomeScore) {
      setAnimatingHome(true)
      const timer = setTimeout(() => {
        setDisplayHomeScore(homeScore)
        setAnimatingHome(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [homeScore, displayHomeScore])

  useEffect(() => {
    if (awayScore !== displayAwayScore) {
      setAnimatingAway(true)
      const timer = setTimeout(() => {
        setDisplayAwayScore(awayScore)
        setAnimatingAway(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [awayScore, displayAwayScore])

  return (
    <div className="w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 border-2 border-primary/50 rounded-lg p-6 field-pattern">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Home Team */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.15em] stadium-announcement mb-2">
            {homeTeam}
          </p>
          <div
            className={`score-display text-4xl font-bold text-primary transition-all duration-300 ${
              animatingHome ? "animate-score-flip" : ""
            }`}
          >
            {displayHomeScore}
          </div>
        </div>

        {/* Divider with VS */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            VS
          </div>
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-bold text-green-500">
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.15em] stadium-announcement mb-2">
            {awayTeam}
          </p>
          <div
            className={`score-display text-4xl font-bold text-accent transition-all duration-300 ${
              animatingAway ? "animate-score-flip" : ""
            }`}
          >
            {displayAwayScore}
          </div>
        </div>
      </div>
    </div>
  )
}
