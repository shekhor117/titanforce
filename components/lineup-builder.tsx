"use client"

import { useState, useCallback } from "react"
import { Users, RotateCcw, Save, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Player {
  id: number
  name: string
  number: number
  position: string
}

interface FieldPosition {
  id: string
  x: number
  y: number
  player: Player | null
}

const availablePlayers: Player[] = [
  { id: 1, name: "Shuronjit", number: 1, position: "GK" },
  { id: 2, name: "Srijon", number: 3, position: "DEF" },
  { id: 3, name: "Akash", number: 4, position: "DEF" },
  { id: 4, name: "Akash", number: 5, position: "DEF" },
  { id: 5, name: "Sujon", number: 6, position: "MID" },
  { id: 6, name: "Shuvo", number: 7, position: "FWD" },
  { id: 7, name: "Sojib", number: 8, position: "MID" },
  { id: 8, name: "Sajon", number: 9, position: "FWD" },
  { id: 9, name: "Kourov", number: 11, position: "FWD" },
  { id: 10, name: "Shekhor", number: 17, position: "DEF" },
]

const formations: Record<string, { x: number; y: number }[]> = {
  "4-3-3": [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 },
    { x: 30, y: 50 }, { x: 50, y: 45 }, { x: 70, y: 50 },
    { x: 25, y: 25 }, { x: 50, y: 20 }, { x: 75, y: 25 },
  ],
  "4-4-2": [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 },
    { x: 20, y: 50 }, { x: 40, y: 45 }, { x: 60, y: 45 }, { x: 80, y: 50 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  "3-5-2": [
    { x: 50, y: 90 },
    { x: 30, y: 75 }, { x: 50, y: 78 }, { x: 70, y: 75 },
    { x: 15, y: 50 }, { x: 35, y: 45 }, { x: 50, y: 40 }, { x: 65, y: 45 }, { x: 85, y: 50 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  "4-2-3-1": [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 },
    { x: 35, y: 55 }, { x: 65, y: 55 },
    { x: 25, y: 35 }, { x: 50, y: 30 }, { x: 75, y: 35 },
    { x: 50, y: 15 },
  ],
}

export function LineupBuilder() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [selectedFormation, setSelectedFormation] = useState("4-3-3")
  const [fieldPositions, setFieldPositions] = useState<FieldPosition[]>(
    formations["4-3-3"].map((pos, i) => ({
      id: `pos-${i}`,
      x: pos.x,
      y: pos.y,
      player: null,
    }))
  )
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [savedLineups, setSavedLineups] = useState<{ name: string; positions: FieldPosition[] }[]>([])

  const handleFormationChange = (formation: string) => {
    setSelectedFormation(formation)
    setFieldPositions(
      formations[formation].map((pos, i) => ({
        id: `pos-${i}`,
        x: pos.x,
        y: pos.y,
        player: fieldPositions[i]?.player || null,
      }))
    )
  }

  const handleDragStart = (player: Player) => {
    setDraggedPlayer(player)
  }

  const handleDrop = useCallback((positionId: string) => {
    if (!draggedPlayer) return
    
    setFieldPositions(prev =>
      prev.map(pos =>
        pos.id === positionId
          ? { ...pos, player: draggedPlayer }
          : pos.player?.id === draggedPlayer.id
          ? { ...pos, player: null }
          : pos
      )
    )
    setDraggedPlayer(null)
  }, [draggedPlayer])

  const handleRemovePlayer = (positionId: string) => {
    setFieldPositions(prev =>
      prev.map(pos =>
        pos.id === positionId ? { ...pos, player: null } : pos
      )
    )
  }

  const handleReset = () => {
    setFieldPositions(
      formations[selectedFormation].map((pos, i) => ({
        id: `pos-${i}`,
        x: pos.x,
        y: pos.y,
        player: null,
      }))
    )
  }

  const handleSaveLineup = () => {
    const name = prompt(isBn ? "লাইনআপের নাম দিন:" : "Enter lineup name:")
    if (name) {
      setSavedLineups(prev => [...prev, { name, positions: [...fieldPositions] }])
    }
  }

  const assignedPlayerIds = fieldPositions
    .filter(p => p.player)
    .map(p => p.player!.id)

  const unassignedPlayers = availablePlayers.filter(
    p => !assignedPlayerIds.includes(p.id)
  )

  return (
    <section className="py-16 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কৌশল" : "TACTICS"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "লাইনআপ বিল্ডার" : "LINEUP BUILDER"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formation Selector & Players */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-secondary bg-card">
              <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ফর্মেশন" : "Formation"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formations).map(f => (
                  <button
                    key={f}
                    onClick={() => handleFormationChange(f)}
                    className={`px-3 py-2 text-sm font-bold rounded transition ${
                      selectedFormation === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-secondary bg-card">
              <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Users className="w-4 h-4" />
                {isBn ? "উপলব্ধ খেলোয়াড়" : "Available Players"}
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {unassignedPlayers.map(player => (
                  <div
                    key={player.id}
                    draggable
                    onDragStart={() => handleDragStart(player)}
                    className="flex items-center gap-3 p-2 rounded bg-secondary/30 cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {player.number}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{player.name}</span>
                    <span className="text-[10px] uppercase text-foreground/60 px-2 py-0.5 rounded bg-secondary">
                      {player.position}
                    </span>
                  </div>
                ))}
                {unassignedPlayers.length === 0 && (
                  <p className={`text-sm text-foreground/60 text-center py-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সব খেলোয়াড় মাঠে আছে" : "All players assigned"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-secondary/50 text-foreground hover:bg-secondary transition text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                {isBn ? "রিসেট" : "Reset"}
              </button>
              <button
                onClick={handleSaveLineup}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition text-sm font-semibold"
              >
                <Save className="w-4 h-4" />
                {isBn ? "সংরক্ষণ" : "Save"}
              </button>
            </div>
          </div>

          {/* Football Field */}
          <div className="lg:col-span-2">
            <div
              className="relative w-full aspect-[3/4] rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, #1a472a 0%, #2d5a3d 50%, #1a472a 100%)",
                boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)",
              }}
            >
              {/* Field markings */}
              <div className="absolute inset-4 border-2 border-white/40 rounded-lg">
                {/* Center line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/40" />
                {/* Center circle */}
                <div className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full" />
                {/* Penalty areas */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white/40" />
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white/40" />
                {/* Goal areas */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-20 h-6 border-2 border-t-0 border-white/40" />
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-20 h-6 border-2 border-b-0 border-white/40" />
              </div>

              {/* Player positions */}
              {fieldPositions.map(pos => (
                <div
                  key={pos.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(pos.id)}
                  className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  {pos.player ? (
                    <div className="relative group">
                      <div className="w-14 h-14 rounded-full bg-primary border-3 border-white flex items-center justify-center shadow-lg">
                        <span className="font-[var(--font-display)] text-xl text-primary-foreground">
                          {pos.player.number}
                        </span>
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                        {pos.player.name}
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(pos.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center bg-black/20">
                      <span className="text-white/50 text-2xl">+</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Lineups */}
        {savedLineups.length > 0 && (
          <div className="mt-8 p-4 rounded-xl border-2 border-secondary bg-card">
            <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সংরক্ষিত লাইনআপ" : "Saved Lineups"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedLineups.map((lineup, i) => (
                <button
                  key={i}
                  onClick={() => setFieldPositions(lineup.positions)}
                  className="px-4 py-2 text-sm rounded bg-secondary/50 text-foreground hover:bg-secondary transition"
                >
                  {lineup.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
