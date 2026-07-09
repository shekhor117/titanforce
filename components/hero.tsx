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
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-soccer.jpg"
          alt="Titan Force Mulikandi players celebrating"
          fill
          priority
          className="object-cover object-[70%_top] sm:object-top opacity-40 sm:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/80 to-background/50 sm:to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-32 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 min-h-[600px] sm:min-h-[720px]">
        <div className="flex flex-col justify-center">
          <motion.div 
            className="inline-flex items-center gap-3 text-accent text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-6 sm:mb-8 w-fit backdrop-blur-sm bg-accent/10 px-3 sm:px-4 py-2 rounded-full border border-accent/20"
            initial={{ opacity: skipAnimation ? 1 : 0, x: skipAnimation ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="h-1 w-3 sm:w-4 bg-accent rounded-full" /> RISE LIKE TITANS
          </motion.div>
          
          <h1 className="font-display font-bold leading-[0.9] mb-2">
            {skipAnimation ? (
              <>
                <div className="block text-foreground text-[clamp(2.5rem,12vw,9rem)] tracking-[0.08em] font-black">
                  TITAN FORCE
                </div>
                <div className="block bg-gradient-to-r from-accent via-red-500 to-accent bg-clip-text text-transparent text-[clamp(2.75rem,13vw,10rem)] tracking-[0.08em] font-black">
                  MULIKANDI
                </div>
              </>
            ) : (
              <>
                <TextReveal 
                  variant="characters"
                  duration={0.02}
                  staggerChildren={0.008}
                  delay={0.15}
                  className="block text-foreground text-[clamp(2.5rem,12vw,9rem)] tracking-[0.08em] font-black"
                >
                  TITAN FORCE
                </TextReveal>
                <TextReveal 
                  variant="characters"
                  duration={0.02}
                  staggerChildren={0.008}
                  delay={0.35}
                  className="block bg-gradient-to-r from-accent via-red-500 to-accent bg-clip-text text-transparent text-[clamp(2.75rem,13vw,10rem)] tracking-[0.08em] font-black"
                >
                  MULIKANDI
                </TextReveal>
              </>
            )}
          </h1>
          
          <motion.p 
            className="mt-6 sm:mt-8 text-muted-foreground max-w-lg text-base sm:text-lg leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="text-foreground font-semibold">Pride of Mulikandi.</span> Power of the Titans. We are more than a club. We are a legacy in the making.
          </motion.p>
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <TransitionLink href="/team-squad" className="no-underline">
              <motion.button 
                className="bg-gradient-to-r from-accent to-red-500 hover:from-accent/90 hover:to-red-600 text-white px-7 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.15em] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-accent/30"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
              >
                MEET OUR SQUAD
              </motion.button>
            </TransitionLink>
            <TransitionLink href="/fixtures-results" className="no-underline">
              <motion.button 
                className="border-2 border-accent hover:border-red-500 text-foreground hover:text-white bg-transparent hover:bg-accent/10 px-6 sm:px-7 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.15em] rounded-lg transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
              >
                FIXTURES & RESULTS
              </motion.button>
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export const Hero = memo(HeroComponent)
