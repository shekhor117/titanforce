'use client'

import { Goal, AlertCircle, Repeat2 } from 'lucide-react'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface TimelineTabProps {
  match: Match
}

interface TimelineEvent {
  minute: number
  type: 'goal' | 'card' | 'substitution'
  player: string
  team: 'home' | 'away'
  description?: string
  cardColor?: 'yellow' | 'red'
}

export function TimelineTab({ match }: TimelineTabProps) {
  const { isBn } = useLanguage()

  // Generate timeline events
  const timelineEvents: TimelineEvent[] = [
    { minute: 15, type: 'goal', player: 'Mohamed Salah', team: 'home', description: 'Assist: Trent' },
    { minute: 33, type: 'card', player: 'Rodri', team: 'away', cardColor: 'yellow' },
    { minute: 45, type: 'substitution', player: 'Fabinho → Wataru Endo', team: 'home' },
    { minute: 61, type: 'substitution', player: 'Grealish → Foden', team: 'away' },
    { minute: 67, type: 'goal', player: 'Luis Díaz', team: 'home', description: 'Assist: Salah' },
    { minute: 72, type: 'card', player: 'Van Dijk', team: 'home', cardColor: 'yellow' },
    { minute: 79, type: 'goal', player: 'Darwin Núñez', team: 'home' },
    { minute: 85, type: 'card', player: 'De Bruyne', team: 'away', cardColor: 'yellow' },
  ]

  const getEventIcon = (type: string, color?: string) => {
    switch (type) {
      case 'goal':
        return <Goal className="w-5 h-5 text-emerald-400" />
      case 'card':
        return (
          <div className={`w-5 h-5 rounded-sm ${color === 'red' ? 'bg-red-500' : 'bg-yellow-400'}`} />
        )
      case 'substitution':
        return <Repeat2 className="w-5 h-5 text-blue-400" />
      default:
        return null
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'goal':
        return isBn ? 'গোল' : 'Goal'
      case 'card':
        return isBn ? 'কার্ড' : 'Card'
      case 'substitution':
        return isBn ? 'বিনিময়' : 'Substitution'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {match.status === 'upcoming' ? (
        <div className="neo-panel p-12 text-center">
          <p className="text-foreground/60">{isBn ? 'ম্যাচ এখনও খেলা হয়নি' : 'Match not yet played'}</p>
        </div>
      ) : (
        <>
          <div className="neo-panel p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-primary/20" />

              {/* Events */}
              <div className="space-y-6">
                {timelineEvents.map((event, i) => (
                  <div key={i} className="flex gap-6 relative">
                    {/* Icon */}
                    <div className="flex justify-center w-16 flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 border-4 border-background relative z-10">
                        {getEventIcon(event.type, event.cardColor)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                              {event.minute}'
                            </span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                              {getEventLabel(event.type)}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground">{event.player}</div>
                          {event.description && (
                            <div className="text-xs text-foreground/60 mt-1">{event.description}</div>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${
                            event.team === 'home'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {event.team === 'home' ? match.home : match.away}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Match End */}
                <div className="flex gap-6 relative mt-8 pt-6 border-t border-secondary/30">
                  <div className="flex justify-center w-16 flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-4 border-background relative z-10">
                      <span className="text-sm font-bold text-primary">FT</span>
                    </div>
                  </div>
                  <div className="flex-1 py-2">
                    <div className="font-semibold text-foreground">
                      {isBn ? 'চূড়ান্ত' : 'Full Time'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
