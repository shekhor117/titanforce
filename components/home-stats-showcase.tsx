'use client'

import { useEffect, useState } from 'react'
import { Users, Trophy, Users2, Heart, MapPin } from 'lucide-react'
import { usePlayers } from '@/lib/use-data-store'
import { ScrollProgressAnimation } from '@/components/scroll-progress-animation'
import { dataStore } from '@/lib/data-store'

const defaultStats = [
  { icon: Users, value: '120+', label: 'PLAYERS', color: 'text-accent' },
  { icon: Trophy, value: '15+', label: 'WINS', color: 'text-accent' },
  { icon: Users2, value: '8', label: 'TEAMS', color: 'text-accent' },
  { icon: Heart, value: '1', label: 'GOAL ONE VISION', color: 'text-accent' },
  { icon: MapPin, value: '1000+', label: 'FANS', color: 'text-accent' },
]

export function HomeStatsShowcase() {
  const { players } = usePlayers()
  const [stats, setStats] = useState(defaultStats)

  useEffect(() => {
    try {
      const statistics = dataStore.getStatistics()
      if (statistics) {
        setStats([
          { icon: Users, value: `${statistics.totalPlayers}+`, label: 'PLAYERS', color: 'text-accent' },
          { icon: Trophy, value: `${statistics.totalWins}+`, label: 'WINS', color: 'text-accent' },
          { icon: Users2, value: `${statistics.totalTeams}`, label: 'TEAMS', color: 'text-accent' },
          { icon: Heart, value: `${statistics.trophies || 1}`, label: 'GOAL ONE VISION', color: 'text-accent' },
          { icon: MapPin, value: `${statistics.totalFans}+`, label: 'FANS', color: 'text-accent' },
        ])
      }
    } catch (err) {
      console.log('[v0] Failed to load statistics:', err)
    }
  }, [])

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollProgressAnimation key={index} className="h-full">
              <div
                className="neo-card flex flex-col items-center justify-center p-4 md:p-6 text-center"
              >
                <Icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${stat.color} group-hover:text-primary transition-colors`} />
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-semibold text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              </ScrollProgressAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}
