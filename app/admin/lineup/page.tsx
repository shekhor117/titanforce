"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Layers, Save, RefreshCw, Plus, X } from "lucide-react"
import { dataStore } from "@/lib/data-store"

export default function AdminLineupPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [players, setPlayers] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const playersData = dataStore.getPlayers()
    setPlayers(Array.isArray(playersData) ? playersData : [])
  }, [])

  const formations = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2", "3-4-3"]
  const [selectedFormation, setSelectedFormation] = useState(formations[0])
  const [lineupPlayers, setLineupPlayers] = useState<any[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<any[]>(players)
  const [hasChanges, setHasChanges] = useState(false)

  const handleAddPlayer = (player: any) => {
    if (lineupPlayers.length < 11) {
      setLineupPlayers([...lineupPlayers, player])
      setAvailablePlayers(availablePlayers.filter((p: any) => p.id !== player.id))
      setHasChanges(true)
    }
  }

  const handleRemovePlayer = (player: any) => {
    setLineupPlayers(lineupPlayers.filter((p: any) => p.id !== player.id))
    setAvailablePlayers([...availablePlayers, player])
    setHasChanges(true)
  }

  const handleFormationChange = (formation: string) => {
    setSelectedFormation(formation)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }
    setHasChanges(false)
    alert(isBn ? "লাইনআপ সফলভাবে সংরক্ষিত হয়েছে!" : "Lineup saved successfully!")
  }

  const handleReset = () => {
    setLineupPlayers([])
    setAvailablePlayers(Array.isArray(players) ? players : [])
    setSelectedFormation(formations[0])
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "লাইনআপ বিল্ডার" : "Lineup Builder"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "দল গঠন এবং কৌশল সেট করুন" : "Build your team and set tactics"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formation Selection */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "গঠন নির্বাচন" : "Formation"}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {formations.map((formation) => (
              <button
                key={formation}
                onClick={() => handleFormationChange(formation)}
                className={`p-3 rounded-lg border-2 font-bold transition ${
                  selectedFormation === formation
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-secondary hover:border-primary/50"
                }`}
              >
                {formation}
              </button>
            ))}
          </div>

          <h2 className={`text-xl font-semibold mt-6 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "উপলব্ধ খেলোয়াড়" : "Available Players"}
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {availablePlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => handleAddPlayer(player)}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-secondary hover:border-primary/50 transition text-left"
              >
                <div>
                  <div className="font-semibold text-sm">{player.name}</div>
                  <div className="text-xs text-foreground/60">{player.pos}</div>
                </div>
                <Plus className="w-4 h-4 text-primary" />
              </button>
            ))}
          </div>
        </div>

        {/* Field Visualization */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border-2 border-secondary bg-card p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মাঠ" : "Field"} ({lineupPlayers.length}/11)
            </h2>
            
            <div className="aspect-video bg-gradient-to-b from-green-900 to-green-700 rounded-lg border-2 border-green-600/50 p-4 flex flex-col justify-center items-center relative overflow-hidden">
              {/* Field lines */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-0 right-0 border-t border-white"></div>
                <div className="absolute top-0 bottom-0 left-1/2 border-l border-white"></div>
                <div className="absolute top-0 left-1/2 right-0 w-1/4 h-1/3 border border-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 right-0 w-1/4 h-1/3 border border-white rounded-full transform -translate-x-1/2"></div>
              </div>

              {/* Players on field */}
              <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-2">
                {lineupPlayers.map((player, idx) => (
                  <div
                    key={player.id}
                    className="relative group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center text-white font-bold border-2 border-primary/50 cursor-pointer hover:bg-primary transition"
                      onClick={() => handleRemovePlayer(player)}
                    >
                      {player.num}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                      {player.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {lineupPlayers.length < 11 && (
              <p className={`mt-4 text-sm text-yellow-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? `${11 - lineupPlayers.length} খেলোয়াড় প্রয়োজন` : `${11 - lineupPlayers.length} more players needed`}
              </p>
            )}

            {/* Lineup Summary */}
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "দল তালিকা" : "Team Lineup"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {lineupPlayers.map((player) => (
                  <div key={player.id} className="p-2 rounded-lg bg-secondary/30 border border-secondary text-center">
                    <div className="font-bold text-primary">{player.num}</div>
                    <div className="text-xs text-foreground/70">{player.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-secondary hover:border-primary text-foreground/70 hover:text-primary transition"
              >
                <RefreshCw className="w-4 h-4" />
                {isBn ? "রিসেট" : "Reset"}
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || lineupPlayers.length < 11}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                <Save className="w-4 h-4" />
                {isBn ? "সংরক্ষণ করুন" : "Save Lineup"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
