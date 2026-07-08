'use client'

import { memo } from "react"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"
import { Trophy, Users, Zap } from "lucide-react"

interface ChallengeCardProps {
  icon: React.ElementType
  title: string
  description: string
  details: string[]
  cta: string
  delay: number
  accentColor: 'red' | 'blue' | 'purple'
}

const ChallengeCard = memo(function ChallengeCardComponent({
  icon: Icon,
  title,
  description,
  details,
  cta,
  delay,
  accentColor
}: ChallengeCardProps) {
  const accentColorClasses = {
    red: 'from-red-600/20 to-red-600/5 border-red-500/30 hover:border-red-500/50 text-red-400',
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30 hover:border-blue-500/50 text-blue-400',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30 hover:border-purple-500/50 text-purple-400'
  }

  return (
    <motion.div
      className={`relative group p-6 sm:p-8 rounded-lg bg-gradient-to-br ${accentColorClasses[accentColor]} border transition-all overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${
          accentColor === 'red' ? 'from-red-600/30 to-red-600/10' :
          accentColor === 'blue' ? 'from-blue-600/30 to-blue-600/10' :
          'from-purple-600/30 to-purple-600/10'
        } flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
            accentColor === 'red' ? 'text-red-400' :
            accentColor === 'blue' ? 'text-blue-400' :
            'text-purple-400'
          }`} />
        </div>

        {/* Title and Description */}
        <h3 className="font-bold text-white text-lg sm:text-xl mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4">{description}</p>

        {/* Details */}
        <div className="space-y-2 mb-6">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-400">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                accentColor === 'red' ? 'bg-red-500' :
                accentColor === 'blue' ? 'bg-blue-500' :
                'bg-purple-500'
              }`} />
              <span>{detail}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className={`w-full py-2 px-4 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all ${
            accentColor === 'red' ? 'bg-red-900/20 hover:bg-red-900/40 border-red-500/30 text-red-400' :
            accentColor === 'blue' ? 'bg-blue-900/20 hover:bg-blue-900/40 border-blue-500/30 text-blue-400' :
            'bg-purple-900/20 hover:bg-purple-900/40 border-purple-500/30 text-purple-400'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  )
})

const challengesData = [
  {
    icon: Trophy,
    title: 'Youth Development',
    description: 'Nurturing young talents to reach their full potential',
    details: [
      'U-17 Academy Training',
      'Skill Development Programs',
      'Competitive League Participation'
    ],
    cta: 'Join Academy',
    accentColor: 'red' as const
  },
  {
    icon: Users,
    title: 'Community Outreach',
    description: 'Connecting with our supporters and local community',
    details: [
      'Football Camps',
      'Grassroots Programs',
      'Community Events'
    ],
    cta: 'Get Involved',
    accentColor: 'blue' as const
  },
  {
    icon: Zap,
    title: 'Championship Quest',
    description: 'Our mission to win major tournaments and titles',
    details: [
      'League Championship Focus',
      'Cup Competition Drive',
      'International Recognition'
    ],
    cta: 'Support Team',
    accentColor: 'purple' as const
  }
]

function ChallengesSectionNewComponent() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-black/20 to-purple-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 border border-yellow-500/30 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-yellow-400">Initiatives</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4">
              Our Challenges
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
              Discover the various initiatives and programs we&apos;re undertaking to excel both on and off the field
            </p>
          </div>
        </EntranceReveal>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {challengesData.map((challenge, index) => (
            <ChallengeCard
              key={index}
              {...challenge}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export const ChallengesSection = memo(ChallengesSectionNewComponent)
