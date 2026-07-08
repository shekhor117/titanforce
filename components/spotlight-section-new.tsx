'use client'

import { memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"
import { Award, Target, Heart } from "lucide-react"

function SpotlightSectionNewComponent() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/5 via-black/20 to-red-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 border border-yellow-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-yellow-400">Star Player</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Player of the Week
            </h2>
          </div>
        </EntranceReveal>

        {/* Spotlight Card */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Side */}
          <EntranceReveal delay={0.2} duration={0.6} variant="fadeInLeft">
            <motion.div
              className="relative aspect-square rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-blue-500/40 rounded-lg p-1">
                <Image
                  src="/images/hero-bg-soccer.jpg"
                  alt="Player of the Week"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Badge */}
              <motion.div
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-sm tracking-widest uppercase"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                POW
              </motion.div>
            </motion.div>
          </EntranceReveal>

          {/* Content Side */}
          <EntranceReveal delay={0.3} duration={0.6} variant="fadeInRight">
            <div className="space-y-6">
              {/* Player Info */}
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-widest font-bold text-yellow-400 mb-2">Featured Player</p>
                <h3 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
                  Carlos Rodriguez
                </h3>
                <p className="text-red-400 font-bold tracking-wider uppercase text-sm">Forward #9</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Carlos has been an absolute force this season, leading our attack with his tactical brilliance and lethal finishing. His work rate and commitment to the team make him an inspiration to his teammates.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <motion.div
                  className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-500/30 text-center"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-2xl sm:text-3xl font-black text-red-500">12</div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Goals</p>
                </motion.div>
                <motion.div
                  className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 text-center"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-2xl sm:text-3xl font-black text-blue-500">4</div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Assists</p>
                </motion.div>
                <motion.div
                  className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 text-center"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-2xl sm:text-3xl font-black text-purple-500">95%</div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Pass</p>
                </motion.div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">Top Scorer</p>
                    <p className="text-sm text-gray-400">Leading the league with consistent performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">Clinical Finisher</p>
                    <p className="text-sm text-gray-400">Converts chances with remarkable precision</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">Team Leader</p>
                    <p className="text-sm text-gray-400">Inspires teammates with dedication and work ethic</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                className="neo-btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Profile
              </motion.button>
            </div>
          </EntranceReveal>
        </div>
      </div>
    </section>
  )
}

export const SpotlightSection = memo(SpotlightSectionNewComponent)
