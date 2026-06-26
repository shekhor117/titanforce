"use client"

import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-soccer.jpg"
          alt="Titan Force Mulikandi players celebrating"
          fill
          priority
          className="object-cover object-[70%_top] sm:object-top opacity-80 sm:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/70 to-background/40 sm:to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-24 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 min-h-[560px] sm:min-h-[680px]">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-red-600 text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 sm:mb-6">
            <span className="h-px w-6 sm:w-8 bg-red-600" /> RISE LIKE TITANS
          </div>
          <h1 className="font-display font-bold leading-[0.85]">
            <span className="block text-foreground text-[clamp(2.25rem,11vw,8rem)] tracking-[0.1em]">TITAN FORCE</span>
            <span className="block text-red-600 text-[clamp(2.75rem,13vw,10rem)] tracking-[0.1em]">
              MULIKANDI
            </span>
          </h1>
          <p className="mt-5 sm:mt-6 text-muted-foreground max-w-md text-sm leading-relaxed">
            Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <TransitionLink href="/team-squad" className="no-underline">
              <button className="group inline-flex items-center gap-2 rounded-md bg-red-600 px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-white hover:bg-red-700 transition-colors">
                OUR PLAYER
              </button>
            </TransitionLink>
            <TransitionLink href="/fixtures-results" className="no-underline">
              <button className="inline-flex items-center gap-3 rounded-md border border-border bg-card/40 backdrop-blur px-4 sm:px-5 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] hover:bg-card transition-colors">
                MATCHES
              </button>
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
