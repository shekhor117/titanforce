"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Trophy, Save, RefreshCw, Star } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { PageEntrance } from '@/components/page-entrance'

export default function AdminMotmPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [isClient, setIsClient] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    const playersData = dataStore.getPlayers()
    const matchesData = dataStore.getMatches()
    setPlayers(Array.isArray(playersData) ? playersData : [])
    setMatches(Array.isArray(matchesData) ? matchesData : [])
  }, [])

  const [selectedMatch, setSelectedMatch] = useState(matches.length > 0 ? matches[0] : null)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [matchRating, setMatchRating] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)

  const handlePlayerSelect = (player: any) => {
    setSelectedPlayer(player)
    setHasChanges(true)
  }

  const handleRatingChange = (rating: number) => {
    setMatchRating(rating)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }
    setHasChanges(false)
    alert(isBn ? "ম্যাচ অফ দ্য ম্যাচ সফলভাবে সংরক্ষিত হয়েছে!" : "Man of the Match saved successfully!")
  }

  const handleReset = () => {
    setSelectedPlayer(null)
    setMatchRating(0)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ম্যাচ অফ দ্য ম্যাচ" : "Man of the Match"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ম্যাচ রেটিং এবং সেরা খেলোয়াড় নির্বাচন করুন" : "Rate matches and select best player"}
        </p>
      </div>

      {/* Match Selection */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ম্যাচ নির্বাচন" : "Select Match"}
        </h2>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => {
                setSelectedMatch(match)
                setSelectedPlayer(null)
                setMatchRating(0)
              }}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                selectedMatch?.id === match.id
                  ? "border-primary bg-primary/10"
                  : "border-secondary/50"
              }`}
            >
              <div className="font-semibold text-foreground">{match.name}</div>
              <div className="text-xs text-foreground/60">{match.date}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedMatch && (
        <>
          {/* Match Rating */}
          <div className="rounded-xl border-2 border-secondary bg-card p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ম্যাচ রেটিং" : "Rate This Match"}
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`w-12 h-12 rounded-lg border-2 transition flex items-center justify-center text-lg font-bold ${
                    matchRating === rating
                      ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
                      : "border-secondary hover:border-yellow-400"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            {matchRating > 0 && (
              <p className={`mt-3 text-sm text-yellow-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? `রেটিং: ${matchRating}/5` : `Rating: ${matchRating}/5`}
              </p>
            )}
          </div>

          {/* Player Selection */}
          <div className="rounded-xl border-2 border-secondary bg-card p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ম্যান অফ দ্য ম্যাচ নির্বাচন" : "Select Man of the Match"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerSelect(player)}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    selectedPlayer?.id === player.id
                      ? "border-primary bg-primary/10"
                      : "border-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {selectedPlayer?.id === player.id && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    <span className="font-bold text-primary">{player.num}</span>
                  </div>
                  <div className="font-semibold text-foreground text-sm">{player.name}</div>
                  <div className="text-xs text-foreground/60">{player.pos}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-secondary text-foreground/70 hover:text-primary transition"
            >
              <RefreshCw className="w-4 h-4" />
              {isBn ? "রিসেট" : "Reset"}
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || !selectedPlayer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isBn ? "সংরক্ষণ করুন" : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
