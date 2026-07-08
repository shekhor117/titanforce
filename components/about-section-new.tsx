'use client'

import { memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"
import { Heart, Zap, Target } from "lucide-react"

function AboutSectionNewComponent() {
  const highlights = [
    {
      icon: Heart,
      title: "Legacy",
      description: "Building a tradition of excellence"
    },
    {
      icon: Zap,
      title: "Power",
      description: "Unleashing potential on and off field"
    },
    {
      icon: Target,
      title: "Purpose",
      description: "Committed to community development"
    }
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-red-900/5 to-blue-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-red-400">What is Titan Force</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Our Mission
            </h2>
          </div>
        </EntranceReveal>

        {/* 2-Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <EntranceReveal delay={0.2} duration={0.6} variant="fadeInLeft">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Titan Force Mulikandi is more than just a football club. We are a family built on passion, discipline, and hard work. Our mission is to develop players, inspire the community, and compete at the highest level.
              </p>

              <div className="space-y-4">
                {highlights.map((highlight, index) => {
                  const Icon = highlight.icon
                  return (
                    <motion.div
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-card/50 border border-red-500/20 hover:border-red-500/50 hover:bg-red-900/10 transition-all duration-300"
                      whileHover={{ x: 8 }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-1">{highlight.title}</h4>
                        <p className="text-sm text-gray-400">{highlight.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.button
                className="neo-btn-primary px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg w-full sm:w-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </EntranceReveal>

          {/* Right: Image */}
          <EntranceReveal delay={0.3} duration={0.6} variant="fadeInRight">
            <motion.div
              className="relative aspect-square rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Image with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-blue-500/30 rounded-lg p-1">
                <Image
                  src="/images/hero-bg-soccer.jpg"
                  alt="Titan Force players"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </motion.div>
          </EntranceReveal>
        </div>
      </div>
    </section>
  )
}

export const AboutSectionNew = memo(AboutSectionNewComponent)
