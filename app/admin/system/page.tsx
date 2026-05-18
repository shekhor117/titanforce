"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { dataStore, ActivityLog } from "@/lib/data-store"
import { 
  Download, Upload, RefreshCw, Trash2, Database, HardDrive, 
  Clock, Activity, Shield, AlertTriangle, CheckCircle, X, FileJson, Settings
} from "lucide-react"

export default function AdminSystemPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearType, setClearType] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  // Get stats using sync methods
  const [stats, setStats] = useState({
    players: 0,
    matches: 0,
    fans: 0,
    partners: 0,
    activityLog: 0
  })

  useEffect(() => {
    setIsClient(true)
    setStats({
      players: (dataStore.getPlayers() || []).length,
      matches: (dataStore.getMatches() || []).length,
      fans: (dataStore.getFans() || []).length,
      partners: (dataStore.getPartners() || []).length,
      activityLog: (dataStore.getActivityLog() || []).length
    })
  }, [])
  const news = dataStore.getNews()
  const media = dataStore.getMedia()
  const users = dataStore.getAdminUsers()
  const activityLog = dataStore.getActivityLog() || []

  // Export data
  const handleExport = () => {
    try {
      const data = dataStore.exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `titanforce-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (err) {
      setError(isBn ? "এক্সপোর্ট ব্যর্থ হয়েছে" : "Export failed")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Import data
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      setError("")
      
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      if (!data.exportDate) {
        throw new Error(isBn ? "অবৈধ ব্যাকআপ ফাইল" : "Invalid backup file")
      }

      // Confirm import
      if (!confirm(isBn 
        ? "এটি বিদ্যমান সমস্ত ডেটা প্রতিস্থাপন করবে। আপনি কি নিশ্চিত?" 
        : "This will replace all existing data. Are you sure?")) {
        return
      }

      dataStore.importAllData(data)
      setImportSuccess(true)
      setTimeout(() => setImportSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isBn ? "ইম্পোর্ট ব্যর্থ হয়েছে" : "Import failed"))
      setTimeout(() => setError(""), 3000)
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Clear specific data
  const handleClear = (type: string) => {
    setClearType(type)
    setShowClearConfirm(true)
  }

  const confirmClear = () => {
    switch (clearType) {
      case "players":
        dataStore.setPlayers([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all players" })
        break
      case "matches":
        dataStore.setMatches([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all matches" })
        break
      case "fans":
        dataStore.setFans([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all fans" })
        break
      case "partners":
        dataStore.setPartners([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all partners" })
        break
      case "news":
        dataStore.setNews([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all news" })
        break
      case "media":
        dataStore.setMedia([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all media" })
        break
      case "contacts":
        dataStore.setContacts([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all contacts" })
        break
      case "users":
        dataStore.setAdminUsers([])
        dataStore.addActivityLog({ action: "delete", entity: "system", description: "Cleared all users" })
        break
      case "activity":
        dataStore.clearActivityLog()
        break
      case "all":
        dataStore.resetToDefaults()
        break
    }
    setShowClearConfirm(false)
    setClearType("")
  }

  // Format activity time
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "bg-green-500/20 text-green-400"
      case "update": return "bg-blue-500/20 text-blue-400"
      case "delete": return "bg-red-500/20 text-red-400"
      case "login": return "bg-purple-500/20 text-purple-400"
      case "export": return "bg-yellow-500/20 text-yellow-400"
      case "import": return "bg-cyan-500/20 text-cyan-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  const dataCategories = [
    { key: "players", label: isBn ? "খেলোয়াড়" : "Players", count: stats.players, color: "text-blue-400" },
    { key: "matches", label: isBn ? "ম্যাচ" : "Matches", count: stats.matches, color: "text-yellow-400" },
    { key: "fans", label: isBn ? "অনুরাগী" : "Fans", count: stats.fans, color: "text-green-400" },
    { key: "partners", label: isBn ? "অংশীদার" : "Partners", count: stats.partners, color: "text-purple-400" },
    { key: "news", label: isBn ? "সংবাদ" : "News", count: stats.news, color: "text-orange-400" },
    { key: "media", label: isBn ? "মিডিয়া" : "Media", count: stats.media, color: "text-pink-400" },
    { key: "contacts", label: isBn ? "বার্তা" : "Messages", count: stats.contacts, color: "text-cyan-400" },
    { key: "users", label: isBn ? "ব্যবহারকারী" : "Users", count: stats.users, color: "text-red-400" },
  ]

  return (
    <FeatureProtectedRoute featureName="System Settings" category="tools">
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "সিস্টেম কন্ট্রোল" : "System Control"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ব্যাকআপ, এক্সপোর্ট, ইম্পোর্ট এবং সিস্টেম ম্যানেজমেন্ট" : "Backup, export, import and system management"}
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {exportSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{isBn ? "ডেটা সফলভাবে এক্সপোর্ট করা হয়েছে!" : "Data exported successfully!"}</span>
        </div>
      )}
      {importSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{isBn ? "ডেটা সফলভাবে ইম্পোর্ট করা হয়েছে!" : "Data imported successfully!"}</span>
        </div>
      )}

      {/* Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-red-500 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h3 className={`font-[var(--font-display)] text-xl text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সতর্কতা" : "Warning"}
              </h3>
            </div>
            <p className={`text-foreground/80 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {clearType === "all" 
                ? (isBn ? "এটি সমস্ত ডেটা মুছে ফেলবে এবং ডিফল্টে রিসেট করবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।" : "This will delete all data and reset to defaults. This action cannot be undone.")
                : (isBn ? `এটি সমস্ত ${clearType} ডেটা মুছে ফেলবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।` : `This will delete all ${clearType} data. This action cannot be undone.`)
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmClear}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Trash2 className="w-4 h-4" />
                {isBn ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Backup & Restore */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ব্যাকআপ ও রিস্টোর" : "Backup & Restore"}
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Export */}
            <div className="p-4 rounded-lg bg-secondary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ডেটা এক্সপোর্ট" : "Export Data"}
                  </h3>
                  <p className={`text-sm text-foreground/60 mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সমস্ত ডেটা JSON ফাইল হিসাবে ডাউনলোড করুন" : "Download all data as a JSON file"}
                  </p>
                  <button
                    onClick={handleExport}
                    className={`flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  >
                    <FileJson className="w-4 h-4" />
                    {isBn ? "এক্সপোর্ট করুন" : "Export Backup"}
                  </button>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="p-4 rounded-lg bg-secondary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-foreground mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ডেটা ইম্পোর্ট" : "Import Data"}
                  </h3>
                  <p className={`text-sm text-foreground/60 mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ব্যাকআপ ফাইল থেকে ডেটা পুনরুদ্ধার করুন" : "Restore data from a backup file"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    disabled={importing}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    className={`flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  >
                    <FileJson className="w-4 h-4" />
                    {importing ? (isBn ? "ইম্পোর্ট হচ্ছে..." : "Importing...") : (isBn ? "ইম্পোর্ট করুন" : "Import Backup")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Overview */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <HardDrive className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ডেটা ওভারভিউ" : "Data Overview"}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dataCategories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${cat.color}`}>{cat.count}</span>
                  <span className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{cat.label}</span>
                </div>
                <button
                  onClick={() => handleClear(cat.key)}
                  className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition"
                  title={isBn ? "মুছুন" : "Clear"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "কার্যকলাপ লগ" : "Activity Log"}
            </h2>
          </div>
          <button
            onClick={() => handleClear("activity")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm text-red-400 hover:bg-red-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Trash2 className="w-4 h-4" />
            {isBn ? "লগ মুছুন" : "Clear Log"}
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {activityLog.length > 0 ? (
            activityLog.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                <div className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getActionColor(log.action)}`}>
                  {log.action}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{log.description}</p>
                  <p className="text-xs text-foreground/50 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatActivityTime(log.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-foreground/50">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "কোনো কার্যকলাপ রেকর্ড নেই" : "No activity recorded"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "বিপজ্জনক জোন" : "Danger Zone"}
          </h2>
        </div>
        
        <p className={`text-sm text-foreground/70 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn 
            ? "এই অ্যাকশনগুলি পূর্বাবস্থায় ফেরানো যাবে না। সাবধানে ব্যবহার করুন।" 
            : "These actions cannot be undone. Use with caution."}
        </p>

        <button 
          onClick={() => handleClear("all")}
          className={`flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <RefreshCw className="w-4 h-4" />
          {isBn ? "সমস্ত ডেটা রিসেট করুন" : "Reset All Data to Defaults"}
        </button>
      </div>
      </div>
    </FeatureProtectedRoute>
  )
}
