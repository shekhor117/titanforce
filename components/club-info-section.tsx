'use client'

import { useEffect, useState } from 'react'
import { Users, MapPin } from 'lucide-react'
import { dataStore } from '@/lib/data-store'

const defaultClubInfoData = [
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
]

export function ClubInfoSection() {
  const [clubInfoData, setClubInfoData] = useState(defaultClubInfoData)

  useEffect(() => {
    try {
      const clubInfo = dataStore.getClubInfo()
      if (clubInfo) {
        setClubInfoData([
          { icon: Users, label: 'FOUNDED', value: clubInfo.founded },
          { icon: MapPin, label: 'HOME GROUND', value: clubInfo.homeGround },
        ])
      }
    } catch (err) {
      console.log('[v0] Failed to load club info:', err)
    }
  }, [])

  return (
    <section className="bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {clubInfoData.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="neo-card flex flex-col items-center justify-center p-4 md:p-6 group transition-colors hover:bg-accent/10"
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
