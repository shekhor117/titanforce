'use client'

import { Users, Trophy, Users2, Heart, MapPin } from 'lucide-react'
import { usePlayers } from '@/lib/use-data-store'
import { CounterAnimation } from '@/components/counter-animation'
import { ScrollStaggerContainer } from '@/components/scroll-stagger-container'

export function HomeStatsShowcase() {
  const { players } = usePlayers()

  const stats = [
    {
      icon: Users,
      value: 120,
      suffix: '+',
      label: 'PLAYERS',
      color: 'text-accent'
    },
    {
      icon: Trophy,
      value: 15,
      suffix: '+',
      label: 'WINS',
      color: 'text-accent'
    },
    {
      icon: Users2,
      value: 8,
      label: 'TEAMS',
      color: 'text-accent'
    },
    {
      icon: Heart,
      value: 1,
      label: 'GOAL ONE VISION',
      color: 'text-accent'
    },
    {
      icon: MapPin,
      value: 1000,
      suffix: '+',
      label: 'FANS',
      color: 'text-accent'
    },
  ]

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <ScrollStaggerContainer 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
          staggerDelay={0.1}
          variant="fadeInUp"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border border-accent/20 bg-card/30 hover:bg-card/50 hover:border-accent/40 transition-all duration-300 group text-center"
              >
                <Icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${stat.color} group-hover:text-primary transition-colors`} />
                <CounterAnimation
                  end={stat.value}
                  suffix={stat.suffix || ''}
                  className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                  duration={2}
                  delay={index * 0.1}
                />
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-semibold text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </ScrollStaggerContainer>
      </div>
    </section>
  )
}
