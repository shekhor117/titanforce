'use client'

import { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'
import { Clock, MapPin, Trophy } from 'lucide-react'

interface EnhancedMatchCardProps {
  match: Match
  onClick?: () => void
  animated?: boolean
}

export function EnhancedMatchCard({ match, onClick, animated = true }: EnhancedMatchCardProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const getStatusDisplay = () => {
    if (match.status === 'live') return { label: 'LIVE', color: 'bg-rose-500/20 text-rose-400', pulse: true }
    if (match.status === 'completed') {
      if (match.result === 'W') return { label: 'Win', color: 'bg-emerald-500/20 text-emerald-400', pulse: false }
      if (match.result === 'L') return { label: 'Loss', color: 'bg-rose-500/20 text-rose-400', pulse: false }
      return { label: 'Draw', color: 'bg-yellow-500/20 text-yellow-400', pulse: false }
    }
    return { label: isBn ? 'আসছে' : 'Upcoming', color: 'bg-blue-500/20 text-blue-400', pulse: false }
  }

  const getScoreDisplay = () => {
    if (match.home_score !== null && match.away_score !== null) {
      return `${match.home_score} - ${match.away_score}`
    }
    return 'vs'
  }

  const status = getStatusDisplay()

  return (
    <button
      onClick={onClick}
      className={`w-full neo-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-102 active:scale-98 ${
        animated ? 'opacity-100 translate-y-0' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {match.venue && (
            <div className="flex items-center gap-1 text-xs text-foreground/60">
              <MapPin className="w-3 h-3" />
              <span>{match.venue.substring(0, 15)}...</span>
            </div>
          )}
        </div>
        <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}>
          {status.label}
        </div>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-3 items-center gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mb-2">
            <span className="text-white font-black text-lg">{match.home?.substring(0, 2).toUpperCase()}</span>
          </div>
          <h3 className="font-semibold text-sm text-foreground truncate">{match.home}</h3>
          <span className="text-xs text-foreground/60 mt-1">{isBn ? 'হোম' : 'Home'}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-[var(--font-display)] tracking-wider text-foreground mb-2">
            <span className="text-primary">{getScoreDisplay()}</span>
          </div>
          {match.date && (
            <div className="flex items-center gap-1 text-xs text-foreground/60">
              <Clock className="w-3 h-3" />
              <span>{match.date}</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center mb-2">
            <span className="text-white font-black text-lg">{match.away?.substring(0, 2).toUpperCase()}</span>
          </div>
          <h3 className="font-semibold text-sm text-foreground truncate">{match.away}</h3>
          <span className="text-xs text-foreground/60 mt-1">{isBn ? 'পরদেশ' : 'Away'}</span>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {match.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-secondary/30 flex justify-around text-xs text-foreground/70">
          <div className="text-center">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-primary" />
            <span className="block">{isBn ? 'গোলস' : 'Goals'}</span>
          </div>
          <div className="text-center">
            <span className="block text-foreground font-semibold">{match.home_score ?? '-'}</span>
            <span className="block text-xs">-</span>
          </div>
          <div className="text-center">
            <span className="block text-foreground font-semibold">{match.away_score ?? '-'}</span>
          </div>
        </div>
      )}
    </button>
  )
}
