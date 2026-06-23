"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"
import { Trophy, Target, Zap, Award } from "lucide-react"
import Image from "next/image"

interface TopPlayersCardsProps {
  players: Player[]
  limit?: number
}

export function TopPlayersCards({ players, limit = 6 }: TopPlayersCardsProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Ensure players is always an array with no null values
  const safePlayersArray = (players ?? []).filter((p) => p !== null && p !== undefined)

  // Sort by goals (top scorers)
  const topScorers = (safePlayersArray ?? [])
    .filter((p) => p?.status === "active")
    .sort((a, b) => ((b?.goals ?? 0) - (a?.goals ?? 0)))
    .slice(0, limit)

  const getPositionColor = (cat: string) => {
    switch (cat) {
      case "GK":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "DEF":
        return "bg-accent/20 text-accent border-accent/30"
      case "MID":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "FWD":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategory = (p: Player) => p.category || p.cat || "MID"

  return (
    <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-card/60 to-card/30 p-6 field-pattern relative overflow-hidden">
      {/* Decorative trophy glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-500/20 to-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className={`font-display text-lg tracking-[0.15em] uppercase text-foreground match-title ${isBn ? "font-bengali" : ""}`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 trophy-badge" />
            {isBn ? "শীর্ষ খেলোয়াড়" : "Top Scorers"}
          </div>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {topScorers.length > 0 ? (
          topScorers.map((player, index) => (
            <div
              key={player.id}
              className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-card/40 p-3 sm:p-4 hover:border-primary/60 match-card-hover overflow-hidden relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Team highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Rank Badge */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 border-2 border-primary/60 animate-badge-pop"
                   style={{ animationDelay: `${index * 100 + 300}ms` }}>
                <span className="text-xs sm:text-sm font-bold text-primary jersey-number">#{index + 1}</span>
              </div>

              {/* Player Photo */}
              {(player.image_url || player.photo) && (
                <div className="relative w-full h-32 sm:h-40 mb-2 sm:mb-3 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center flex-shrink-0">
                  <Image
                    src={player.image_url || player.photo || ""}
                    alt={player.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Player Info */}
              <div className="mb-2 sm:mb-3">
                <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{player.name}</h4>
                    <p className="text-xs text-foreground/60">#{player.num}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border font-semibold flex-shrink-0 ${getPositionColor(getCategory(player))}`}>
                    {getCategory(player)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-red-400" />
                  </div>
                  <div className="text-sm font-bold text-red-400">{player.goals || 0}</div>
                  <div className="text-xs text-foreground/50">{isBn ? "গোল" : "Goals"}</div>
                </div>

                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="text-sm font-bold text-green-400">{player.assists || 0}</div>
                  <div className="text-xs text-foreground/50">{isBn ? "সহায়তা" : "Assists"}</div>
                </div>

                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-purple-400">{((player.average_rating || player.averageRating) || 0).toFixed?.(1) || "0"}</div>
                  <div className="text-xs text-foreground/50">{isBn ? "রেটিং" : "Rating"}</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="text-xs text-foreground/60 space-y-1 pb-2 border-t border-secondary/50 pt-2">
                <div className="flex justify-between">
                  <span>{isBn ? "উপস্থিতি" : "Appearances"}:</span>
                  <span className="font-semibold">{player.appearances || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "মিনিট" : "Minutes"}:</span>
                  <span className="font-semibold">{(player.minutes_played || player.minutes) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "পাস নির্ভুলতা" : "Pass Accuracy"}:</span>
                  <span className="font-semibold">{(player.pass_accuracy || player.passAccuracy) || 0}%</span>
                </div>
              </div>

              {/* Age Info */}
              <div className="text-xs text-foreground/50 text-center pt-2 border-t border-secondary/50">
                {isBn ? "বয়স" : "Age"}: {player.age} | {player.hometown}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-foreground/50">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{isBn ? "কোনো সক্রিয় খেলোয়াড় নেই" : "No active players"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
