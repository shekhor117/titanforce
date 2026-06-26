"use client"

import { useEffect, useState } from "react"
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
        console.error('[v0] Error processing matches:', err)
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
        console.error('[v0] Error processing players:', err)
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
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-black/40 to-black/60">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 uppercase tracking-wider">
          Premium Match Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Next Match - Full Stats Link */}
          <Link href="/fixtures-results" className="no-underline">
            <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8 hover:border-red-500/40 transition-all cursor-pointer h-full">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Next Match</h3>
              
              {nextMatch ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2">{nextMatch.date} • {nextMatch.time}</p>
                    <p className="text-3xl font-bold text-white mb-1">{nextMatch.home} vs {nextMatch.away}</p>
                    <p className="text-xs text-slate-500">{nextMatch.venue}</p>
                  </div>

                  <div className="bg-slate-900/40 rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Prediction</p>
                    <p className="text-lg font-bold text-red-500">TBA</p>
                  </div>

                  <button className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-xs uppercase tracking-widest rounded transition-colors">
                    View Full Stats & Prediction
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">No upcoming matches</p>
                </div>
              )}
            </div>
          </Link>

          {/* Last Match - Stats & Facts */}
          <Link href="/fixtures-results" className="no-underline">
            <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8 hover:border-red-500/40 transition-all cursor-pointer flex flex-col h-full">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Last Match</h3>
              
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
                      <p className="text-3xl font-bold text-white">{lastMatch.home_score} - {lastMatch.away_score}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 ${getTeamBadgeColor(lastMatch.away)} rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{getTeamInitials(lastMatch.away)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="bg-slate-900/40 rounded-lg p-3 mb-4 text-center text-xs">
                    <p className="text-slate-400">{lastMatch.date}</p>
                    <p className="text-slate-500 text-[10px] mt-1">{lastMatch.venue}</p>
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

                  <button className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-xs uppercase tracking-widest rounded transition-colors mt-auto">
                    View Stats & Lineup
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">No completed matches</p>
                </div>
              )}
            </div>
          </Link>

          {/* Top Players - with link */}
          <Link href="/team-squad" className="no-underline">
            <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8 hover:border-red-500/40 transition-all cursor-pointer h-full">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Top Players</h3>
              
              <div className="space-y-4">
                {topPlayers.length > 0 ? (
                  topPlayers.map((player, idx) => (
                    <div key={player?.id || idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
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

              <button className="w-full mt-6 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-xs uppercase tracking-widest rounded transition-colors">
                View All Players
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
