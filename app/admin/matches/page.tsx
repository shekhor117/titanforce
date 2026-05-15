"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Match, useDataStore } from "@/lib/data-store"
import { Plus, Edit, Trash2, X, Save, Calendar, MapPin, Search } from "lucide-react"

export default function AdminMatches() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "completed">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    home: "Titan Force",
    away: "",
    date: "",
    time: "",
    venue: "Mulikandi Ground",
    homeScore: "",
    awayScore: "",
    status: "upcoming" as Match["status"],
    result: "" as Match["result"] | "",
  })
  
  const matchesData = useDataStore(dataStore.getMatches, "matches")
  const matches = Array.isArray(matchesData) ? matchesData : []

  const handleSaveMatch = () => {
    if (!formData.away || !formData.date || !formData.venue) {
      alert(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all required fields")
      return
    }

    // Calculate result based on scores
    let result: Match["result"] | undefined
    if (formData.status === "completed" && formData.homeScore && formData.awayScore) {
      const homeScore = parseInt(formData.homeScore)
      const awayScore = parseInt(formData.awayScore)
      if (homeScore > awayScore) result = "W"
      else if (homeScore < awayScore) result = "L"
      else result = "D"
    }

    const matchData: Omit<Match, "id"> = {
      home: formData.home,
      away: formData.away,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      homeScore: formData.homeScore ? parseInt(formData.homeScore) : null,
      awayScore: formData.awayScore ? parseInt(formData.awayScore) : null,
      status: formData.status,
      result,
    }

    if (editingMatch) {
      dataStore.updateMatch(editingMatch.id, matchData)
    } else {
      dataStore.addMatch(matchData)
    }
    
    resetForm()
  }

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match)
    setFormData({
      home: match.home,
      away: match.away,
      date: match.date,
      time: match.time,
      venue: match.venue,
      homeScore: match.homeScore?.toString() || "",
      awayScore: match.awayScore?.toString() || "",
      status: match.status,
      result: match.result || "",
    })
    setShowForm(true)
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm(isBn ? "এই ম্যাচ মুছতে চান?" : "Delete this match?")) return
    dataStore.deleteMatch(matchId)
  }

  const resetForm = () => {
    setFormData({
      home: "Titan Force",
      away: "",
      date: "",
      time: "",
      venue: "Mulikandi Ground",
      homeScore: "",
      awayScore: "",
      status: "upcoming",
      result: "",
    })
    setShowForm(false)
    setEditingMatch(null)
  }

  const filteredMatches = matches
    .filter(m => filter === "all" || m.status === filter)
    .filter(m => 
      searchTerm === "" || 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const statusBadge = (status: Match["status"]) => {
    const styles = {
      upcoming: "bg-yellow-500/20 text-yellow-400",
      live: "bg-red-500/20 text-red-400 animate-pulse",
      completed: "bg-green-500/20 text-green-400",
    }
    const labels = {
      upcoming: isBn ? "আসন্ন" : "Upcoming",
      live: isBn ? "লাইভ" : "LIVE",
      completed: isBn ? "সম্পন্ন" : "Completed",
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const resultBadge = (result: Match["result"]) => {
    if (!result) return null
    const styles = {
      W: "bg-green-500/20 text-green-400",
      L: "bg-red-500/20 text-red-400",
      D: "bg-yellow-500/20 text-yellow-400",
    }
    const labels = {
      W: isBn ? "জয়" : "Win",
      L: isBn ? "হার" : "Loss",
      D: isBn ? "ড্র" : "Draw",
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[result]}`}>
        {labels[result]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ম্যাচ ব্যবস্থাপনা" : "Match Management"}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            {matches.length} {isBn ? "টি ম্যাচ" : "matches"}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "ম্যাচ যোগ করুন" : "Add Match"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "খোঁজ করুন..." : "Search matches..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "upcoming", "live", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              }`}
            >
              {tab === "all" && (isBn ? "সব" : "All")}
              {tab === "upcoming" && (isBn ? "আসন্ন" : "Upcoming")}
              {tab === "live" && (isBn ? "লাইভ" : "Live")}
              {tab === "completed" && (isBn ? "সম্পন্ন" : "Completed")}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingMatch 
                ? (isBn ? "ম্যাচ সম্পাদনা" : "Edit Match")
                : (isBn ? "নতুন ম্যাচ" : "New Match")
              }
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isBn ? "হোম টিম" : "Home Team"}
                value={formData.home}
                onChange={(e) => setFormData((prev) => ({ ...prev, home: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "অ্যাওয়ে টিম" : "Away Team"}
                value={formData.away}
                onChange={(e) => setFormData((prev) => ({ ...prev, away: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "তারিখ (যেমন: Jan 15, 2025)" : "Date (e.g. Jan 15, 2025)"}
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "সময় (যেমন: 4:00 PM)" : "Time (e.g. 4:00 PM)"}
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "স্থান" : "Venue"}
                value={formData.venue}
                onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Match["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="upcoming">{isBn ? "আসন্ন" : "Upcoming"}</option>
                <option value="live">{isBn ? "লাইভ" : "Live"}</option>
                <option value="completed">{isBn ? "সম্পন্ন" : "Completed"}</option>
              </select>
              {(formData.status === "completed" || formData.status === "live") && (
                <>
                  <input
                    type="number"
                    placeholder={isBn ? "হোম স্কোর" : "Home Score"}
                    value={formData.homeScore}
                    onChange={(e) => setFormData((prev) => ({ ...prev, homeScore: e.target.value }))}
                    className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                  <input
                    type="number"
                    placeholder={isBn ? "অ্যাওয়ে স্কোর" : "Away Score"}
                    value={formData.awayScore}
                    onChange={(e) => setFormData((prev) => ({ ...prev, awayScore: e.target.value }))}
                    className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveMatch}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {editingMatch ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
              </button>
              <button
                onClick={resetForm}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div key={match.id} className="rounded-xl border-2 border-secondary bg-card p-6 hover:border-primary transition">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {statusBadge(match.status)}
                  {resultBadge(match.result)}
                </div>
                <div className="flex items-center gap-4 text-lg font-semibold">
                  <span>{match.home}</span>
                  <span className="text-primary">
                    {match.status === "completed" || match.status === "live"
                      ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
                      : "vs"
                    }
                  </span>
                  <span>{match.away}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {match.date} {match.time && `at ${match.time}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {match.venue}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditMatch(match)}
                  className="p-2 rounded hover:bg-primary/20 transition text-primary"
                  title={isBn ? "সম্পাদনা করুন" : "Edit"}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMatch(match.id)}
                  className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                  title={isBn ? "মুছুন" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMatches.length === 0 && (
          <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন ম্যাচ পাওয়া যায়নি" : "No matches found"}
            </p>
            <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নতুন ম্যাচ যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new match"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
