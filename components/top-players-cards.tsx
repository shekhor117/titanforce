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

  // Sort by goals (top scorers)
  const topScorers = [...players]
    .filter((p) => p.status === "active")
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, limit)

  const getPositionColor = (cat: string) => {
    switch (cat) {
      case "GK":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "DEF":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "MID":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "FWD":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-display text-lg tracking-wider text-foreground ${isBn ? "font-bengali" : ""}`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {isBn ? "শীর্ষ খেলোয়াড়" : "Top Scorers"}
          </div>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topScorers.length > 0 ? (
          topScorers.map((player, index) => (
            <div
              key={player.id}
              className="rounded-lg border-2 border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 p-4 hover:border-primary/50 transition overflow-hidden relative"
            >
              {/* Rank Badge */}
              <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/50">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
              </div>

              {/* Player Photo */}
              {player.photo && (
                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center">
                  <Image
                    src={player.photo}
                    alt={player.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Player Info */}
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground truncate">{player.name}</h4>
                    <p className="text-xs text-foreground/60">#{player.num}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border font-semibold ${getPositionColor(player.cat)}`}>
                    {player.cat}
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
                  <div className="text-sm font-bold text-purple-400">{player.averageRating?.toFixed(1) || "0"}</div>
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
                  <span className="font-semibold">{player.minutes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "পাস নির্ভুলতা" : "Pass Accuracy"}:</span>
                  <span className="font-semibold">{player.passAccuracy || 0}%</span>
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
