'use client'

import { useEffect, useState } from 'react'

interface MatchStatsVisualProps {
  label: string
  homeValue: number | string
  awayValue: number | string
  homeLabel: string
  awayLabel: string
  maxValue?: number
  isPercentage?: boolean
  animated?: boolean
}

export function MatchStatsVisual({
  label,
  homeValue,
  awayValue,
  homeLabel,
  awayLabel,
  maxValue = 100,
  isPercentage = false,
  animated = true,
}: MatchStatsVisualProps) {
  const [displayHome, setDisplayHome] = useState(animated ? 0 : homeValue)
  const [displayAway, setDisplayAway] = useState(animated ? 0 : awayValue)

  useEffect(() => {
    if (!animated) return

    const homeNum = typeof homeValue === 'string' ? parseInt(homeValue) : homeValue
    const awayNum = typeof awayValue === 'string' ? parseInt(awayValue) : awayValue

    let frame = 0
    const interval = setInterval(() => {
      frame++
      if (frame >= 20) {
        setDisplayHome(homeNum)
        setDisplayAway(awayNum)
        clearInterval(interval)
      } else {
        setDisplayHome(Math.round((homeNum * frame) / 20))
        setDisplayAway(Math.round((awayNum * frame) / 20))
      }
    }, 15)

    return () => clearInterval(interval)
  }, [homeValue, awayValue, animated])

  const homeNum = typeof displayHome === 'string' ? parseInt(displayHome) : displayHome
  const awayNum = typeof displayAway === 'string' ? parseInt(displayAway) : displayAway

  const homePercent = (homeNum / maxValue) * 100
  const awayPercent = (awayNum / maxValue) * 100

  return (
    <div className="space-y-3 py-4 px-4 rounded-lg bg-secondary/10 border border-secondary/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">{homeLabel}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</span>
        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider text-right">{awayLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Home Bar */}
        <div className="flex-1 h-8 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
            style={{ width: `${Math.min(homePercent, 100)}%` }}
          >
            {homePercent > 20 && (
              <span className="text-xs font-bold text-white">{isPercentage ? `${homeNum}%` : homeNum}</span>
            )}
          </div>
        </div>

        {/* Center divider */}
        <div className="text-xs font-semibold text-foreground/50 w-8 text-center">vs</div>

        {/* Away Bar */}
        <div className="flex-1 h-8 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-indigo-600 to-indigo-500 rounded-full transition-all duration-500 ease-out flex items-center justify-start pl-2 ml-auto"
            style={{ width: `${Math.min(awayPercent, 100)}%` }}
          >
            {awayPercent > 20 && (
              <span className="text-xs font-bold text-white">{isPercentage ? `${awayNum}%` : awayNum}</span>
            )}
          </div>
        </div>
      </div>

      {/* Values display */}
      <div className="flex items-center justify-between text-xs text-foreground/60">
        <span>{isPercentage ? `${homeNum}%` : homeNum}</span>
        <span className="text-foreground/40">•</span>
        <span>{isPercentage ? `${awayNum}%` : awayNum}</span>
      </div>
    </div>
  )
}
