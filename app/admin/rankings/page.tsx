"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { BarChart4, Save, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import PlayerRankingService, { PlayerRanking } from "@/lib/player-ranking-service"

export default function AdminRankingsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [players, setPlayers] = useState<PlayerRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rankings, setRankings] = useState<{ id: string; num: number; name: string; category: string; ranking: number; goals: number; assists: number; man_of_the_match: number }[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("ALL")
  const [isSaving, setIsSaving] = useState(false)

  const positions = ["ALL", "GK", "DEF", "MID", "FWD"]

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    setIsLoading(true)
    const data = await PlayerRankingService.getPlayerRankings('ranking', 'all')
    setPlayers(data)
    setRankings(
      data.map(p => ({
        id: p.id,
        num: p.num,
        name: p.name,
        category: p.category,
        ranking: p.ranking,
        goals: p.goals,
        assists: p.assists,
        man_of_the_match: p.man_of_the_match
      }))
    )
    setIsLoading(false)
  }

  const handleRatingChange = (id: string, newRating: number) => {
    const updated = rankings.map(p => 
      p.id === id ? { ...p, ranking: Math.min(10, Math.max(0, newRating)) } : p
    ).sort((a, b) => b.ranking - a.ranking)
    setRankings(updated)
    setHasChanges(true)
  }

  const filteredRankings = selectedPosition === "ALL"
    ? rankings
    : rankings.filter(p => p.category === selectedPosition)

  const handleSave = async () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }

    try {
      setIsSaving(true)
      const updates = rankings.map(p => ({
        playerId: p.id,
        ranking: p.ranking
      }))
      
      const success = await PlayerRankingService.updateMultipleRankings(updates)
      
      if (success) {
        setHasChanges(false)
        alert(isBn ? "র‍্যাঙ্কিং সফলভাবে সংরক্ষিত হয়েছে!" : "Rankings saved successfully!")
      } else {
        alert(isBn ? "র‍্যাঙ্কিং সংরক্ষণ ব্যর্থ" : "Failed to save rankings")
      }
    } catch (error) {
      console.error('[v0] Error saving rankings:', error)
      alert(isBn ? "ত্রুটি দেখা দিয়েছে" : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setRankings(
      players.map(p => ({
        id: p.id,
        num: p.num,
        name: p.name,
        category: p.category,
        ranking: p.ranking,
        goals: p.goals,
        assists: p.assists,
        man_of_the_match: p.man_of_the_match
      }))
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
          {isLoading ? (
            <div className="p-8 text-center text-foreground/60">
              {isBn ? "লোড হচ্ছে..." : "Loading..."}
            </div>
          ) : filteredRankings.length > 0 ? (
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
                    <td className="px-4 py-3 text-sm uppercase">{player.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={player.ranking}
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
          ) : (
            <div className="p-8 text-center text-foreground/60">
              {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 rounded-lg border-2 border-secondary hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          {isBn ? "রিসেট" : "Reset"}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? (isBn ? "সংরক্ষণ করছে..." : "Saving...") : (isBn ? "সংরক্ষণ করুন" : "Save Changes")}
        </button>
      </div>
