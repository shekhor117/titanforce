"use client"

import { useState, useMemo } from "react"
import { X, TrendingUp, Users, Activity, Clock, MapPin, Shirt } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { MatchHero } from "@/components/match/match-hero"
import { MatchStatsVisual } from "@/components/match/match-stats-visual"
import { ScrollAnimatedElement } from "@/components/scroll-animated-element"
import type { Match } from "@/lib/data-service"

interface MatchDetailsProps {
  match: Match
  onClose?: () => void
  isModal?: boolean
}

interface PlayerRating {
  name: string
  number: number
  position: string
  rating: number
  team: 'home' | 'away'
}

// Mock function to calculate player ratings based on performance
const generatePlayerRatings = (match: Match): PlayerRating[] => {
  const ratings: PlayerRating[] = []
  
  const homeGoalScorers = new Set(match.homeGoals?.map(g => g.player) || [])
  const awayGoalScorers = new Set(match.awayGoals?.map(g => g.player) || [])

  match.home_lineup?.forEach((player) => {
    const isGoalScorer = homeGoalScorers.has(player.player || player.name || '')
    const baseRating = 6.5 + Math.random() * 2
    const finalRating = isGoalScorer ? Math.min(9.5, baseRating + 1.5) : baseRating
    
    ratings.push({
      name: player.player || player.name || 'Unknown',
      number: player.number,
      position: player.position || 'N/A',
      rating: Math.round(finalRating * 10) / 10,
      team: 'home'
    })
  })

  match.away_lineup?.forEach((player) => {
    const isGoalScorer = awayGoalScorers.has(player.player || player.name || '')
    const baseRating = 6.5 + Math.random() * 2
    const finalRating = isGoalScorer ? Math.min(9.5, baseRating + 1.5) : baseRating
    
    ratings.push({
      name: player.player || player.name || 'Unknown',
      number: player.number,
      position: player.position || 'N/A',
      rating: Math.round(finalRating * 10) / 10,
      team: 'away'
    })
  })

  return ratings
}

// Mock statistics generator
const generateMatchStats = (match: Match) => {
  const homeStats = {
    possession: 45 + Math.random() * 20,
    shots: Math.floor(8 + Math.random() * 12),
    shotsOnTarget: Math.floor(2 + Math.random() * 6),
    fouls: Math.floor(10 + Math.random() * 8),
    corners: Math.floor(4 + Math.random() * 8),
    passes: Math.floor(300 + Math.random() * 200),
    tackles: Math.floor(15 + Math.random() * 10),
    saves: Math.floor(2 + Math.random() * 4)
  }

  const awayStats = {
    possession: 100 - homeStats.possession,
    shots: Math.floor(8 + Math.random() * 12),
    shotsOnTarget: Math.floor(2 + Math.random() * 6),
    fouls: Math.floor(10 + Math.random() * 8),
    corners: Math.floor(4 + Math.random() * 8),
    passes: Math.floor(300 + Math.random() * 200),
    tackles: Math.floor(15 + Math.random() * 10),
    saves: Math.floor(2 + Math.random() * 4)
  }

  return { homeStats, awayStats }
}

const StatRow = ({ label, home, away }: { label: string; home: string | number; away: string | number }) => (
  <div className="flex items-center justify-between py-3 px-4 border-b border-secondary/20 last:border-b-0">
    <div className="text-sm text-foreground/70 w-1/3 text-right pr-4">{home}</div>
    <div className="text-xs uppercase tracking-wider font-semibold text-primary w-1/3 text-center">{label}</div>
    <div className="text-sm text-foreground/70 w-1/3 text-left pl-4">{away}</div>
  </div>
)

export function MatchDetails({ match, onClose, isModal = false }: MatchDetailsProps) {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [activeTab, setActiveTab] = useState<'score' | 'stats' | 'lineups' | 'ratings'>('score')
  
  const playerRatings = useMemo(() => generatePlayerRatings(match), [match])
  const { homeStats, awayStats } = useMemo(() => generateMatchStats(match), [match])

  const getGoalTimeline = () => {
    const goals = [
      ...(match.homeGoals || []).map(g => ({ ...g, team: 'home' as const })),
      ...(match.awayGoals || []).map(g => ({ ...g, team: 'away' as const }))
    ]
    return goals.sort((a, b) => (a.minute || 0) - (b.minute || 0))
  }

  const goals = getGoalTimeline()
  const homeRatings = playerRatings.filter(r => r.team === 'home').sort((a, b) => b.rating - a.rating)
  const awayRatings = playerRatings.filter(r => r.team === 'away').sort((a, b) => b.rating - a.rating)

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-emerald-400'
    if (rating >= 7) return 'text-blue-400'
    if (rating >= 6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const tabs = [
    { id: 'score' as const, label: isBn ? 'গোল' : 'Score', icon: Activity },
    { id: 'stats' as const, label: isBn ? 'পরিসংখ্যান' : 'Stats', icon: TrendingUp },
    { id: 'lineups' as const, label: isBn ? 'লাইনআপ' : 'Lineups', icon: Shirt },
    { id: 'ratings' as const, label: isBn ? 'রেটিং' : 'Ratings', icon: Users }
  ]

  const content = (
    <div className={`w-full ${isModal ? 'max-w-2xl' : 'max-w-4xl'} bg-background`}>
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Enhanced Match Hero */}
      <ScrollAnimatedElement variant="fadeInUp" duration={0.6}>
        <MatchHero match={match} />
      </ScrollAnimatedElement>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-background'
                  : 'bg-secondary/30 text-foreground/70 hover:bg-secondary/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Goal Timeline Tab */}
        {activeTab === 'score' && (
          <div className="neo-panel p-6 space-y-6">
            {match.status === 'upcoming' ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">{isBn ? 'ম্যাচ এখনও খেলা হয়নি' : 'Match not yet played'}</p>
              </div>
            ) : goals.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                  {isBn ? 'গোল ও ইভেন্টস' : 'Goal Timeline'}
                </h3>
                {goals.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20 border border-secondary/30"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 flex-shrink-0">
                      <span className="font-bold text-primary text-lg">{goal.minute}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{goal.player}</div>
                      <div className="text-xs text-foreground/60 mt-1">
                        {goal.assist && (
                          <span>
                            {isBn ? 'অ্যাসিস্ট' : 'Assist'}: {goal.assist}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                      goal.team === 'home'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {goal.team === 'home' ? match.home : match.away}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60">{isBn ? 'কোন গোল নেই' : 'No goals scored'}</p>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="neo-panel overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Home Stats */}
              <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                  {match.home} {isBn ? 'পরিসংখ্যান' : 'Stats'}
                </h3>
                <div className="space-y-3">
                  <StatRow label="Possession" home={`${Math.round(homeStats.possession)}%`} away={`${Math.round(awayStats.possession)}%`} />
                  <StatRow label="Shots" home={homeStats.shots} away={awayStats.shots} />
                  <StatRow label="On Target" home={homeStats.shotsOnTarget} away={awayStats.shotsOnTarget} />
                  <StatRow label="Fouls" home={homeStats.fouls} away={awayStats.fouls} />
                  <StatRow label="Corners" home={homeStats.corners} away={awayStats.corners} />
                  <StatRow label="Passes" home={homeStats.passes} away={awayStats.passes} />
                  <StatRow label="Tackles" home={homeStats.tackles} away={awayStats.tackles} />
                  <StatRow label="Saves" home={homeStats.saves} away={awayStats.saves} />
                </div>
              </div>

              {/* Visual comparison */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                  {isBn ? 'তুলনা' : 'Comparison'}
                </h3>
                <div className="space-y-3">
                  <MatchStatsVisual
                    label="Possession"
                    homeValue={Math.round(homeStats.possession)}
                    awayValue={Math.round(awayStats.possession)}
                    homeLabel={match.home}
                    awayLabel={match.away}
                    maxValue={100}
                    isPercentage={true}
                    animated={true}
                  />
                  <MatchStatsVisual
                    label="Shots"
                    homeValue={homeStats.shots}
                    awayValue={awayStats.shots}
                    homeLabel={match.home}
                    awayLabel={match.away}
                    maxValue={20}
                    animated={true}
                  />
                  <MatchStatsVisual
                    label="Accuracy"
                    homeValue={Math.round((homeStats.shotsOnTarget / homeStats.shots) * 100) || 0}
                    awayValue={Math.round((awayStats.shotsOnTarget / awayStats.shots) * 100) || 0}
                    homeLabel={match.home}
                    awayLabel={match.away}
                    maxValue={100}
                    isPercentage={true}
                    animated={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lineups Tab */}
        {activeTab === 'lineups' && (
          <ScrollAnimatedElement variant="fadeInUp" duration={0.5}>
            <div className="neo-panel p-6">
            {match.home_lineup || match.away_lineup ? (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Home Lineup */}
                {match.home_lineup && match.home_lineup.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                      {match.home} {isBn ? 'লাইনআপ' : 'Lineup'}
                    </h3>
                    <div className="space-y-2">
                      {match.home_lineup.map((player, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{player.number}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">
                              {player.player || player.name}
                            </div>
                            <div className="text-xs text-foreground/60 uppercase tracking-wider">
                              {player.position}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Away Lineup */}
                {match.away_lineup && match.away_lineup.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                      {match.away} {isBn ? 'লাইনআপ' : 'Lineup'}
                    </h3>
                    <div className="space-y-2">
                      {match.away_lineup.map((player, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{player.number}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">
                              {player.player || player.name}
                            </div>
                            <div className="text-xs text-foreground/60 uppercase tracking-wider">
                              {player.position}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60">{isBn ? 'লাইনআপ পাওয়া যায়নি' : 'Lineups not available'}</p>
              </div>
            )}
            </div>
          </ScrollAnimatedElement>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <ScrollAnimatedElement variant="fadeInUp" duration={0.5}>
            <div className="neo-panel p-6">
              {playerRatings.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Home Ratings */}
                  {homeRatings.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                        {match.home} {isBn ? 'রেটিং' : 'Ratings'}
                      </h3>
                      <div className="space-y-3">
                        {homeRatings.map((player, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-emerald-400">{player.number}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-foreground">
                                {player.name}
                              </div>
                              <div className="text-xs text-foreground/60 uppercase tracking-wider">
                                {player.position}
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${getRatingColor(player.rating)}`}>
                              {player.rating.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Away Ratings */}
                  {awayRatings.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                        {match.away} {isBn ? 'রেটিং' : 'Ratings'}
                      </h3>
                      <div className="space-y-3">
                        {awayRatings.map((player, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-indigo-400">{player.number}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-foreground">
                                {player.name}
                              </div>
                              <div className="text-xs text-foreground/60 uppercase tracking-wider">
                                {player.position}
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${getRatingColor(player.rating)}`}>
                              {player.rating.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/60">{isBn ? 'রেটিং উপলব্ধ নেই' : 'Ratings not available'}</p>
                </div>
              )}
            </div>
          </ScrollAnimatedElement>
        )}
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <div className="max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    )
  }

  return content
}
