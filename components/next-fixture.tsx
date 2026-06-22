"use client"

import { CalendarDays, Clock, MapPin } from "lucide-react"
import Image from "next/image"

export function NextFixture() {
  // Sample data - can be connected to actual data service
  const nextMatch = {
    competition: "Local Championship",
    date: "Sun, 26 May 2024",
    time: "4:00 PM",
    venue: "Mulikandi Sports Ground",
    homeTeam: {
      name: "TITAN FORCE MULIKANDI",
      logo: "/logos/titanforce-logo.svg",
    },
    awayTeam: {
      name: "RIVERSIDE UNITED",
      logo: "/logos/placeholder-logo.png",
    },
  }

  return (
    <div className="border-l-4 border-primary pl-6 py-8">
      <h3 className="text-white font-[var(--font-display)] text-2xl md:text-3xl tracking-wide uppercase mb-8">
        Next Fixture
      </h3>
      
      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        <p className="text-muted-foreground text-sm uppercase tracking-wider mb-6">
          {nextMatch.competition}
        </p>

        {/* Teams vs Layout */}
        <div className="flex items-center justify-between mb-8">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Image
              src={nextMatch.homeTeam.logo}
              alt={nextMatch.homeTeam.name}
              width={80}
              height={80}
              className="w-16 md:w-20 h-16 md:h-20 object-contain"
            />
            <p className="text-white font-semibold text-center text-sm md:text-base">
              {nextMatch.homeTeam.name}
            </p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center gap-2 px-4 md:px-6">
            <p className="text-muted-foreground text-2xl font-bold">VS</p>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Image
              src={nextMatch.awayTeam.logo}
              alt={nextMatch.awayTeam.name}
              width={80}
              height={80}
              className="w-16 md:w-20 h-16 md:h-20 object-contain"
            />
            <p className="text-white font-semibold text-center text-sm md:text-base">
              {nextMatch.awayTeam.name}
            </p>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>{nextMatch.date}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span>{nextMatch.time}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{nextMatch.venue}</span>
          </div>
        </div>

        {/* Match Centre Button */}
        <button className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm font-[var(--font-display)]">
          Match Centre →
        </button>
      </div>
    </div>
  )
}
