"use client"

import { memo } from "react"
import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"
import { TextReveal } from "@/components/text-reveal"
import { motion } from "framer-motion"

interface HeroProps {
  skipAnimation?: boolean
}

function HeroComponent({ skipAnimation = false }: HeroProps) {
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
          <motion.div 
            className="inline-flex items-center gap-2 text-red-600 text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 sm:mb-6 w-fit"
            initial={{ opacity: skipAnimation ? 1 : 0, x: skipAnimation ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="h-px w-6 sm:w-8 bg-red-600" /> RISE LIKE TITANS
          </motion.div>
          
          <h1 className="font-display font-bold leading-[0.85]">
            {skipAnimation ? (
              <>
                <div className="block text-foreground text-[clamp(2.25rem,11vw,8rem)] tracking-[0.1em]">
                  TITAN FORCE
                </div>
                <div className="block text-red-600 text-[clamp(2.75rem,13vw,10rem)] tracking-[0.1em]">
                  MULIKANDI
                </div>
              </>
            ) : (
              <>
                <TextReveal 
                  variant="characters"
                  duration={0.03}
                  staggerChildren={0.01}
                  delay={0.2}
                  className="block text-foreground text-[clamp(2.25rem,11vw,8rem)] tracking-[0.1em]"
                >
                  TITAN FORCE
                </TextReveal>
                <TextReveal 
                  variant="characters"
                  duration={0.03}
                  staggerChildren={0.01}
                  delay={0.4}
                  className="block text-red-600 text-[clamp(2.75rem,13vw,10rem)] tracking-[0.1em]"
                >
                  MULIKANDI
                </TextReveal>
              </>
            )}
          </h1>
          
          <motion.p 
            className="mt-5 sm:mt-6 text-muted-foreground max-w-md text-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            viewport={{ once: true }}
          >
            Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
          </motion.p>
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <TransitionLink href="/team-squad" className="no-underline">
              <motion.button 
                className="neo-btn-primary neo-btn group inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                OUR PLAYER
              </motion.button>
            </TransitionLink>
            <TransitionLink href="/fixtures-results" className="no-underline">
              <motion.button 
                className="neo-btn inline-flex items-center gap-3 px-4 sm:px-5 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                MATCHES
              </motion.button>
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export const Hero = memo(HeroComponent)
