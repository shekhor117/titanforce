'use client'

import { Users, Trophy, Users2, Heart, MapPin } from 'lucide-react'
import { usePlayers } from '@/lib/use-data-store'
import { ScrollProgressAnimation } from '@/components/scroll-progress-animation'

export function HomeStatsShowcase() {
  const { players } = usePlayers()

  const stats = [
    {
      icon: Users,
      value: '120+',
      label: 'PLAYERS',
      color: 'text-accent'
    },
    {
      icon: Trophy,
      value: '15+',
      label: 'WINS',
      color: 'text-accent'
    },
    {
      icon: Users2,
      value: '8',
      label: 'TEAMS',
      color: 'text-accent'
    },
    {
      icon: Heart,
      value: '1',
      label: 'GOAL ONE VISION',
      color: 'text-accent'
    },
    {
      icon: MapPin,
      value: '1000+',
      label: 'FANS',
      color: 'text-accent'
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollProgressAnimation key={index} className="h-full">
              <div
                className="neo-card flex flex-col items-center justify-center p-6 md:p-8 text-center group transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} group-hover:text-primary transition-colors duration-300 relative z-10`} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground mb-2 leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-bold text-muted-foreground">
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
