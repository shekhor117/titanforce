"use client"

import { memo } from "react"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, MapPin, Trophy } from "lucide-react"
import { TransitionLink } from "@/components/transition-link"

interface HeroProps {
  skipAnimation?: boolean
}

function HeroComponent({ skipAnimation = false }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 bg-background">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_68%_35%,hsl(var(--primary)/0.12),transparent_32%),linear-gradient(120deg,hsl(var(--background)),hsl(var(--card)))]" />
      <div className="absolute inset-0 -z-10 opacity-[0.14] dark:opacity-[0.08]">
        <Image src="/images/hero-bg-soccer.jpg" alt="" fill priority className="object-cover object-left grayscale mix-blend-multiply dark:mix-blend-screen" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 select-none overflow-hidden text-center font-display text-[clamp(7rem,28vw,25rem)] font-black leading-none tracking-[-0.12em] text-primary/10">
        TITAN
      </div>

      <div className="mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 gap-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0 lg:px-12 lg:pb-14 lg:pt-10">
        <div className="relative z-10 flex flex-col justify-between gap-14">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-3"><span className="h-4 w-4 bg-primary" /> Mulikandi · Sylhet</span>
            <span>Est. 2025</span>
          </div>

          <div className="max-w-xl lg:pb-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.32em] text-primary">Pride of Mulikandi</p>
            <h1 className="font-display text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-foreground">
              Titan
              <span className="block text-primary">Force</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Titan Force FC — unbeaten Daudpur 2026 champions from Zakigonj, Sylhet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TransitionLink href="/team-squad" className="inline-flex items-center gap-8 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:-translate-y-1">
                Our squad <ArrowRight className="size-5" />
              </TransitionLink>
              <TransitionLink href="/fixtures-results" className="inline-flex items-center gap-8 border border-border bg-background/40 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary hover:text-primary">
                Fixtures <ArrowUpRight className="size-5" />
              </TransitionLink>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[430px] items-end justify-center lg:min-h-0">
          <div className="absolute bottom-5 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:h-80 sm:w-80" />
          <Image
            src="/players/player-17.png"
            alt="Titan Force player in the club kit"
            width={900}
            height={900}
            priority
            className={`relative z-10 h-auto w-[min(92vw,620px)] object-contain drop-shadow-[0_28px_28px_rgba(0,0,0,0.35)] transition-all duration-700 lg:absolute lg:bottom-0 lg:right-[-3%] lg:w-[min(58vw,680px)] ${skipAnimation ? "translate-y-0 opacity-100" : "animate-in fade-in slide-in-from-bottom-8"}`}
          />
          <div className="absolute bottom-5 left-4 z-20 inline-flex items-center gap-3 text-primary sm:left-8">
            <Trophy className="size-9" strokeWidth={1.5} />
            <div><p className="text-sm font-medium">Daudpur 2026</p><p className="text-xl font-black uppercase text-foreground">Champions</p></div>
          </div>
          <p className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rotate-90 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground lg:block">Pride of Mulikandi</p>
        </div>

        <div className="col-span-full border border-border bg-card/40 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next match</p>
            <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">12D : 20H : 34M</p><p className="mt-2 font-display text-2xl font-black uppercase sm:text-3xl">VS Zakigonj United</p><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" /> Mulikandi High School Ground</p></div>
            <ArrowUpRight className="hidden size-8 text-foreground sm:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

export const Hero = memo(HeroComponent)
