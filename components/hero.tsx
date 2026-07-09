"use client"

import { memo } from "react"
import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"
import { TextReveal } from "@/components/text-reveal"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface HeroProps {
  skipAnimation?: boolean
}

function HeroComponent({ skipAnimation = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-card/10 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-soccer.jpg"
          alt="Titan Force Mulikandi players celebrating"
          fill
          priority
          className="object-cover object-[70%_top] sm:object-top opacity-30 sm:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/85 to-background/50 sm:to-background/20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-32 grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-[600px] sm:min-h-[750px]">
        <div className="flex flex-col justify-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 text-accent text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-6 sm:mb-8 w-fit"
            initial={{ opacity: skipAnimation ? 1 : 0, x: skipAnimation ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="h-1 w-4 sm:w-5 bg-accent rounded-full" />
            RISE LIKE TITANS
          </motion.div>
          
          {/* Main Title */}
          <h1 className="font-display font-black leading-[0.9] mb-4 sm:mb-6">
            {skipAnimation ? (
              <>
                <div className="block text-foreground text-[clamp(3rem,14vw,9rem)] tracking-tighter">
                  GOAL
                </div>
                <div className="block bg-gradient-to-r from-accent via-red-500 to-accent bg-clip-text text-transparent text-[clamp(3.5rem,16vw,10.5rem)] tracking-tighter font-black">
                  UNITED
                </div>
              </>
            ) : (
              <>
                <TextReveal 
                  variant="characters"
                  duration={0.02}
                  staggerChildren={0.007}
                  delay={0.1}
                  className="block text-foreground text-[clamp(3rem,14vw,9rem)] tracking-tighter font-black"
                >
                  GOAL
                </TextReveal>
                <TextReveal 
                  variant="characters"
                  duration={0.02}
                  staggerChildren={0.007}
                  delay={0.3}
                  className="block bg-gradient-to-r from-accent via-red-500 to-accent bg-clip-text text-transparent text-[clamp(3.5rem,16vw,10.5rem)] tracking-tighter font-black"
                >
                  UNITED
                </TextReveal>
              </>
            )}
          </h1>
          
          {/* Description */}
          <motion.p 
            className="text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="text-foreground font-semibold">Where passion meets excellence.</span> Experience the power of united football with cutting-edge performance and unwavering determination.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <TransitionLink href="/team-squad" className="no-underline">
              <motion.button 
                className="bg-gradient-to-r from-accent to-red-500 hover:from-accent/90 hover:to-red-600 text-white px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-accent/30 flex items-center gap-2"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                MEET OUR SQUAD
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </TransitionLink>
            <TransitionLink href="/fixtures-results" className="no-underline">
              <motion.button 
                className="border-2 border-accent text-accent hover:text-white hover:bg-accent/10 px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wider rounded-lg transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
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
