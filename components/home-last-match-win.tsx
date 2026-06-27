'use client'

import { useMatches } from '@/lib/use-data-store'
import { Trophy, Clock, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { ScrollAnimatedElement } from './scroll-animated-element'

export function HomeLastMatchWin() {
  const { matches } = useMatches()

  // Find the most recent match won by 2 goals
  const lastWinBy2Goals = matches.find(match => {
    if (match.status !== 'completed') return false
    
    const homeScore = match.home_score
    const awayScore = match.away_score
    
    // Check if home team (TITAN FORCE) won by 2 goals
    const titanForceIsHome = match.home?.toLowerCase().includes('titan') || match.home === 'TITAN FORCE'
    
    if (titanForceIsHome) {
      return homeScore - awayScore === 2
    } else {
      return awayScore - homeScore === 2
    }
  })

  if (!lastWinBy2Goals) {
    return (
      <ScrollAnimatedElement variant="fadeInRight">
        <div className="neo-card p-6 h-full flex items-center justify-center">
          <p className="text-muted-foreground text-center">No recent wins by 2 goals</p>
        </div>
      </ScrollAnimatedElement>
    )
  }

  // Determine if TITAN FORCE was home or away
  const titanForceIsHome = lastWinBy2Goals.home?.toLowerCase().includes('titan') || lastWinBy2Goals.home === 'TITAN FORCE'
  const titanForceScore = titanForceIsHome ? lastWinBy2Goals.home_score : lastWinBy2Goals.away_score
  const opponentScore = titanForceIsHome ? lastWinBy2Goals.away_score : lastWinBy2Goals.home_score
  const opponent = titanForceIsHome ? lastWinBy2Goals.away : lastWinBy2Goals.home
  const location = titanForceIsHome ? 'HOME' : 'AWAY'

  return (
    <ScrollAnimatedElement variant="fadeInRight">
      <div className="neo-card overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-accent/10 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-accent" />
            <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
              LAST MATCH WIN
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Victory by 2 goals
          </p>
        </div>

        {/* Match Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Location Badge */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              location === 'HOME' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-accent/20 text-accent'
            }`}>
              {location}
            </span>
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary">
                <span className="text-sm font-bold text-primary">TF</span>
              </div>
              <p className="text-xs font-bold text-center max-w-20">
                TITAN FORCE
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-black text-primary">
                {titanForceScore}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                VS
              </p>
              <p className="text-3xl font-black text-foreground mt-1">
                {opponentScore}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center border-2 border-muted-foreground">
                <span className="text-sm font-bold text-muted-foreground">
                  {opponent.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-bold text-center max-w-20">
                {opponent}
              </p>
            </div>
          </div>

          {/* Match Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">
                {lastWinBy2Goals.date || 'Recently'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">
                {lastWinBy2Goals.venue || 'Mulikandi Sports Ground'}
              </span>
            </div>

            {lastWinBy2Goals.homeGoals && lastWinBy2Goals.homeGoals.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">
                  {lastWinBy2Goals.homeGoals.length} Goals Scored
                </span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/fixtures-results"
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-lg transition-all duration-300 text-center"
          >
            View Match
          </Link>
        </div>
      </div>
    </ScrollAnimatedElement>
  )
}
