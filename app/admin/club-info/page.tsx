"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Save, RefreshCw, AlertCircle, MapPin, Heart, Trophy, Users } from "lucide-react"
import type { ClubInfo } from "@/lib/data-store"
import { PageEntrance } from '@/components/page-entrance'

export default function AdminClubInfoPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [isClient, setIsClient] = useState(false)
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  const [formData, setFormData] = useState({ founded: "", homeGround: "", motto: "", community: "" })
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    loadClubInfo()
  }, [])

  const loadClubInfo = async () => {
    try {
      const response = await fetch("/api/admin/club_info", { credentials: "include" })
      if (!response.ok) throw new Error("Failed to load club info")
      const rows = await response.json() as Array<{ id: string; key: string; value: string | null }>
      const values = Object.fromEntries(rows.map((row) => [row.key, row.value ?? ""]))
      const info = {
        founded: values.founded ?? "",
        homeGround: values.homeGround ?? "",
        motto: values.motto ?? "",
        community: values.community ?? "",
      }
      setClubInfo(info as ClubInfo)
      setFormData(info)
    } catch (err) {
      setError("Failed to load club info")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    setError(null)
  }

  const handleSave = async () => {
    if (!admin || !["admin", "super_admin"].includes(admin.role)) {
      setError(isBn ? "শুধুমাত্র অ্যাডমিন সংরক্ষণ করতে পারে" : "Only admins can save")
      return
    }

    try {
      if (!formData.founded || !formData.homeGround || !formData.motto || !formData.community) {
        setError(isBn ? "সমস্ত ক্ষেত্র পূরণ করুন" : "All fields are required")
        return
      }

      const response = await fetch("/api/admin/club_info", { credentials: "include" })
      if (!response.ok) throw new Error("Failed to load existing rows")
      const existing = await response.json() as Array<{ id: string; key: string }>
      const byKey = new Map(existing.map((row) => [row.key, row.id]))
      await Promise.all(Object.entries({
        founded: formData.founded,
        homeGround: formData.homeGround,
        motto: formData.motto,
        community: formData.community,
      }).map(async ([key, value]) => {
        const id = byKey.get(key)
        const result = await fetch("/api/admin/club_info", {
          method: id ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id ? { id, value } : { key, value }),
        })
        if (!result.ok) throw new Error("Failed to save club info")
      }))

      setHasChanges(false)
      setSuccess(isBn ? "ক্লাব তথ্য সংরক্ষিত হয়েছে!" : "Club info saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
      await loadClubInfo()
    } catch (err) {
      setError("Failed to save club info")
    }
  }

  const handleReset = () => {
    loadClubInfo()
    setHasChanges(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <PageEntrance>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ক্লাব তথ্য" : "Club Information"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ক্লাবের তথ্য এবং পরিচয় পরিচালনা করুন" : "Manage club information and identity"}
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
            <Trophy className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6 space-y-6">
          {/* Founded Year */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? "প্রতিষ্ঠিত বছর" : "Founded Year"}</label>
            <input
              type="text"
              value={formData.founded}
              onChange={(e) => handleInputChange("founded", e.target.value)}
              placeholder="e.g., 2025"
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          {/* Home Ground */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              {isBn ? "হোম গ্রাউন্ড" : "Home Ground"}
            </label>
            <input
              type="text"
              value={formData.homeGround}
              onChange={(e) => handleInputChange("homeGround", e.target.value)}
              placeholder="e.g., Mulikandi"
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          {/* Motto */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              {isBn ? "মূলমন্ত্র" : "Motto"}
            </label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => handleInputChange("motto", e.target.value)}
              placeholder="e.g., One Team, One Dream"
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          {/* Community */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              {isBn ? "সম্প্রদায়" : "Community"}
            </label>
            <input
              type="text"
              value={formData.community}
              onChange={(e) => handleInputChange("community", e.target.value)}
              placeholder="e.g., Stronger Together"
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
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
        </div>

        {/* Current Values Display */}
        {clubInfo && (
          <div className="rounded-xl border-2 border-secondary/50 bg-secondary/20 p-6">
            <h2 className={`text-lg font-bold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "বর্তমান মান" : "Current Values"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isBn ? "প্রতিষ্ঠিত" : "Founded"}</p>
                <p className="text-foreground font-semibold">{clubInfo.founded}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isBn ? "হোম গ্রাউন্ড" : "Home Ground"}</p>
                <p className="text-foreground font-semibold">{clubInfo.homeGround}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isBn ? "মূলমন্ত্র" : "Motto"}</p>
                <p className="text-foreground font-semibold">{clubInfo.motto}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isBn ? "সম্প্রদায়" : "Community"}</p>
                <p className="text-foreground font-semibold">{clubInfo.community}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageEntrance>
  )
}
