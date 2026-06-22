'use client'

import { Users, MapPin, Award, Heart, Users2 } from 'lucide-react'

const clubInfoData = [
  {
    icon: Users,
    label: 'FOUNDED',
    value: '2025',
  },
  {
    icon: MapPin,
    label: 'HOME GROUND',
    value: 'MULIKANDI',
  },
  {
    icon: Award,
    label: 'COLORS',
    value: 'RED & BLACK',
  },
  {
    icon: Heart,
    label: 'MOTTO',
    value: 'ONE TEAM, ONE DREAM',
  },
  {
    icon: Users2,
    label: 'COMMUNITY',
    value: 'STRONGER TOGETHER',
  },
]

export function ClubInfoSection() {
  return (
    <section className="bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {clubInfoData.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border border-accent/20 bg-card/30 hover:bg-card/50 hover:border-accent/40 transition-all duration-300 group"
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent mb-3 group-hover:text-primary transition-colors" />
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-2">
                  {item.label}
                </p>
                <p className="text-sm md:text-base font-bold text-foreground text-center">
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
