'use client'

import { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'
import { MapPin, Clock, Trophy } from 'lucide-react'

interface MatchHeroProps {
  match: Match
}

export function MatchHero({ match }: MatchHeroProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const getStatusBadge = () => {
    if (match.status === 'live') {
      return { text: 'LIVE', bg: 'bg-rose-600', pulse: true }
    }
    if (match.status === 'completed') {
      if (match.result === 'W') return { text: 'WIN', bg: 'bg-emerald-600', pulse: false }
      if (match.result === 'L') return { text: 'LOSS', bg: 'bg-rose-600', pulse: false }
      return { text: 'DRAW', bg: 'bg-yellow-600', pulse: false }
    }
    return { text: 'UPCOMING', bg: 'bg-blue-600', pulse: false }
  }

  const badge = getStatusBadge()

  return (
    <div className="relative overflow-hidden rounded-2xl neo-panel mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="relative p-8 sm:p-12 md:p-16">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/60 font-semibold mb-2">
              {match.date} {match.time && `• ${match.time}`}
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-white text-xs ${badge.bg} ${badge.pulse ? 'animate-pulse' : ''}`}>
            {badge.text}
          </div>
        </div>

        {/* Main Match Display */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 items-center mb-8">
          {/* Home Team */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
              <span className="text-white font-black text-2xl sm:text-3xl">{match.home?.substring(0, 2).toUpperCase()}</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{match.home}</h2>
            <p className="text-xs text-foreground/60 mt-1">{isBn ? 'হোম' : 'Home'}</p>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-[var(--font-display)] font-black tracking-wider">
                <span className="text-primary">{match.home_score ?? '-'}</span>
                <span className="text-foreground/30 text-4xl sm:text-5xl md:text-6xl mx-2">:</span>
                <span className="text-primary">{match.away_score ?? '-'}</span>
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">
              {match.status === 'completed' ? (isBn ? 'চূড়ান্ত' : 'FINAL') : match.status === 'live' ? 'LIVE' : isBn ? 'সর্বশেষ' : 'SCHEDULE'}
            </p>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
              <span className="text-white font-black text-2xl sm:text-3xl">{match.away?.substring(0, 2).toUpperCase()}</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{match.away}</h2>
            <p className="text-xs text-foreground/60 mt-1">{isBn ? 'পরদেশ' : 'Away'}</p>
          </div>
        </div>

        {/* Match Details Bar */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-secondary/30 justify-center">
          {match.venue && (
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{match.venue}</span>
            </div>
          )}
          {match.time && (
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Clock className="w-4 h-4 text-primary" />
              <span>{match.time}</span>
            </div>
          )}
          {match.status === 'completed' && (
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Trophy className="w-4 h-4 text-primary" />
              <span>{isBn ? 'শেষ' : 'Finished'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
