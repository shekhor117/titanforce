"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { ToggleLeft, ToggleRight, Save, RefreshCw, Download, Upload, AlertCircle } from "lucide-react"

interface Feature {
  id: string
  name: string
  nameBn: string
  description: string
  descriptionBn: string
  enabled: boolean
  category: "tools" | "analytics" | "engagement"
}

const defaultFeatures: Feature[] = [
  { id: "lineup-builder", name: "Lineup Builder", nameBn: "লাইনআপ বিল্ডার", description: "Allow users to create custom team lineups", descriptionBn: "ব্যবহারকারীদের কাস্টম দল লাইনআপ তৈরি করতে দিন", enabled: true, category: "tools" },
  { id: "tactical-board", name: "Tactical Board", nameBn: "ট্যাকটিক্যাল বোর্ড", description: "Interactive tactical planning board", descriptionBn: "ইন্টারেক্টিভ ট্যাকটিক্যাল পরিকল্পনা বোর্ড", enabled: true, category: "tools" },
  { id: "match-voting", name: "Match Voting", nameBn: "ম্যাচ ভোটিং", description: "Allow fans to vote on match predictions", descriptionBn: "ভক্তদের ম্যাচ ভবিষ্যদ্বাণীতে ভোট দিতে দিন", enabled: true, category: "engagement" },
  { id: "player-ranking", name: "Player Ranking", nameBn: "খেলোয়াড় র‌্যাংকিং", description: "Display player performance rankings", descriptionBn: "খেলোয়াড়ের পারফরম্যান্স র‌্যাংকিং দেখান", enabled: true, category: "analytics" },
  { id: "training-chart", name: "Training Performance", nameBn: "প্রশিক্ষণ পারফরম্যান্স", description: "Show training performance charts", descriptionBn: "প্রশিক্ষণ পারফরম্যান্স চার্ট দেখান", enabled: true, category: "analytics" },
  { id: "injury-tracking", name: "Injury Tracking", nameBn: "ইনজুরি ট্র্যাকিং", description: "Track and display player injuries", descriptionBn: "খেলোয়াড়ের ইনজুরি ট্র্যাক করুন এবং দেখান", enabled: true, category: "analytics" },
  { id: "fan-membership", name: "Fan Membership", nameBn: "ভক্ত সদস্যতা", description: "Allow fans to register as members", descriptionBn: "ভক্তদের সদস্য হিসাবে নিবন্ধন করতে দিন", enabled: true, category: "engagement" },
  { id: "photo-upload", name: "Photo Upload", nameBn: "ফটো আপলোড", description: "Allow users to upload photos", descriptionBn: "ব্যবহারকারীদের ফটো আপলোড করতে দিন", enabled: true, category: "engagement" },
]

export default function AdminFeaturesPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures)
  const [hasChanges, setHasChanges] = useState(false)

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In a real app, this would save to database
    localStorage.setItem("titanforce_features", JSON.stringify(features))
    setHasChanges(false)
    alert(isBn ? "সেটিংস সংরক্ষিত!" : "Settings saved!")
  }

  const handleReset = () => {
    setFeatures(defaultFeatures)
    setHasChanges(true)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(features, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `titanforce_features_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported) && imported.length > 0) {
          setFeatures(imported)
          setHasChanges(true)
          alert(isBn ? "বৈশিষ্ট্য সফলভাবে আমদানি করা হয়েছে!" : "Features imported successfully!")
        } else {
          alert(isBn ? "অবৈধ ফাইল ফরম্যাট" : "Invalid file format")
        }
      } catch (error) {
        alert(isBn ? "ফাইল পার্স ত্রুটি" : "File parse error")
      }
    }
    reader.readAsText(file)
  }

  const categories = [
    { key: "tools", label: isBn ? "সরঞ্জাম" : "Tools", icon: "🔧" },
    { key: "analytics", label: isBn ? "বিশ্লেষণ" : "Analytics", icon: "📊" },
    { key: "engagement", label: isBn ? "এনগেজমেন্ট" : "Engagement", icon: "👥" },
  ]

  return (
    <FeatureProtectedRoute featureName="Feature Management" category="tools">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "বৈশিষ্ট্য ব্যবস্থাপনা" : "Feature Management"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ওয়েবসাইটের বৈশিষ্ট্যগুলি চালু/বন্ধ করুন" : "Enable or disable website features"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:border-primary hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
            {isBn ? "রিসেট" : "Reset"}
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:border-primary hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Download className="w-4 h-4" />
            {isBn ? "রপ্তানি" : "Export"}
          </button>
          <label className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:border-primary hover:text-primary transition cursor-pointer ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <Upload className="w-4 h-4" />
            {isBn ? "আমদানি" : "Import"}
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Save className="w-4 h-4" />
            {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Feature Categories */}
      {categories.map((category) => (
        <div key={category.key} className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
          <div className="px-6 py-4 bg-secondary/30 border-b border-secondary">
            <h2 className={`text-xl font-bold text-foreground flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <span>{category.icon}</span>
              {category.label}
            </h2>
          </div>
          <div className="divide-y divide-secondary">
            {features.filter(f => f.category === category.key).map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition">
                <div className="flex-1">
                  <h3 className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? feature.nameBn : feature.name}
                  </h3>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? feature.descriptionBn : feature.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-2 rounded transition ${feature.enabled ? "text-green-400 hover:bg-green-500/20" : "text-foreground/40 hover:bg-secondary"}`}
                >
                  {feature.enabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{features.length}</div>
          <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট বৈশিষ্ট্য" : "Total Features"}
          </div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{features.filter(f => f.enabled).length}</div>
          <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "চালু" : "Enabled"}
          </div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{features.filter(f => !f.enabled).length}</div>
          <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "বন্ধ" : "Disabled"}
          </div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className={`text-2xl font-bold ${hasChanges ? "text-yellow-400" : "text-foreground/40"}`}>
            {hasChanges ? (isBn ? "হ্যাঁ" : "Yes") : (isBn ? "না" : "No")}
          </div>
          <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "পরিবর্তন" : "Changes"}
          </div>
        </div>
        <div className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{Math.round((features.filter(f => f.enabled).length / features.length) * 100)}%</div>
          <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সক্রিয়তা" : "Active"}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className={`font-semibold text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সহায়তা এবং টিপস" : "Help & Tips"}
            </h3>
            <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "বৈশিষ্ট্য টগেল করুন প্রতিটি বিভাগে, পরিবর্তন সংরক্ষণ করুন, এবং আপনার কনফিগারেশন এক্সপোর্ট করুন ব্যাকআপের জন্য।" : "Toggle features in each category, save your changes, and export your configuration for backup."}
            </p>
          </div>
        </div>
      </div>
            {isBn ? "অসংরক্ষিত পরিবর্তন" : "Unsaved Changes"}
          </div>
        </div>
      </div>
      </div>
    </FeatureProtectedRoute>
  )
}
