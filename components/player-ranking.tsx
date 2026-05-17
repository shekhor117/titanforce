"use client"

import { useState, useEffect, useRef } from "react"
import { Trophy, TrendingUp, TrendingDown, Minus, Target, Award, Zap, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import PlayerRankingService, { PlayerRanking } from "@/lib/player-ranking-service"

export function PlayerRanking() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [sortBy, setSortBy] = useState<"ranking" | "goals" | "assists">("ranking")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [playerStats, setPlayerStats] = useState<PlayerRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadRankings = async () => {
      setIsLoading(true)
      const rankings = await PlayerRankingService.getPlayerRankings(sortBy, selectedPosition)
      setPlayerStats(rankings)
      setIsLoading(false)
    }
    loadRankings()
  }, [sortBy, selectedPosition])

  const filteredPlayers = playerStats.filter(
    p => selectedPosition === "all" || p.category === selectedPosition
  )

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "ranking") return b.ranking - a.ranking
    if (sortBy === "goals") return b.goals - a.goals
    return b.assists - a.assists
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 7) return "text-yellow-400"
    return "text-orange-400"
  }

  const getTrendIcon = (rating: number) => {
    return <Trophy className="w-4 h-4 text-yellow-400" />
  }

  const getFormColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500"
    if (rating >= 7) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "পারফরম্যান্স" : "PERFORMANCE"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "খেলোয়াড় র‍্যাঙ্কিং" : "PLAYER RANKINGS"}
          </h2>
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex gap-2">
            {["all", "GK", "DEF", "MID", "FWD"].map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-full border-2 transition ${
                  selectedPosition === pos
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-secondary bg-transparent text-foreground hover:border-primary/50"
                }`}
              >
                {pos === "all" ? (isBn ? "সব" : "All") : pos}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["rating", "goals", "assists"] as const).map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                  sortBy === sort
                    ? "bg-secondary text-foreground"
                    : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
                } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {sort === "rating" ? (isBn ? "রেটিং" : "Rating") : sort === "goals" ? (isBn ? "গোল" : "Goals") : (isBn ? "অ্যাসিস্ট" : "Assists")}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortBy === "ranking" && selectedPosition === "all" && (
          <div className={`flex justify-center items-end gap-4 mb-10 transition-all duration-600 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {isLoading ? (
              <div className="text-center text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
            ) : sortedPlayers.length >= 3 ? (
              [sortedPlayers[1], sortedPlayers[0], sortedPlayers[2]].map((player, index) => {
                const place = index === 1 ? 1 : index === 0 ? 2 : 3
                const height = place === 1 ? "h-32" : place === 2 ? "h-24" : "h-20"
                const bgColor = place === 1 ? "bg-gradient-to-t from-yellow-600/30 to-yellow-400/10" : place === 2 ? "bg-gradient-to-t from-gray-400/30 to-gray-300/10" : "bg-gradient-to-t from-amber-700/30 to-amber-600/10"
                
                return (
                  <div key={player?.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full bg-card border-3 ${place === 1 ? "border-yellow-400" : place === 2 ? "border-gray-400" : "border-amber-600"} flex items-center justify-center mb-2`}>
                      <span className="font-[var(--font-display)] text-2xl text-foreground">{player?.num}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground mb-1">{player?.name}</span>
                    <span className={`text-lg font-bold ${getRatingColor(player?.ranking || 0)}`}>{player?.ranking.toFixed(1)}</span>
                    <div className={`w-20 ${height} ${bgColor} rounded-t-lg flex items-end justify-center pb-2 mt-2`}>
                      <span className="font-[var(--font-display)] text-3xl text-foreground/80">{place}</span>
                    </div>
                  </div>
                )
              })
            ) : null}
          </div>
        )}

        {/* Player List */}
        <div className={`space-y-3 transition-all duration-600 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {isLoading ? (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "র‍্যাঙ্কিং লোড হচ্ছে..." : "Loading rankings..."}
            </div>
          ) : sortedPlayers.length > 0 ? (
            sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-4 rounded-xl bg-card border-2 ${index === 0 ? "border-primary" : "border-secondary"} hover:border-primary/50 transition`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Player Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-[var(--font-display)] text-xl text-foreground">{player.num}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{player.name}</div>
                      <div className="text-xs text-foreground/60 uppercase">{player.category}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-foreground">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="font-bold">{player.goals}</span>
                      </div>
                      <div className={`text-[10px] text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "গোল" : "Goals"}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-foreground">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-bold">{player.assists}</span>
                      </div>
                      <div className={`text-[10px] text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "সহায়তা" : "Assists"}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-foreground">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold">{player.man_of_the_match}</span>
                      </div>
                      <div className={`text-[10px] text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>MOTM</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div className={`text-2xl font-bold ${getRatingColor(player.ranking)}`}>
                      {player.ranking.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
