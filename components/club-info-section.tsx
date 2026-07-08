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
    <section className="bg-background py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {clubInfoData.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="neo-card flex flex-col items-center justify-center p-6 md:p-8 group transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon className="w-7 h-7 md:w-9 md:h-9 text-accent group-hover:text-primary transition-colors duration-300 relative z-10" />
                </div>
                <p className="text-xs md:text-sm uppercase tracking-[0.15em] font-bold text-muted-foreground mb-2 text-center">
                  {item.label}
                </p>
                <p className="text-sm md:text-lg font-black text-foreground text-center leading-tight">
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
