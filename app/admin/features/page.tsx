"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { ToggleLeft, ToggleRight, Save, RefreshCw, Download, Upload, AlertCircle, Plus, Trash2, Edit2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PageEntrance } from '@/components/page-entrance'

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
  const [showModal, setShowModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [formData, setFormData] = useState<Feature>({
    id: "",
    name: "",
    nameBn: "",
    description: "",
    descriptionBn: "",
    enabled: true,
    category: "tools",
  })

  useEffect(() => {
    loadFeaturesFromSupabase()
  }, [])

  const openCreateModal = () => {
    setEditingFeature(null)
    setFormData({
      id: "",
      name: "",
      nameBn: "",
      description: "",
      descriptionBn: "",
      enabled: true,
      category: "tools",
    })
    setShowModal(true)
  }

  const openEditModal = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData(feature)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingFeature(null)
  }

  const handleSaveFeature = () => {
    if (!formData.id.trim() || !formData.name.trim() || !formData.nameBn.trim()) {
      alert(isBn ? "সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন" : "Please fill in all required fields")
      return
    }

    if (editingFeature) {
      // Update existing feature
      setFeatures(features.map(f => f.id === editingFeature.id ? formData : f))
    } else {
      // Check for duplicate ID
      if (features.some(f => f.id === formData.id)) {
        alert(isBn ? "এই আইডি ইতিমধ্যে বিদ্যমান" : "This ID already exists")
        return
      }
      // Create new feature
      setFeatures([...features, formData])
    }

    setHasChanges(true)
    closeModal()
  }

  const handleDeleteFeature = (id: string) => {
    if (confirm(isBn ? "এই বৈশিষ্ট্যটি মুছতে নিশ্চিত?" : "Are you sure you want to delete this feature?")) {
      setFeatures(features.filter(f => f.id !== id))
      setHasChanges(true)
    }
  }

  const loadFeaturesFromSupabase = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return
      
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .like("key", "feature_%")

      if (error) throw error

      // Merge Supabase settings with default features
      if (data && data.length > 0) {
        const loadedFeatures = features.map(feature => {
          const setting = data.find(d => d.key === `feature_${feature.id}`)
          return setting ? { ...feature, enabled: setting.value.enabled } : feature
        })
        setFeatures(loadedFeatures)
      }
    } catch (error) {
      // Fall back to default features
    }
  }

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return
      
      // Save each feature to site_settings table
      for (const feature of features) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({
            key: `feature_${feature.id}`,
            value: { enabled: feature.enabled, ...feature }
          }, { onConflict: "key" })
        
        if (error) throw error
      }
      
      setHasChanges(false)
      alert(isBn ? "সেটিংস সংরক্ষিত!" : "Settings saved!")
    } catch (error) {
      alert(isBn ? "ত্রুটি হয়েছে" : "Error saving settings")
    }
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
            onClick={openCreateModal}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600/10 border-2 border-green-600 text-green-500 rounded hover:bg-green-600/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Plus className="w-4 h-4" />
            {isBn ? "নতুন বৈশিষ্ট্য" : "New Feature"}
          </button>
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
            {isBn ? "রিসেট" : "Reset"}
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Download className="w-4 h-4" />
            {isBn ? "রপ্তানি" : "Export"}
          </button>
          <label className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary text-foreground/70 rounded hover:text-primary transition cursor-pointer ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
          <div className="neo-btn neo-soft px-4 py-2 bg-secondary/30 border-b border-secondary">
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(feature)}
                    className="p-2 rounded transition text-blue-400 hover:bg-blue-500/20"
                    title={isBn ? "সম্পাদনা" : "Edit"}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFeature(feature.id)}
                    className="p-2 rounded transition text-red-400 hover:bg-red-500/20"
                    title={isBn ? "মুছুন" : "Delete"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border-2 border-secondary w-full max-w-md max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-secondary px-6 py-4 flex items-center justify-between">
              <h2 className={`text-xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {editingFeature ? (isBn ? "বৈশিষ্ট্য সম্পাদনা করুন" : "Edit Feature") : (isBn ? "নতুন বৈশিষ্ট্য তৈরি করুন" : "Create New Feature")}
              </h2>
              <button onClick={closeModal} className="text-foreground/60 hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আইডি" : "ID"}
                  {!editingFeature && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!editingFeature}
                  placeholder="feature-id"
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground disabled:opacity-50"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নাম (ইংরেজি)" : "Name (English)"} <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Feature Name"
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নাম (বাংলা)" : "Name (Bengali)"} <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="বৈশিষ্ট্য নাম"
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Feature Description"
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground"
                  rows={2}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "বিবরণ (বাংলা)" : "Description (Bengali)"}
                </label>
                <textarea
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="বৈশিষ্ট্য বিবরণ"
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground"
                  rows={2}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "বিভাগ" : "Category"}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as "tools" | "analytics" | "engagement" })}
                  className="w-full px-3 py-2 neo-input rounded bg-secondary/20 text-foreground"
                >
                  <option value="tools">{isBn ? "সরঞ্জাম" : "Tools"}</option>
                  <option value="analytics">{isBn ? "বিশ্লেষণ" : "Analytics"}</option>
                  <option value="engagement">{isBn ? "এনগেজমেন্ট" : "Engagement"}</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label className={`text-sm text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "সক্ষম করা" : "Enabled"}
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveFeature}
                  className={`flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
                </button>
                <button
                  onClick={closeModal}
                  className={`flex-1 px-4 py-2 neo-input text-foreground rounded hover:bg-secondary/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeatureProtectedRoute>
  )
}
