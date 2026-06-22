"use client"

import { Users } from "lucide-react"

export function JoinClubCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-black via-primary/5 to-black border-y border-border">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div>
            <h3 className="text-white font-[var(--font-display)] text-3xl md:text-4xl tracking-wide uppercase mb-4">
              One Team. One Dream. One Community.
            </h3>
            <p className="text-foreground/80 text-lg leading-relaxed mb-0">
              Be a part of something bigger. Support your local team. Support Titan Force Mulikandi.
            </p>
          </div>

          {/* Right CTA Button */}
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded transition-colors uppercase tracking-wider text-sm font-[var(--font-display)] whitespace-nowrap">
            <Users className="w-5 h-5" />
            Join the Club
          </button>
        </div>
      </div>
    </section>
  )
}
