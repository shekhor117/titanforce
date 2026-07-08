'use client'

import { memo } from "react"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"
import { Calendar } from "lucide-react"

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  status: 'completed' | 'upcoming'
  delay: number
}

const MatchCard = memo(function MatchCardComponent({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  status,
  delay
}: MatchCardProps) {
  return (
    <motion.div
      className="relative group p-6 sm:p-8 rounded-lg bg-gradient-to-br from-card to-card/50 border border-red-500/20 hover:border-red-500/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-600/10 to-blue-600/10" />
      
      <div className="relative z-10">
        {/* Date Badge */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
          <span className={`ml-auto px-2 py-1 rounded text-xs font-bold tracking-wider ${
            status === 'completed' 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-blue-900/30 text-blue-400'
          }`}>
            {status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
          </span>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 text-center">
            <p className="text-lg sm:text-xl font-bold text-white mb-1">{homeTeam}</p>
            <p className="text-2xl sm:text-3xl font-black text-red-500">{homeScore}</p>
          </div>
          
          <div className="text-gray-500 text-sm font-bold">VS</div>
          
          <div className="flex-1 text-center">
            <p className="text-lg sm:text-xl font-bold text-white mb-1">{awayTeam}</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-500">{awayScore}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-4" />

        {/* View Match Button */}
        <motion.button
          className="w-full py-2 px-4 text-xs font-bold tracking-widest uppercase bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded text-red-400 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Match
        </motion.button>
      </div>
    </motion.div>
  )
})

const matchData = [
  {
    homeTeam: 'Titan Force',
    awayTeam: 'Valley United',
    homeScore: 3,
    awayScore: 1,
    date: 'Jan 15, 2025',
    status: 'completed' as const
  },
  {
    homeTeam: 'Mountain FC',
    awayTeam: 'Titan Force',
    homeScore: 2,
    awayScore: 2,
    date: 'Jan 22, 2025',
    status: 'completed' as const
  },
  {
    homeTeam: 'Titan Force',
    awayTeam: 'River Sports',
    homeScore: 0,
    awayScore: 0,
    date: 'Feb 5, 2025',
    status: 'upcoming' as const
  },
  {
    homeTeam: 'City Strikers',
    awayTeam: 'Titan Force',
    homeScore: 0,
    awayScore: 0,
    date: 'Feb 12, 2025',
    status: 'upcoming' as const
  }
]

function MatchResultsGridNewComponent() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-black/20 to-red-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-red-400">Match Results</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Recent Matches
            </h2>
          </div>
        </EntranceReveal>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {matchData.map((match, index) => (
            <MatchCard
              key={index}
              {...match}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>

        {/* View All Link */}
        <EntranceReveal delay={0.6} duration={0.6} variant="fadeInUp">
          <div className="text-center mt-8 sm:mt-12">
            <motion.button
              className="neo-btn px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Matches
            </motion.button>
          </div>
        </EntranceReveal>
      </div>
    </section>
  )
}

export const MatchResultsGrid = memo(MatchResultsGridNewComponent)
