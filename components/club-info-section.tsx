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
    <section className="bg-gradient-to-b from-background to-card/30 py-16 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {clubInfoData.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className="relative neo-card flex flex-col items-center justify-center p-5 md:p-7 transition-all duration-300 hover:border-accent/50 hover:bg-card/80 backdrop-blur-sm border border-accent/10"
                >
                  <div className="mb-3 p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <p className="text-xs md:text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {item.label}
                  </p>
                  <p className="text-sm md:text-base font-bold text-foreground text-center group-hover:text-accent transition-colors duration-300">
                    {item.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
