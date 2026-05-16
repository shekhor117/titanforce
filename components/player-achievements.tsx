"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"
import { Trophy, Award, Star, Zap } from "lucide-react"

interface PlayerAchievementsProps {
  players: Player[]
}

export function PlayerAchievements({ players }: PlayerAchievementsProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Calculate achievements
  const totalTrophies = players.reduce((sum, p) => sum + (p.trophies?.length || 0), 0)
  const totalMotmAwards = players.reduce((sum, p) => sum + ((p.man_of_the_match || p.motmAwards) || 0), 0)
  const totalYellowCards = players.reduce((sum, p) => sum + ((p.yellow_cards || p.yellowCards) || 0), 0)
  const totalRedCards = players.reduce((sum, p) => sum + ((p.red_cards || p.redCards) || 0), 0)

  // Get players with trophies
  const playersWithTrophies = players.filter((p) => p.trophies && p.trophies.length > 0)

  const achievements = [
    {
      label: isBn ? "ট্রফি জিতেছে" : "Trophies Won",
      value: totalTrophies.toString(),
      icon: <Trophy className="w-6 h-6" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: isBn ? "ম্যান অফ দ্য ম্যাচ" : "MOTM Awards",
      value: totalMotmAwards.toString(),
      icon: <Star className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: isBn ? "হলুদ কার্ড" : "Yellow Cards",
      value: totalYellowCards.toString(),
      icon: <Award className="w-6 h-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
    },
    {
      label: isBn ? "লাল কার্ড" : "Red Cards",
      value: totalRedCards.toString(),
      icon: <Zap className="w-6 h-6" />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
        <h3 className={`font-display text-lg tracking-wider text-foreground mb-6 ${isBn ? "font-bengali" : ""}`}>
          {isBn ? "দলের সাফল্য" : "Team Achievements"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.label}
              className={`rounded-lg p-4 border border-secondary/50 ${achievement.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={achievement.color}>{achievement.icon}</div>
              </div>
              <div className={`text-2xl font-bold ${achievement.color}`}>{achievement.value}</div>
              <div className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-bengali" : ""}`}>
                {achievement.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Players with Trophies */}
      {playersWithTrophies.length > 0 && (
        <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
          <h3 className={`font-display text-lg tracking-wider text-foreground mb-6 ${isBn ? "font-bengali" : ""}`}>
            {isBn ? "ট্রফি বিজয়ী" : "Trophy Winners"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playersWithTrophies.map((player) => (
              <div
                key={player.id}
                className="rounded-lg border border-secondary/50 bg-secondary/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{player.name}</h4>
                    <div className="text-xs text-foreground/60 mt-2">
                      {player.trophies?.map((trophy, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-primary font-semibold">{trophy.name}</span>
                          <span className="text-foreground/40">({trophy.year})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
