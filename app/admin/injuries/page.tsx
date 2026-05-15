"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Heart, Save, RefreshCw, Plus, X, AlertCircle } from "lucide-react"
import { dataStore, useDataStore } from "@/lib/data-store"

interface Injury {
  id: string
  playerId: string
  playerName: string
  injuryType: string
  injuryDate: string
  status: "active" | "recovering" | "recovered"
  recoveryProgress: number
  notes: string
}

export default function AdminInjuriesPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()

  const players = useDataStore(dataStore.getPlayers, "players")

  const [injuries, setInjuries] = useState<Injury[]>([
    {
      id: "1",
      playerId: "5",
      playerName: "Akash",
      injuryType: "Hamstring Strain",
      injuryDate: "2025-04-20",
      status: "recovering",
      recoveryProgress: 70,
      notes: "Light training resumed"
    },
    {
      id: "2",
      playerId: "7",
      playerName: "Shuvo",
      injuryType: "Ankle Sprain",
      injuryDate: "2025-04-28",
      status: "active",
      recoveryProgress: 25,
      notes: "Rest and ice treatment"
    }
  ])

  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState({
    playerId: "",
    injuryType: "",
    injuryDate: "",
    status: "active" as const,
    recoveryProgress: 0,
    notes: ""
  })

  const statusColors = {
    active: "bg-red-500/20 text-red-400 border-red-500/50",
    recovering: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    recovered: "bg-green-500/20 text-green-400 border-green-500/50"
  }

  const statusLabels = {
    active: isBn ? "সক্রিয় আঘাত" : "Active Injury",
    recovering: isBn ? "পুনরুদ্ধারাধীন" : "Recovering",
    recovered: isBn ? "সুস্থ" : "Recovered"
  }

  const handleAddInjury = () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন যোগ করতে পারে" : "Only admins can add")
      return
    }

    const playerList = Array.isArray(players) ? players : []
    const selectedPlayer = playerList.find((p: any) => p.id === formData.playerId)
    if (!selectedPlayer) {
      alert(isBn ? "খেলোয়াড় নির্বাচন করুন" : "Select a player")
      return
    }

    const newInjury: Injury = {
      id: Date.now().toString(),
      playerId: formData.playerId,
      playerName: selectedPlayer.name,
      injuryType: formData.injuryType,
      injuryDate: formData.injuryDate,
      status: formData.status,
      recoveryProgress: formData.recoveryProgress,
      notes: formData.notes
    }

    setInjuries([...injuries, newInjury])
    setFormData({
      playerId: "",
      injuryType: "",
      injuryDate: "",
      status: "active",
      recoveryProgress: 0,
      notes: ""
    })
    setShowForm(false)
    setHasChanges(true)
  }

  const handleUpdateInjury = () => {
    if (!selectedInjury) return

    const updated = injuries.map(inj =>
      inj.id === selectedInjury.id
        ? { ...selectedInjury, ...formData }
        : inj
    )
    setInjuries(updated)
    setSelectedInjury(null)
    setShowForm(false)
    setHasChanges(true)
  }

  const handleDeleteInjury = (id: string) => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন মুছতে পারে" : "Only admins can delete")
      return
    }
    setInjuries(injuries.filter(inj => inj.id !== id))
    setSelectedInjury(null)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!admin || admin.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }
    setHasChanges(false)
    alert(isBn ? "আঘাত রেকর্ড সফলভাবে সংরক্ষিত হয়েছে!" : "Injury records saved successfully!")
  }

  const injuryCounts = {
    active: injuries.filter(i => i.status === "active").length,
    recovering: injuries.filter(i => i.status === "recovering").length,
    recovered: injuries.filter(i => i.status === "recovered").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "আঘাত ট্র্যাকিং" : "Injury Tracking"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "খেলোয়াড় আঘাত এবং পুনরুদ্ধার পরিচালনা করুন" : "Manage player injuries and recovery"}
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border-2 border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-3xl font-bold text-red-400">{injuryCounts.active}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সক্রিয় আঘাত" : "Active Injuries"}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-2 border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-3xl font-bold text-yellow-400">{injuryCounts.recovering}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পুনরুদ্ধারাধীন" : "Recovering"}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-2 border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-green-400">{injuryCounts.recovered}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সুস্থ" : "Recovered"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Injuries List */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আঘাত রেকর্ড" : "Injury Records"}
            </h2>
            <button
              onClick={() => {
                setSelectedInjury(null)
                setFormData({
                  playerId: "",
                  injuryType: "",
                  injuryDate: "",
                  status: "active",
                  recoveryProgress: 0,
                  notes: ""
                })
                setShowForm(true)
              }}
              className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {injuries.map((injury) => (
              <button
                key={injury.id}
                onClick={() => {
                  setSelectedInjury(injury)
                  setFormData({
                    playerId: injury.playerId,
                    injuryType: injury.injuryType,
                    injuryDate: injury.injuryDate,
                    status: injury.status,
                    recoveryProgress: injury.recoveryProgress,
                    notes: injury.notes
                  })
                  setShowForm(true)
                }}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedInjury?.id === injury.id
                    ? "border-primary bg-primary/10"
                    : "border-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{injury.playerName}</div>
                    <div className="text-xs text-foreground/60">{injury.injuryType}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs border ${statusColors[injury.status]}`}>
                    {statusLabels[injury.status]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        {showForm && (
          <div className="lg:col-span-2 rounded-xl border-2 border-secondary bg-card p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {selectedInjury ? (isBn ? "আঘাত সম্পাদনা করুন" : "Edit Injury") : (isBn ? "নতুন আঘাত যোগ করুন" : "Add New Injury")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "খেলোয়াড়" : "Player"}
                </label>
                <select
                  value={formData.playerId}
                  onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent"
                >
                  <option value="">{isBn ? "খেলোয়াড় নির্বাচন করুন" : "Select player"}</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (#{p.num})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আঘাতের ধরন" : "Injury Type"}
                </label>
                <input
                  type="text"
                  value={formData.injuryType}
                  onChange={(e) => setFormData({ ...formData, injuryType: e.target.value })}
                  placeholder={isBn ? "যেমন: হ্যামস্ট্রিং স্ট্রেইন" : "e.g. Hamstring Strain"}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আঘাত তারিখ" : "Injury Date"}
                </label>
                <input
                  type="date"
                  value={formData.injuryDate}
                  onChange={(e) => setFormData({ ...formData, injuryDate: e.target.value })}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অবস্থা" : "Status"}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent"
                >
                  <option value="active">{statusLabels.active}</option>
                  <option value="recovering">{statusLabels.recovering}</option>
                  <option value="recovered">{statusLabels.recovered}</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "পুনরুদ্ধার অগ্রগতি (%)" : "Recovery Progress (%)"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.recoveryProgress}
                    onChange={(e) => setFormData({ ...formData, recoveryProgress: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-primary w-12 text-right">{formData.recoveryProgress}%</span>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "টীকা" : "Notes"}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isBn ? "চিকিৎসা বা পুনরুদ্ধার সম্পর্কে নোট লিখুন" : "Write treatment or recovery notes"}
                  rows={3}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedInjury(null)
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-secondary hover:border-primary text-foreground/70 hover:text-primary transition"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                {selectedInjury && (
                  <button
                    onClick={() => handleDeleteInjury(selectedInjury.id)}
                    className="px-4 py-2 rounded-lg border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 transition"
                  >
                    {isBn ? "মুছুন" : "Delete"}
                  </button>
                )}
                <button
                  onClick={selectedInjury ? handleUpdateInjury : handleAddInjury}
                  className="ml-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          <Save className="w-4 h-4" />
          {isBn ? "সংরক্ষণ করুন" : "Save All"}
        </button>
      </div>
    </div>
  )
}
