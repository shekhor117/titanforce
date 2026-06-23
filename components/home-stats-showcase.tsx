'use client'

import { Users, Trophy, Users2, Heart, MapPin } from 'lucide-react'
import { usePlayers } from '@/lib/use-data-store'

export function HomeStatsShowcase() {
  const { players } = usePlayers()

  const stats = [
    {
      icon: Users,
      value: '120+',
      label: 'PLAYERS',
      color: 'text-primary'
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
      color: 'text-primary'
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
      color: 'text-primary'
    },
  ]

  return (
    <section className="py-16 md:py-20 px-4 bg-background relative overflow-hidden">
      {/* Subtle accent glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 md:p-8 rounded-lg border border-accent/20 bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all duration-300 group text-center hover:shadow-lg hover:shadow-accent/10 hover:scale-105"
              >
                <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-accent/10 transition-colors">
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} group-hover:text-accent transition-colors`} />
                </div>
                <p className="text-2xl md:text-3xl font-black text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
