"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, X } from "lucide-react"

interface Lineup {
  playerId: string
  position: string
}

interface Formation {
  id: string
  matchId: string
  formation: string
  startingLineup: Lineup[]
  substitutions: Lineup[]
  tactics: string
}

interface Match {
  id: string
  title: string
  opponent: string
  date: string
}

export default function AdminFormations() {
  const { language } = useLanguage()
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [formation, setFormation] = useState<Partial<Formation> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const isBn = language === "bn"

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/matches")
        if (!response.ok) throw new Error("Failed to fetch matches")
        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error("[v0] Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const handleSelectMatch = async (match: Match) => {
    setSelectedMatch(match)
    try {
      const response = await fetch(`/api/team-formations?matchId=${match.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormation(data)
      }
    } catch (error) {
      console.error("[v0] Error loading formation:", error)
    }
  }

  const handleSaveFormation = async () => {
    if (!selectedMatch || !formation) return

    try {
      setIsSaving(true)
      const response = await fetch("/api/team-formations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          formation: formation.formation || "4-3-3",
          startingLineup: formation.startingLineup,
          substitutions: formation.substitutions,
          tactics: formation.tactics,
        }),
      })

      if (!response.ok) throw new Error("Failed to save formation")
      alert(isBn ? "গঠন সংরক্ষিত হয়েছে" : "Formation saved successfully")
    } catch (error) {
      console.error("[v0] Error saving formation:", error)
      alert(isBn ? "ত্রুটি ঘটেছে" : "Error saving formation")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="py-8 text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "দলের গঠন" : "Team Formations"}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Match List */}
        <div className="space-y-4">
          <h2 className={`font-semibold text-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ম্যাচ নির্বাচন করুন" : "Select Match"}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {matches.map((match) => (
              <button
                key={match.id}
                onClick={() => handleSelectMatch(match)}
                className={`w-full p-4 rounded-lg border-2 transition ${
                  selectedMatch?.id === match.id
                    ? "border-primary bg-primary/10"
                    : "border-secondary hover:border-primary"
                }`}
              >
                <div className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  Titan Force vs {match.opponent}
                </div>
                <div className="text-sm text-foreground/60">{match.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formation Editor */}
        {selectedMatch && (
          <div className="rounded-xl border-2 border-primary bg-card p-6 space-y-6">
            <div>
              <h2 className={`font-semibold text-lg mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "গঠন সম্পাদনা করুন" : "Edit Formation"}
              </h2>

              {/* Formation Type */}
              <div className="mb-4">
                <label className={`text-sm font-semibold mb-2 block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ফরম্যাশন" : "Formation"}
                </label>
                <select
                  value={formation?.formation || "4-3-3"}
                  onChange={(e) => setFormation({ ...formation, formation: e.target.value })}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
                >
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="5-3-2">5-3-2</option>
                  <option value="4-4-2">4-4-2</option>
                </select>
              </div>

              {/* Tactics */}
              <div className="mb-4">
                <label className={`text-sm font-semibold mb-2 block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "কৌশল" : "Tactics"}
                </label>
                <textarea
                  value={formation?.tactics || ""}
                  onChange={(e) => setFormation({ ...formation, tactics: e.target.value })}
                  placeholder={isBn ? "দলের কৌশল বর্ণনা করুন" : "Describe team tactics"}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground h-24 resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveFormation}
                disabled={isSaving}
                className={`w-full px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isSaving ? (isBn ? "সংরক্ষণ করছে..." : "Saving...") : (isBn ? "সংরক্ষণ করুন" : "Save Formation")}
              </button>
            </div>

            {/* Formation Visual */}
            <div className="p-4 rounded-lg bg-secondary/20 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formation?.formation || "4-3-3"}
                </div>
                <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "গঠন ভিজ্যুয়ালাইজেশন" : "Formation Visualization"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
