'use client'

import { memo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"

interface StatCardProps {
  number: string | number
  label: string
  delay: number
}

const StatCard = memo(function StatCardComponent({ number, label, delay }: StatCardProps) {
  const [displayNumber, setDisplayNumber] = useState(0)

  useEffect(() => {
    const numValue = typeof number === 'string' ? parseInt(number) : number
    const increment = numValue / 30
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numValue) {
        setDisplayNumber(numValue)
        clearInterval(timer)
      } else {
        setDisplayNumber(Math.floor(current))
      }
    }, 30)

    return () => clearInterval(timer)
  }, [number])

  return (
    <motion.div
      className="relative group p-6 sm:p-8 rounded-lg bg-gradient-to-br from-card to-card/50 border border-red-500/20 hover:border-red-500/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, borderColor: "rgba(220, 38, 38, 0.5)" }}
    >
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-600/10 to-blue-600/10" />
      
      <div className="relative z-10 text-center">
        <motion.div
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-red-500 to-red-400 bg-clip-text mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          viewport={{ once: true }}
        >
          {displayNumber}+
        </motion.div>
        <p className="text-xs sm:text-sm uppercase tracking-widest font-bold text-gray-400 group-hover:text-red-400 transition-colors">
          {label}
        </p>
      </div>
    </motion.div>
  )
})

const stats = [
  { number: 2025, label: "Founded Year" },
  { number: 50, label: "Active Players" },
  { number: 150, label: "Matches Played" },
  { number: 25, label: "Trophies Won" }
]

function ClubStatsSectionNewComponent() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-black/20 to-blue-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-blue-400">By The Numbers</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Our Stats
            </h2>
          </div>
        </EntranceReveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export const ClubStatsSection = memo(ClubStatsSectionNewComponent)
