"use client"

import { memo } from "react"
import { TransitionLink } from "@/components/transition-link"
import { motion } from "framer-motion"
import { ArrowUpRight, MapPin, Trophy } from "lucide-react"

interface HeroProps {
  skipAnimation?: boolean
}

function HeroComponent({ skipAnimation = false }: HeroProps) {
  const reveal = skipAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }

  return (
    <section className="relative overflow-hidden bg-[#090909] text-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-7 sm:px-10 sm:pb-12 sm:pt-10">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 sm:text-sm">
          <span className="flex items-center gap-3"><span className="h-3 w-3 bg-[#e4002b]" /> Mulikandi · Sylhet</span>
          <span>Est. 2025</span>
        </div>

        <div className="relative mt-8 min-h-[540px] sm:mt-12 sm:min-h-[650px] lg:min-h-[720px]">
          <div className="absolute inset-x-0 top-8 text-center font-display text-[clamp(5rem,22vw,20rem)] font-black leading-[0.75] tracking-[-0.08em] text-transparent opacity-90 [text-shadow:1px_1px_0_#d90429,-1px_-1px_0_#d90429] sm:top-12">TITAN</div>
          <div className="absolute inset-x-0 bottom-4 z-20 text-center font-display text-[clamp(5.5rem,24vw,21rem)] font-black leading-[0.72] tracking-[-0.09em] text-[#f5f5f3]">FORCE</div>
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-footballer-C36iVKHafHeu5OQ2XHooVr84HmIk1p.png"
            alt="Footballer in a red Titan Force kit striking a ball"
            className="absolute left-1/2 top-0 z-10 h-full w-[118%] -translate-x-1/2 object-contain object-center sm:w-[92%] lg:w-[76%]"
            initial={{ opacity: skipAnimation ? 1 : 0, scale: skipAnimation ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute bottom-28 left-0 z-30 flex items-center gap-3 text-[#f4ae1a] sm:bottom-16">
            <Trophy className="h-9 w-9" aria-hidden="true" />
            <div><p className="text-xs uppercase tracking-wide sm:text-base">Daudpur 2026</p><p className="text-lg font-black uppercase text-white sm:text-2xl">Champions</p></div>
          </div>
          <span className="absolute right-0 top-1/4 z-30 hidden rotate-90 text-xs uppercase tracking-widest text-white/60 sm:block">Pride of Mulikandi</span>
        </div>

        <motion.div className="border-t border-white/20 pt-6 sm:pt-8" initial={reveal} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="max-w-4xl text-lg leading-snug text-white/65 sm:text-2xl">Titan Force FC — unbeaten Daudpur 2026 champions from Zakigonj, Sylhet.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-6">
            <TransitionLink href="/team-squad" className="inline-flex min-h-14 items-center justify-between bg-[#e4002b] px-6 text-lg font-black uppercase tracking-wide text-white no-underline sm:min-w-80 sm:px-10 sm:text-2xl">Our squad <span aria-hidden="true">→</span></TransitionLink>
            <TransitionLink href="/fixtures-results" className="inline-flex min-h-14 items-center justify-between border border-white/25 px-6 text-lg font-black uppercase tracking-wide text-white no-underline sm:min-w-80 sm:px-10 sm:text-2xl">Fixtures <ArrowUpRight className="h-7 w-7" aria-hidden="true" /></TransitionLink>
          </div>
          <div className="mt-8 border border-white/20 p-5 sm:mt-12 sm:p-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs uppercase tracking-wide text-white/60 sm:text-sm"><span>Next match</span><span className="text-[#e4002b]">12D : 20H : 34M</span></div>
            <div className="mt-5 flex items-center justify-between gap-4"><div><h2 className="font-display text-3xl font-black uppercase sm:text-5xl">Vs Zakigonj United</h2><p className="mt-3 flex items-center gap-2 text-sm text-white/60 sm:text-xl"><MapPin className="h-5 w-5" aria-hidden="true" /> Mulikandi High School Ground</p></div><span className="text-3xl" aria-hidden="true">↗</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const Hero = memo(HeroComponent)
