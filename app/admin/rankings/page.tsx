"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { BarChart4, Save, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import { dataStore, useDataStore } from "@/lib/data-store"

export default function AdminRankingsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()

  const players = useDataStore(dataStore.getPlayers, "players")

  const [rankings, setRankings] = useState(
    players.map(p => ({
      id: p.id,
      num: p.num,
      name: p.name,
      pos: p.pos,
      rating: 7.5,
      goals: p.goals,
      assists: p.assists,
      motm: 0
    })).sort((a, b) => b.rating - a.rating)
  )
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("ALL")

  const positions = ["ALL", "GK", "DEF", "MID", "FWD"]

  const handleRatingChange = (id, newRating) => {
    const updated = rankings.map(p => 
      p.id === id ? { ...p, rating: Math.min(10, Math.max(0, newRating)) } : p
    ).sort((a, b) => b.rating - a.rating)
    setRankings(updated)
    setHasChanges(true)
  }

  const filteredRankings = selectedPosition === "ALL"
    ? rankings
    : rankings.filter(p => {
        const player = players.find(pl => pl.id === p.id)
        return player?.cat === selectedPosition
      })

  const handleSave = () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }
    setHasChanges(false)
    alert(isBn ? "র‍্যাঙ্কিং সফলভাবে সংরক্ষিত হয়েছে!" : "Rankings saved successfully!")
  }

  const handleReset = () => {
    setRankings(
      players.map(p => ({
        id: p.id,
        num: p.num,
        name: p.name,
        pos: p.pos,
        rating: 7.5,
        goals: p.goals,
        assists: p.assists,
        motm: 0
      })).sort((a, b) => b.rating - a.rating)
    )
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "খেলোয়াড় র‍্যাঙ্কিং" : "Player Rankings"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "খেলোয়াড়দের রেট এবং র‍্যাঙ্ক করুন" : "Rate and rank players"}
        </p>
      </div>

      {/* Filter by Position */}
      <div className="flex gap-2">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={`px-4 py-2 rounded-lg border-2 transition ${
              selectedPosition === pos
                ? "border-primary bg-primary/10 text-primary"
                : "border-secondary hover:border-primary/50"
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary bg-secondary/30">
                <th className="px-4 py-3 text-left text-sm font-semibold">{isBn ? "র‍্যাঙ্ক" : "Rank"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">{isBn ? "খেলোয়াড়" : "Player"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">{isBn ? "অবস্থান" : "Position"}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">{isBn ? "রেটিং" : "Rating"}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">{isBn ? "গোল" : "Goals"}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">{isBn ? "সহায়তা" : "Assists"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((player, idx) => (
                <tr key={player.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {idx + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-xs text-foreground/60">#{player.num}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{player.pos}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={player.rating}
                        onChange={(e) => handleRatingChange(player.id, parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 rounded border-2 border-secondary bg-transparent text-center font-bold"
                      />
                      <span className="text-sm font-bold text-primary">/10</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-yellow-400">
                    {player.goals}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-green-400">
                    {player.assists}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-secondary hover:border-primary text-foreground/70 hover:text-primary transition"
        >
          <RefreshCw className="w-4 h-4" />
          {isBn ? "রিসেট" : "Reset"}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          <Save className="w-4 h-4" />
          {isBn ? "সংরক্ষণ করুন" : "Save Rankings"}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {Math.max(...rankings.map(p => p.rating)).toFixed(1)}
          </div>
          <div className="text-sm text-foreground/60">{isBn ? "সর্বোচ্চ রেটিং" : "Highest Rating"}</div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">
            {(rankings.reduce((a, b) => a + b.rating, 0) / rankings.length).toFixed(1)}
          </div>
          <div className="text-sm text-foreground/60">{isBn ? "গড় রেটিং" : "Average Rating"}</div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {Math.min(...rankings.map(p => p.rating)).toFixed(1)}
          </div>
          <div className="text-sm text-foreground/60">{isBn ? "সর্বনিম্ন রেটিং" : "Lowest Rating"}</div>
        </div>
      </div>
    </div>
  )
}
