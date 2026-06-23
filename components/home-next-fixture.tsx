'use client'

import { useMatches } from '@/lib/use-data-store'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HomeNextFixture() {
  const { matches } = useMatches()

  // Get the next upcoming match
  const nextMatch = matches.find(m => m.status === 'upcoming') || matches[0]

  if (!nextMatch) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-8 h-full flex items-center justify-center backdrop-blur-sm">
        <p className="text-muted-foreground text-sm">No upcoming matches</p>
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {nextMatch.competition || 'Local Championship'}
            </p>
            <h3 className="text-base font-bold text-foreground">
              Next Match
            </h3>
          </div>
          <Link
            href="/fixtures-results"
            className="text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center gap-0.5"
          >
            View
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Match Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-sm border border-border/50">
              <span className="text-sm font-bold text-foreground">TF</span>
            </div>
            <p className="text-xs font-semibold text-center text-foreground leading-tight">
              {nextMatch.home_team || 'TITAN FORCE'}
            </p>
          </div>

          <div className="text-center px-4">
            <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
              <p className="text-sm font-bold text-muted-foreground">vs</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-sm border border-border/50">
              <span className="text-sm font-bold text-foreground">OU</span>
            </div>
            <p className="text-xs font-semibold text-center text-foreground leading-tight">
              {nextMatch.away_team || 'OPPONENT'}
            </p>
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-2.5 mb-5 bg-muted/20 rounded-lg p-4 border border-border/50">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-foreground/80 font-medium">
              {nextMatch.match_date ? new Date(nextMatch.match_date).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : 'TBD'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-foreground/80 font-medium">
              {nextMatch.match_time || '4:00 PM'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-foreground/80 font-medium line-clamp-1">
              {nextMatch.venue || 'Mulikandi Sports Ground'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/fixtures-results"
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          Match Centre
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
