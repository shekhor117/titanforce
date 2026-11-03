"use client"

import { memo } from "react"
import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"
import { motion } from "framer-motion"

interface HeroProps {
  skipAnimation?: boolean
}

function HeroComponent({ skipAnimation = false }: HeroProps) {
  const reveal = (delay: number) => ({
    initial: { opacity: skipAnimation ? 1 : 0, y: skipAnimation ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay },
    viewport: { once: true },
  })

  return (
    <section className="relative isolate overflow-hidden border-b border-red-950/60 bg-[#090909] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(163,24,45,0.28),transparent_34%),linear-gradient(115deg,#090909_0%,#100b0c_52%,#230f12_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[62%] opacity-35 mix-blend-screen">
        <Image src="/images/hero-bg-soccer.jpg" alt="" fill priority className="object-cover object-[68%_center] grayscale contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/65 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-end gap-10 px-5 pb-10 pt-16 sm:min-h-[700px] sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-center lg:gap-16 lg:px-12">
        <div>
          <motion.div {...reveal(0.05)} className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.42em] text-red-400 sm:text-xs">
            <span className="h-px w-10 bg-red-500" /> Mulikandi / Est. 2020
          </motion.div>
          <h1 className="font-display font-black uppercase leading-[0.8] tracking-[-0.04em]">
            <motion.span {...reveal(0.12)} className="block text-[clamp(4rem,14vw,10rem)] text-white">Goal</motion.span>
            <motion.span {...reveal(0.2)} className="-mt-1 block text-[clamp(4.4rem,16vw,11.5rem)] text-red-600 [text-shadow:0_0_35px_rgba(196,30,58,0.25)]">United</motion.span>
          </h1>
          <motion.p {...reveal(0.32)} className="mt-7 max-w-md border-l-2 border-red-600 pl-4 text-sm leading-7 text-white/65 sm:text-base">
            Pride of Mulikandi. Power of the Titans. We are more than a club — we are a legacy in the making.
          </motion.p>
          <motion.div {...reveal(0.44)} className="mt-8 flex flex-wrap gap-3">
            <TransitionLink href="/team-squad" className="neo-btn-primary neo-btn inline-flex items-center px-6 py-3 text-[11px] font-bold tracking-[0.2em] no-underline">MEET THE TEAM</TransitionLink>
            <TransitionLink href="/fixtures-results" className="neo-btn inline-flex items-center border-white/20 bg-white/5 px-6 py-3 text-[11px] font-bold tracking-[0.2em] no-underline">MATCH CENTRE</TransitionLink>
          </motion.div>
        </div>

        <motion.div {...reveal(0.38)} className="relative ml-auto w-full max-w-sm border border-white/10 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/45"><span>Next fixture</span><span className="text-red-400">Home</span></div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
            <div><div className="mx-auto mb-2 grid size-14 place-items-center rounded-full border border-red-500/50 bg-red-950/40 text-xl font-black">TF</div><p className="text-xs font-bold uppercase tracking-widest">Titan Force</p></div>
            <div><p className="text-2xl font-black italic text-red-500">VS</p><p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">Coming soon</p></div>
            <div><div className="mx-auto mb-2 grid size-14 place-items-center rounded-full border border-white/15 bg-white/5 text-xl font-black">FC</div><p className="text-xs font-bold uppercase tracking-widest">Rivals</p></div>
          </div>
          <div className="mt-6 grid grid-cols-3 border-t border-white/10 pt-4 text-center"><div><p className="text-xl font-black">12</p><p className="text-[9px] uppercase tracking-widest text-white/40">Players</p></div><div><p className="text-xl font-black text-red-500">04</p><p className="text-[9px] uppercase tracking-widest text-white/40">Wins</p></div><div><p className="text-xl font-black">01</p><p className="text-[9px] uppercase tracking-widest text-white/40">Season</p></div></div>
        </motion.div>
      </div>
      <div className="relative border-t border-red-950/60 bg-black/25"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 text-[9px] font-bold uppercase tracking-[0.32em] text-white/35 sm:px-12"><span>Rise like Titans</span><span>01 / 04</span><span className="hidden sm:block">More than a club</span></div></div>
    </section>
  )
}

export const Hero = memo(HeroComponent)
