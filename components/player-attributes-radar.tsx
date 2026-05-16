"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"

interface PlayerAttributesRadarProps {
  players: Player[]
  limit?: number
}

export function PlayerAttributesRadar({ players, limit = 4 }: PlayerAttributesRadarProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Get top players by rating
  const topPlayers = [...players]
    .filter((p) => p.status === "active")
    .sort((a, b) => ((b.average_rating || b.averageRating) || 0) - ((a.average_rating || a.averageRating) || 0))
    .slice(0, limit)

  const attributes = [
    { key: "pace", label: isBn ? "গতি" : "Pace", color: "bg-red-500" },
    { key: "shooting", label: isBn ? "শ্যুট" : "Shooting", color: "bg-orange-500" },
    { key: "passing", label: isBn ? "পাস" : "Passing", color: "bg-green-500" },
    { key: "dribbling", label: isBn ? "ড্রিবলিং" : "Dribbling", color: "bg-blue-500" },
    { key: "defending", label: isBn ? "ডিফেন্ডিং" : "Defending", color: "bg-purple-500" },
    { key: "physical", label: isBn ? "শারীরিক" : "Physical", color: "bg-yellow-500" },
  ]

  return (
    <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
      <h3 className={`font-display text-lg tracking-wider text-foreground mb-6 ${isBn ? "font-bengali" : ""}`}>
        {isBn ? "খেলোয়াড় বৈশিষ্ট্য" : "Player Attributes"}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topPlayers.map((player) => (
          <div key={player.id} className="rounded-lg border border-secondary/50 bg-secondary/10 p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-foreground">{player.name}</h4>
              <p className="text-xs text-foreground/60">#{player.num} • {player.category || player.cat}</p>
            </div>

            <div className="space-y-3">
              {attributes.map((attr) => {
                const value = (player as Record<string, number>)[attr.key] || 0
                const percentage = Math.min((value / 100) * 100, 100)

                return (
                  <div key={attr.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground/80">
                        {attr.label}
                      </span>
                      <span className={`text-xs font-bold ${attr.color.replace("bg-", "text-")}`}>
                        {value}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className={`h-full ${attr.color} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Average of all attributes */}
            <div className="mt-4 pt-3 border-t border-secondary/50">
              <div className="text-xs text-foreground/60">
                {isBn ? "গড় মূল্যায়ন" : "Average Rating"}:{" "}
                <span className="font-bold text-primary">
                  {(
                    attributes.reduce(
                      (sum, attr) =>
                        sum + ((player as Record<string, number>)[attr.key] || 0),
                      0
                    ) / attributes.length
                  ).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topPlayers.length === 0 && (
        <div className="text-center py-8 text-foreground/50">
          <p>{isBn ? "कोई सक्रिय खिलाड़ी नहीं" : "No active players"}</p>
        </div>
      )}
    </div>
  )
}
