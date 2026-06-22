"use client"

import { Users, Trophy, Users2, Zap, Heart } from "lucide-react"

export function StatsOverview() {
  const stats = [
    {
      icon: Users,
      value: "120+",
      label: "PLAYERS",
    },
    {
      icon: Trophy,
      value: "15+",
      label: "WINS",
    },
    {
      icon: Users2,
      value: "8",
      label: "TEAMS",
    },
    {
      icon: Zap,
      value: "1",
      label: "GOAL ONE VISION",
    },
    {
      icon: Heart,
      value: "1000+",
      label: "FANS",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <Icon className="w-8 h-8 md:w-12 md:h-12 text-primary mb-3 md:mb-4 group-hover:text-accent transition-colors" />
                <p className="text-white font-[var(--font-display)] text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider">
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
