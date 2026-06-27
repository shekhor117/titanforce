"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useMatches } from "@/lib/use-data-store"
import { usePlayers } from "@/lib/use-data-store"
import Link from "next/link"
import type { Match } from "@/lib/data-service"

export function PremiumMatchStats() {
  const { matches = [] } = useMatches()
  const { players = [] } = usePlayers()
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [lastMatch, setLastMatch] = useState<Match | null>(null)
  const [topPlayers, setTopPlayers] = useState([])

  useEffect(() => {
    if (Array.isArray(matches) && matches.length > 0) {
      try {
        // Get next match (upcoming)
        const next = matches.find(m => m?.status === 'upcoming')
        setNextMatch(next || null)

        // Get last completed match
        const last = matches.find(m => m?.status === 'completed')
        setLastMatch(last || null)
      } catch (err) {
      }
    }
  }, [matches])

  useEffect(() => {
    if (Array.isArray(players) && players.length > 0) {
      try {
        // Get top players by rating/performance
        const sorted = [...players]
          .filter(p => p?.status === 'active' || p?.status === 'Active')
          .sort((a, b) => (b?.average_rating || 0) - (a?.average_rating || 0))
          .slice(0, 4)
        setTopPlayers(sorted)
      } catch (err) {
      }
    }
  }, [players])

  const getTeamBadgeColor = (team: string | undefined) => {
    if (!team) return 'bg-blue-600'
    if (team.includes('TFM') || team.includes('Titan')) return 'bg-red-600'
    return 'bg-blue-600'
  }

  const getTeamInitials = (team: string | undefined) => {
    if (!team) return 'TBD'
    return team.split(' ').map(w => w[0]).join('').slice(0, 3)
  }

  const getMatchResult = (match: Match | null) => {
    if (!match) return 'Draw'
    if (match.home_score > match.away_score) {
      return match.home.includes('TFM') || match.home.includes('Titan') ? 'Win' : 'Loss'
    } else if (match.away_score > match.home_score) {
      return match.away.includes('TFM') || match.away.includes('Titan') ? 'Win' : 'Loss'
    }
    return 'Draw'
  }

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-foreground mb-12 uppercase tracking-wider"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Premium Match Stats
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Next Match - Full Stats Link */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Link href="/fixtures-results" className="no-underline">
            <div className="neo-card p-8 h-full">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 font-bold">Next Match</h3>
              
              {nextMatch ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{nextMatch.date} • {nextMatch.time}</p>
                    <p className="text-3xl font-bold text-foreground mb-1">{nextMatch.home} vs {nextMatch.away}</p>
                    <p className="text-xs text-muted-foreground/70">{nextMatch.venue}</p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Prediction</p>
                    <p className="text-lg font-bold text-red-500">TBA</p>
                  </div>

                  <button className="neo-btn neo-btn-primary w-full">
                    View Full Stats & Prediction
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No upcoming matches</p>
                </div>
              )}
            </div>
          </Link>
          </motion.div>

          {/* Last Match - Stats & Facts */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Link href="/fixtures-results" className="no-underline">
            <div className="neo-card p-8 flex flex-col h-full">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 font-bold">Last Match</h3>
              
              {lastMatch ? (
                <div className="flex-1 flex flex-col">
                  {/* Match Score */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 ${getTeamBadgeColor(lastMatch.home)} rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{getTeamInitials(lastMatch.home)}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">{lastMatch.home_score} - {lastMatch.away_score}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 ${getTeamBadgeColor(lastMatch.away)} rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{getTeamInitials(lastMatch.away)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="bg-muted rounded-lg p-3 mb-4 text-center text-xs">
                    <p className="text-muted-foreground">{lastMatch.date}</p>
                    <p className="text-muted-foreground/70 text-[10px] mt-1">{lastMatch.venue}</p>
                  </div>

                  {/* Result Badge */}
                  <div className="text-center mb-4">
                    {(() => {
                      const result = getMatchResult(lastMatch)
                      const isWin = result === 'Win'
                      const isLoss = result === 'Loss'
                      return (
                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          isWin ? 'bg-green-500/20 text-green-400' :
                          isLoss ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result}
                        </span>
                      )
                    })()}
                  </div>

                  <button className="neo-btn neo-btn-primary w-full mt-auto">
                    View Stats & Lineup
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No completed matches</p>
                </div>
              )}
            </div>
            </Link>
          </motion.div>

          {/* Top Players - with link */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Link href="/team-squad" className="no-underline">
            <div className="neo-card p-8 h-full">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 font-bold">Top Players</h3>
              
              <div className="space-y-4">
                {topPlayers.length > 0 ? (
                  topPlayers.map((player, idx) => (
                    <div key={player?.id || idx} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">{player?.num || ''}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{player?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400 truncate">{player?.position || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-red-500 font-bold text-sm">{player?.average_rating ? player.average_rating.toFixed(1) : '—'}</p>
                        <p className="text-xs text-slate-400">Rating</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No players</p>
                  </div>
                )}
              </div>

              <button className="neo-btn neo-btn-primary w-full mt-6">
                View All Players
              </button>
            </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
