"use client"

import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FixtureCardProps {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  location: string
  homeImage?: string
  awayImage?: string
  competition: string
}

export function NextFixtureCard({
  homeTeam,
  awayTeam,
  date,
  time,
  location,
  homeImage = "/placeholder-logo.png",
  awayImage = "/placeholder-logo.png",
  competition,
}: FixtureCardProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-border/40 bg-card hover:border-primary/50 transition-all duration-300 group">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-6">
        {/* Competition label */}
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {competition}
          </span>
        </div>

        {/* Match info */}
        <div className="flex-1 flex flex-col justify-center gap-6 mb-6">
          {/* Home team */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src={homeImage}
                alt={homeTeam}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-display text-xl font-bold text-white uppercase tracking-wider">
                {homeTeam}
              </p>
            </div>
          </div>

          {/* VS separator */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs font-bold uppercase">VS</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Away team */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src={awayImage}
                alt={awayTeam}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-display text-xl font-bold text-white uppercase tracking-wider">
                {awayTeam}
              </p>
            </div>
          </div>
        </div>

        {/* Match details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider gap-2">
          Match Centre
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
