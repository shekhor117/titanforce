'use client'

import { memo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"

interface PlayerCardProps {
  name: string
  position: string
  number: number
  image: string
  stats: {
    goals?: number
    assists?: number
  }
  delay: number
}

const PlayerCard = memo(function PlayerCardComponent({
  name,
  position,
  number,
  image,
  stats,
  delay
}: PlayerCardProps) {
  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Card Background */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-card to-card/50 border border-red-500/20 group-hover:border-red-500/50 transition-all">
        {/* Player Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Jersey Number Badge */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-lg sm:text-2xl border-2 border-red-400"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.1 }}
          viewport={{ once: true }}
        >
          {number}
        </motion.div>

        {/* Player Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h3 className="font-bold text-white text-lg sm:text-xl mb-1">{name}</h3>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-red-400 font-bold mb-3">
            {position}
          </p>

          {/* Stats */}
          <div className="flex gap-3 text-xs">
            {stats.goals !== undefined && (
              <div className="bg-blue-900/40 px-3 py-1 rounded backdrop-blur text-blue-300">
                {stats.goals} Goals
              </div>
            )}
            {stats.assists !== undefined && (
              <div className="bg-purple-900/40 px-3 py-1 rounded backdrop-blur text-purple-300">
                {stats.assists} Assists
              </div>
            )}
          </div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-600/20 to-blue-600/20" />
      </div>
    </motion.div>
  )
})

const playersData = [
  { name: 'Alex Johnson', position: 'Goalkeeper', number: 1, image: '/images/hero-bg-soccer.jpg', stats: { goals: 0, assists: 0 } },
  { name: 'Marcus Silva', position: 'Defender', number: 4, image: '/images/hero-bg-soccer.jpg', stats: { goals: 2, assists: 1 } },
  { name: 'David Chen', position: 'Midfielder', number: 8, image: '/images/hero-bg-soccer.jpg', stats: { goals: 5, assists: 3 } },
  { name: 'Carlos Rodriguez', position: 'Forward', number: 9, image: '/images/hero-bg-soccer.jpg', stats: { goals: 12, assists: 4 } },
  { name: 'James Wilson', position: 'Defender', number: 3, image: '/images/hero-bg-soccer.jpg', stats: { goals: 1, assists: 0 } },
  { name: 'Ethan Moore', position: 'Midfielder', number: 7, image: '/images/hero-bg-soccer.jpg', stats: { goals: 3, assists: 6 } },
]

const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward']

function TeamRosterGridNewComponent() {
  const [selectedPosition, setSelectedPosition] = useState('All')

  const filteredPlayers = selectedPosition === 'All' 
    ? playersData 
    : playersData.filter(p => p.position === selectedPosition)

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-black/20 to-red-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/20 border border-purple-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-purple-400">Our Talent</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Squad Roster
            </h2>
          </div>
        </EntranceReveal>

        {/* Position Filter */}
        <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
            {positions.map((pos) => (
              <motion.button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                  selectedPosition === pos
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-card border border-red-500/20 text-gray-300 hover:border-red-500/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pos}
              </motion.button>
            ))}
          </div>
        </EntranceReveal>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {filteredPlayers.map((player, index) => (
              <PlayerCard
                key={`${player.name}-${selectedPosition}`}
                {...player}
                delay={0.2 + index * 0.1}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export const TeamRosterGrid = memo(TeamRosterGridNewComponent)
