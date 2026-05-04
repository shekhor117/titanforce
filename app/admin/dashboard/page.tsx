"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"

interface Stats {
  totalPlayers: number
  totalMatches: number
  completedMatches: number
  upcomingMatches: number
}

export default function AdminDashboard() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<Stats>({
    totalPlayers: 0,
    totalMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const isBn = language === "bn"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        // Fetch player count
        const { count: playerCount } = await supabase
          .from("player_profiles")
          .select("*", { count: "exact", head: true })

        // Fetch match stats
        const { data: matchData } = await supabase
          .from("matches")
          .select("status")

        const totalMatches = matchData?.length || 0
        const completedMatches = matchData?.filter((m) => m.status === "completed").length || 0
        const upcomingMatches = matchData?.filter((m) => m.status === "upcoming").length || 0

        setStats({
          totalPlayers: playerCount || 0,
          totalMatches,
          completedMatches,
          upcomingMatches,
        })
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: isBn ? "মোট খেলোয়াড়" : "Total Players", value: stats.totalPlayers, icon: "⚽", color: "text-blue-400" },
    { label: isBn ? "মোট ম্যাচ" : "Total Matches", value: stats.totalMatches, icon: "🏆", color: "text-yellow-400" },
    { label: isBn ? "সম্পন্ন ম্যাচ" : "Completed", value: stats.completedMatches, icon: "✅", color: "text-green-400" },
    { label: isBn ? "আসন্ন ম্যাচ" : "Upcoming", value: stats.upcomingMatches, icon: "📅", color: "text-red-400" },
  ]

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "টাইটান ফোর্স ম্যানেজমেন্ট সিস্টেম" : "Titan Force Management System"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-6 border-2 border-secondary bg-card hover:border-primary transition"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className={`text-3xl font-[var(--font-display)] ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "দ্রুত কর্ম" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/players"
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition text-center"
          >
            <div className="text-2xl mb-2">⚽</div>
            <div className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড় পরিচালনা করুন" : "Manage Players"}
            </div>
          </a>
          <a
            href="/admin/matches"
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition text-center"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ম্যাচ পরিচালনা করুন" : "Manage Matches"}
            </div>
          </a>
          <a
            href="/admin/fans"
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অনুরাগী দেখুন" : "View Fans"}
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
