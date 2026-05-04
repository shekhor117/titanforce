"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

interface PlayerStat {
  id: string
  user_id: string
  season: string
  goals: number
  assists: number
  appearances: number
  minutes_played: number
  yellow_cards: number
  red_cards: number
  profiles: {
    id: string
    full_name: string
    photo_url?: string
    jersey_number?: number
  }
}

export default function LeaderboardPage() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<PlayerStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [season, setSeason] = useState("2024-2025")
  const isBn = language === "bn"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/player-stats?season=${season}`)
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("[v0] Error loading stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [season])

  const tabs = [
    { id: "goals", label: isBn ? "গোল" : "Goals" },
    { id: "assists", label: isBn ? "অ্যাসিস্ট" : "Assists" },
    { id: "appearances", label: isBn ? "উপস্থিতি" : "Appearances" },
  ]

  const [activeTab, setActiveTab] = useState("goals")

  const getSortedStats = () => {
    return [...stats].sort((a, b) => {
      switch (activeTab) {
        case "goals":
          return b.goals - a.goals
        case "assists":
          return b.assists - a.assists
        case "appearances":
          return b.appearances - a.appearances
        default:
          return 0
      }
    })
  }

  const sortedStats = getSortedStats()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 border-b-2 border-secondary">
        <div className="max-w-6xl mx-auto">
          <h1
            className={`font-[var(--font-display)] text-5xl tracking-wider text-foreground mb-2 ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "লিডারবোর্ড" : "Leaderboard"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড়দের পরিসংখ্যান এবং পারফরম্যান্স" : "Player Statistics & Performance"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Season Selector */}
          <div className="mb-8 flex items-center gap-4">
            <label className={`text-sm font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সিজন:" : "Season:"}
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b-2 border-secondary pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary -mb-4 pb-4"
                    : "text-foreground/60 hover:text-foreground"
                } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats Table */}
          {isLoading ? (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "লোড হচ্ছে..." : "Loading..."}
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "কোন পরিসংখ্যান নেই" : "No statistics available"}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary">
                    <th
                      className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "র‍্যাঙ্ক" : "Rank"}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "খেলোয়াড়" : "Player"}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "গোল" : "Goals"}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "অ্যাসিস্ট" : "Assists"}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "উপস্থিতি" : "Appearances"}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "মিনিট" : "Minutes"}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold ${
                        isBn ? "font-[var(--font-bengali)]" : ""
                      }`}
                    >
                      {isBn ? "কার্ড" : "Cards"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map((stat, index) => (
                    <tr
                      key={stat.id}
                      className="border-b border-secondary hover:bg-secondary/20 transition"
                    >
                      <td className="px-4 py-3 font-bold text-primary text-lg">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/player/${stat.profiles?.jersey_number}`}
                          className="hover:text-primary transition"
                        >
                          <div className="font-semibold text-foreground">
                            {stat.profiles?.full_name}
                          </div>
                          <div className="text-xs text-foreground/60">
                            #{stat.profiles?.jersey_number}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-primary">
                        {stat.goals}
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">
                        {stat.assists}
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">
                        {stat.appearances}
                      </td>
                      <td className="px-4 py-3 text-center text-foreground text-sm">
                        {stat.minutes_played}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className="inline-block px-2 py-1 rounded">
                          <span className="text-yellow-400">
                            🟨 {stat.yellow_cards}
                          </span>
                          {stat.red_cards > 0 && (
                            <span className="ml-2 text-red-400">🟥 {stat.red_cards}</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
