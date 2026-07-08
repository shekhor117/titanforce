'use client'

import { memo } from "react"
import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"

interface HeroNewDesignProps {
  skipAnimation?: boolean
}

function HeroNewDesignComponent({ skipAnimation = false }: HeroNewDesignProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-bg-soccer.jpg"
          alt="Titan Force hero background"
          fill
          priority
          className="object-cover w-full h-full"
        />
        {/* Dark Gradient Overlay with Red/Blue Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-red-900/20 to-blue-900/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <EntranceReveal delay={0.1} duration={0.6} variant="fadeInLeft">
            <div className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-red-900/30 to-blue-900/30 border border-red-500/30 backdrop-blur-sm w-fit"
                initial={{ opacity: skipAnimation ? 1 : 0, x: skipAnimation ? 0 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-red-400">
                  Rise Like Titans
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: skipAnimation ? 1 : 0, y: skipAnimation ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h1 className="font-display font-black leading-[0.9] text-white">
                  <span className="block text-5xl sm:text-7xl lg:text-8xl tracking-wider bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                    TITAN
                  </span>
                  <span className="block text-5xl sm:text-7xl lg:text-8xl tracking-wider bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    FORCE
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed"
                initial={{ opacity: skipAnimation ? 1 : 0, y: skipAnimation ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Pride of Mulikandi. Power of the Titans. We are more than a club—we&apos;re a legacy in the making. Join our journey to greatness.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4"
                initial={{ opacity: skipAnimation ? 1 : 0, y: skipAnimation ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TransitionLink href="/team-squad" className="no-underline">
                  <motion.button
                    className="neo-btn-primary px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Squad
                  </motion.button>
                </TransitionLink>
                <TransitionLink href="/fixtures-results" className="no-underline">
                  <motion.button
                    className="neo-btn px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Matches
                  </motion.button>
                </TransitionLink>
              </motion.div>
            </div>
          </EntranceReveal>

          {/* Right Decorative Element */}
          <EntranceReveal delay={0.2} duration={0.6} variant="fadeInRight" className="hidden lg:block">
            <motion.div
              className="relative w-full h-96 lg:h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Gradient Orb */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-full blur-2xl" />
            </motion.div>
          </EntranceReveal>
        </div>
      </div>
    </section>
  )
}

export const HeroNewDesign = memo(HeroNewDesignComponent)
