'use client'

import { motion } from 'framer-motion'
import { useMatches } from '@/lib/use-data-store'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollAnimatedElement } from './scroll-animated-element'

export function HomeMatchResults() {
  const { matches } = useMatches()

  // Get recent completed matches
  const recentMatches = Array.isArray(matches)
    ? matches.filter(m => m.status === 'completed').slice(0, 4)
    : []

  if (recentMatches.length === 0) {
    return null
  }

  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimatedElement variant="fadeInUp">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full" />
              <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-wider">
                Match Results
              </h2>
            </div>
            <Link
              href="/fixtures-results"
              className="text-accent hover:text-red-500 text-sm font-bold flex items-center gap-2 transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollAnimatedElement>

        {/* Results Grid - 2x2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {recentMatches.map((match, index) => (
            <ScrollAnimatedElement
              key={match.id}
              variant={index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}
              delay={index * 0.1}
            >
              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                {/* Gradient border on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-card/50 backdrop-blur-sm border border-accent/10 group-hover:border-accent/30 rounded-xl p-6 transition-all duration-300">
                  {/* Top Section - Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground font-bold tracking-widest mb-2">HOME</p>
                      <p className="text-lg font-black text-foreground">{match.home_team || 'TF'}</p>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-3xl font-black text-accent">
                        {match.home_score} : {match.away_score}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-bold">FINAL</p>
                    </div>

                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground font-bold tracking-widest mb-2">AWAY</p>
                      <p className="text-lg font-black text-foreground">{match.away_team || 'OPP'}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent mb-6" />

                  {/* Bottom Section - Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{match.competition || 'League'}</span>
                      <span className="text-accent font-bold">{match.date}</span>
                    </div>

                    {match.venue && (
                      <div className="text-xs text-muted-foreground">
                        📍 {match.venue}
                      </div>
                    )}

                    {/* Result Badge */}
                    <motion.div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold tracking-wider ${
                        match.home_score > match.away_score
                          ? 'bg-accent/20 text-accent'
                          : match.home_score < match.away_score
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-current" />
                      {match.home_score > match.away_score
                        ? 'VICTORY'
                        : match.home_score < match.away_score
                        ? 'DEFEAT'
                        : 'DRAW'}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </ScrollAnimatedElement>
          ))}
        </div>
      </div>
    </section>
  )
}
