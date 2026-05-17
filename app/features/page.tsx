"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LineupBuilder } from "@/components/lineup-builder"
import { TacticalBoard } from "@/components/tactical-board"
import { MatchVoting } from "@/components/match-voting"
import { PlayerRanking } from "@/components/player-ranking"
import { TrainingChart } from "@/components/training-chart"
import { InjuryTracking } from "@/components/injury-tracking"
import { BackButton } from "@/components/back-button"
import { Trophy, Users, Target, TrendingUp, Heart, Shield } from "lucide-react"
import TeamStatsService, { TeamStats } from "@/lib/team-stats-service"
import { useLanguage } from "@/lib/language-context"

export const metadata = {
  title: "Advanced Features | Titan Force FC",
  description: "Explore advanced features including lineup builder, tactical board, match voting, player rankings, training performance, and injury tracking.",
}

export default function FeaturesPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTeamStats = async () => {
      const stats = await TeamStatsService.getTeamStats()
      setTeamStats(stats)
      setIsLoading(false)
    }
    loadTeamStats()
  }, [])

  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 text-center hero-gradient">
          <div className="max-w-6xl mx-auto">
            <BackButton className="mb-6" />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary">
            ADVANCED TOOLS
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl tracking-wide text-foreground mb-4">
            TEAM FEATURES
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Explore our comprehensive suite of tools for lineup building, tactical planning, player analytics, and more.
          </p>
        </section>

        {/* Team Stats Overview */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl tracking-wide mb-12 text-center">
              {isBn ? "দল পরিসংখ্যান" : "TEAM STATISTICS"}
            </h2>
            
            {isLoading ? (
              <div className="text-center text-foreground/60">
                {isBn ? "পরিসংখ্যান লোড হচ্ছে..." : "Loading statistics..."}
              </div>
            ) : teamStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Players */}
                <div className="p-6 rounded-lg border-2 border-secondary bg-background hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">{isBn ? "মোট খেলোয়াড়" : "Total Players"}</p>
                      <p className="text-3xl font-bold text-foreground">{teamStats.total_players}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {teamStats.active_players} {isBn ? "সক্রিয়" : "active"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Goals */}
                <div className="p-6 rounded-lg border-2 border-secondary bg-background hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-red-500/10">
                      <Target className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">{isBn ? "মোট গোল" : "Total Goals"}</p>
                      <p className="text-3xl font-bold text-foreground">{teamStats.total_goals}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {(teamStats.total_goals / teamStats.active_players).toFixed(1)} {isBn ? "গড়/খেলোয়াড়" : "per player"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Assists */}
                <div className="p-6 rounded-lg border-2 border-secondary bg-background hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Heart className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">{isBn ? "মোট সহায়তা" : "Total Assists"}</p>
                      <p className="text-3xl font-bold text-foreground">{teamStats.total_assists}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {(teamStats.total_assists / teamStats.active_players).toFixed(1)} {isBn ? "গড়/খেলোয়াড়" : "per player"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Rating */}
                <div className="p-6 rounded-lg border-2 border-secondary bg-background hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">{isBn ? "দল রেটিং" : "Team Rating"}</p>
                      <p className="text-3xl font-bold text-foreground">{teamStats.avg_team_rating.toFixed(1)}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {isBn ? "গড়" : "average"} rating
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Formation */}
            {teamStats && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg border-2 border-secondary bg-background text-center hover:border-primary transition-colors">
                  <p className="text-2xl font-bold text-foreground">{teamStats.goalkeepers}</p>
                  <p className="text-xs text-foreground/60 mt-2">{isBn ? "গোলরক্ষক" : "Goalkeepers"}</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-secondary bg-background text-center hover:border-primary transition-colors">
                  <p className="text-2xl font-bold text-foreground">{teamStats.defenders}</p>
                  <p className="text-xs text-foreground/60 mt-2">{isBn ? "ডিফেন্ডার" : "Defenders"}</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-secondary bg-background text-center hover:border-primary transition-colors">
                  <p className="text-2xl font-bold text-foreground">{teamStats.midfielders}</p>
                  <p className="text-xs text-foreground/60 mt-2">{isBn ? "মিডফিল্ডার" : "Midfielders"}</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-secondary bg-background text-center hover:border-primary transition-colors">
                  <p className="text-2xl font-bold text-foreground">{teamStats.forwards}</p>
                  <p className="text-xs text-foreground/60 mt-2">{isBn ? "ফরওয়ার্ড" : "Forwards"}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <LineupBuilder />
        <TacticalBoard />
        <MatchVoting />
        <PlayerRanking />
        <TrainingChart />
        <InjuryTracking />
      </main>
      <Footer />
    </div>
  )
}
