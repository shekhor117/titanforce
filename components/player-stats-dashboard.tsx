"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"
import { TrendingUp, Target, Activity, Trophy, Clock, AlertCircle } from "lucide-react"

interface PlayerStatsDashboardProps {
  players: Player[]
}

export function PlayerStatsDashboard({ players }: PlayerStatsDashboardProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Calculate aggregate stats
  const totalGoals = players.reduce((sum, p) => sum + (p.goals || 0), 0)
  const totalAssists = players.reduce((sum, p) => sum + (p.assists || 0), 0)
  const totalAppearances = players.reduce((sum, p) => sum + (p.appearances || 0), 0)
  const totalMinutes = players.reduce((sum, p) => sum + (p.minutes || 0), 0)
  const avgRating =
    players.length > 0
      ? (players.reduce((sum, p) => sum + (p.averageRating || 0), 0) / players.length).toFixed(2)
      : "0"

  const injuredPlayers = players.filter((p) => p.status === "injured").length
  const suspendedPlayers = players.filter((p) => p.status === "suspended").length
  const activePlayers = players.filter((p) => p.status === "active").length

  const stats = [
    {
      label: isBn ? "মোট গোল" : "Total Goals",
      value: totalGoals.toString(),
      icon: <Target className="w-5 h-5" />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: isBn ? "মোট সহায়তা" : "Total Assists",
      value: totalAssists.toString(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: isBn ? "উপস্থিতি" : "Appearances",
      value: totalAppearances.toString(),
      icon: <Activity className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: isBn ? "মিনিট" : "Minutes",
      value: totalMinutes.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: isBn ? "গড় রেটিং" : "Avg Rating",
      value: avgRating,
      icon: <Trophy className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg p-4 border border-secondary/50 ${stat.bgColor}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-bengali" : ""}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Player Status Overview */}
      <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
        <h3 className={`font-display text-lg tracking-wider text-foreground mb-4 ${isBn ? "font-bengali" : ""}`}>
          {isBn ? "খেলোয়াড় স্থিতি" : "Player Status Overview"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">{activePlayers}</div>
            <div className="flex-1">
              <div className={`text-sm font-semibold text-foreground ${isBn ? "font-bengali" : ""}`}>
                {isBn ? "সক্রিয়" : "Active"}
              </div>
              <div className="text-xs text-foreground/60">
                {((activePlayers / players.length) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-400">{injuredPlayers}</div>
            <div className="flex-1">
              <div className={`text-sm font-semibold text-foreground ${isBn ? "font-bengali" : ""}`}>
                {isBn ? "আহত" : "Injured"}
              </div>
              <div className="text-xs text-foreground/60">
                {((injuredPlayers / players.length) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-3xl font-bold text-red-400">{suspendedPlayers}</div>
            <div className="flex-1">
              <div className={`text-sm font-semibold text-foreground ${isBn ? "font-bengali" : ""}`}>
                {isBn ? "স্থগিত" : "Suspended"}
              </div>
              <div className="text-xs text-foreground/60">
                {((suspendedPlayers / players.length) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
