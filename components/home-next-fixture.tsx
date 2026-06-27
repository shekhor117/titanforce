'use client'

import { useMatches } from '@/lib/use-data-store'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollAnimatedElement } from './scroll-animated-element'

export function HomeNextFixture() {
  const { matches } = useMatches()

  // Get the next upcoming match
  const nextMatch = matches.find(m => m.status === 'upcoming') || matches[0]

  if (!nextMatch) {
    return (
      <ScrollAnimatedElement variant="fadeInLeft">
        <div className="neo-card p-6 h-full flex items-center justify-center">
          <p className="text-muted-foreground text-center">No upcoming matches</p>
        </div>
      </ScrollAnimatedElement>
    )
  }

  return (
    <ScrollAnimatedElement variant="fadeInLeft">
      <div className="neo-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-accent/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-accent rounded-full" />
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
            NEXT FIXTURE
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {nextMatch.competition || 'Local Championship'}
        </p>
      </div>

      {/* Match Details */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">TF</span>
            </div>
            <p className="text-xs font-bold text-center max-w-20">
              {nextMatch.home_team || 'TITAN FORCE'}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-accent">VS</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">OU</span>
            </div>
            <p className="text-xs font-bold text-center max-w-20">
              {nextMatch.away_team || 'OPPONENT'}
            </p>
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-muted-foreground">
              {nextMatch.match_date ? new Date(nextMatch.match_date).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              }) : 'TBD'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-muted-foreground">
              {nextMatch.match_time || '4:00 PM'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-muted-foreground">
              {nextMatch.venue || 'Mulikandi Sports Ground'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/fixtures-results"
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          MATCH CENTRE
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      </div>
    </ScrollAnimatedElement>
  )
}
