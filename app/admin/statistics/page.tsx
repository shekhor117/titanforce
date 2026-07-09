"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Save, RefreshCw, AlertCircle, BarChart3 } from "lucide-react"
import { dataStore, Statistics } from "@/lib/data-store"
import { PageEntrance } from '@/components/page-entrance'

export default function AdminStatisticsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [isClient, setIsClient] = useState(false)
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [formData, setFormData] = useState({
    totalPlayers: 0,
    totalWins: 0,
    totalTeams: 0,
    totalFans: 0,
    trophies: 0,
    matches: 0,
    goals: 0
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    loadStatistics()
  }, [])

  const loadStatistics = () => {
    try {
      const stats = dataStore.getStatistics()
      if (stats) {
        setStatistics(stats)
        setFormData({
          totalPlayers: stats.totalPlayers || 0,
          totalWins: stats.totalWins || 0,
          totalTeams: stats.totalTeams || 0,
          totalFans: stats.totalFans || 0,
          trophies: stats.trophies || 0,
          matches: stats.matches || 0,
          goals: stats.goals || 0
        })
      }
    } catch (err) {
      setError("Failed to load statistics")
    }
  }

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    setError(null)
  }

  const handleSave = () => {
    if (!admin || admin.role !== "admin") {
      setError(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }

    try {
      dataStore.updateStatistics({
        totalPlayers: formData.totalPlayers,
        totalWins: formData.totalWins,
        totalTeams: formData.totalTeams,
        totalFans: formData.totalFans,
        trophies: formData.trophies,
        matches: formData.matches,
        goals: formData.goals
      })

      setHasChanges(false)
      setSuccess(isBn ? "পরিসংখ্যান সংরক্ষিত হয়েছে!" : "Statistics saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
      loadStatistics()
    } catch (err) {
      setError("Failed to save statistics")
    }
  }

  const handleReset = () => {
    loadStatistics()
    setHasChanges(false)
    setError(null)
  }

  if (!isClient) return null

  const stats = [
    { label: isBn ? "মোট খেলোয়াড়" : "Total Players", key: "totalPlayers", icon: "👥" },
    { label: isBn ? "মোট জয়" : "Total Wins", key: "totalWins", icon: "🏆" },
    { label: isBn ? "মোট দল" : "Total Teams", key: "totalTeams", icon: "⚽" },
    { label: isBn ? "মোট ভক্ত" : "Total Fans", key: "totalFans", icon: "❤️" },
    { label: isBn ? "ট্রফি" : "Trophies", key: "trophies", icon: "🥇" },
    { label: isBn ? "ম্যাচ" : "Matches", key: "matches", icon: "📅" },
    { label: isBn ? "লক্ষ্য" : "Goals", key: "goals", icon: "⚡" }
  ]

  return (
    <PageEntrance>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground mb-2 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <BarChart3 className="w-8 h-8 text-accent" />
            {isBn ? "ক্লাব পরিসংখ্যান" : "Club Statistics"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "দলের প্রধান পরিসংখ্যান পরিচালনা করুন" : "Manage club statistics displayed on homepage"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 text-green-200">
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.key} className="rounded-lg border-2 border-secondary bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <input
                type="number"
                min="0"
                value={formData[stat.key as keyof typeof formData]}
                onChange={(e) => handleInputChange(stat.key, parseInt(e.target.value) || 0)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent text-lg font-bold"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isBn ? "সংরক্ষণ করুন" : "Save"}
          </button>
          <button
            onClick={handleReset}
            className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            {isBn ? "রিসেট করুন" : "Reset"}
          </button>
        </div>

        {/* Current Stats Preview */}
        {statistics && (
          <div className="rounded-xl border-2 border-secondary/50 bg-secondary/20 p-6">
            <h2 className={`text-lg font-bold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "বর্তমান মান" : "Current Statistics"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div key={stat.key}>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-accent">{statistics[stat.key as keyof Statistics] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageEntrance>
  )
}
