"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Player } from "@/lib/data-store"
import { usePlayers } from "@/lib/use-data-store"
import { getDataService } from "@/lib/data-service"
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, X, Save, Search, Trophy, TrendingUp, Activity, Target } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const searchParams = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [filter, setFilter] = useState<"all" | "GK" | "DEF" | "MID" | "FWD">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    email: "",
    num: "",
    pos: "",
    cat: "" as Player["cat"] | "",
    age: "",
    hometown: "",
    foot: "Right" as Player["foot"],
    goals: "0",
    assists: "0",
    cleanSheets: "0",
    bio: "",
    photo: { signedUrl: "", filePath: "" },
    status: "active" as Player["status"],
    // Personal Dates
    dateOfBirth: "",
    joinDate: "",
    seasonYear: "2024-2025",
    // Extended Stats
    appearances: "0",
    minutes: "0",
    passAccuracy: "0",
    chancesCreated: "0",
    // Season Stats
    premierMatches: "0",
    cupMatches: "0",
    yellowCards: "0",
    redCards: "0",
    motmAwards: "0",
    averageRating: "0",
    // Player Attributes
    pace: "70",
    shooting: "70",
    passing: "70",
    dribbling: "70",
    defending: "70",
    physical: "70",
    // Trophies
    trophies: [] as { name: string; year: string }[],
  })
  const [newTrophy, setNewTrophy] = useState({ name: "", year: "" })
  
  const players = usePlayers()

  const handlePhotoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, photo: data }))
  }

  const handlePhotoDelete = () => {
    setFormData((prev) => ({ ...prev, photo: { signedUrl: "", filePath: "" } }))
  }

  const handleEditPlayer = (player: Player) => {
    // Only admin can edit players
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় সম্পাদনা করতে পারে" : "Only admins can edit players")
      return
    }

    setEditingPlayer(player)
    setFormData({
      name: player.name,
      fullName: player.fullName,
      email: "",
      num: player.num.toString(),
      pos: player.pos,
      cat: player.cat,
      age: player.age.toString(),
      hometown: player.hometown,
      foot: player.foot,
      goals: player.goals.toString(),
      assists: player.assists.toString(),
      cleanSheets: player.cleanSheets?.toString() || "0",
      bio: player.bio,
      photo: { signedUrl: player.photo || "", filePath: "" },
      status: player.status,
      // Personal Dates
      dateOfBirth: player.dateOfBirth || "",
      joinDate: player.joinDate || "",
      seasonYear: player.seasonYear || "2024-2025",
      // Extended Stats
      appearances: player.appearances?.toString() || "0",
      minutes: player.minutes?.toString() || "0",
      passAccuracy: player.passAccuracy?.toString() || "0",
      chancesCreated: player.chancesCreated?.toString() || "0",
      // Season Stats
      premierMatches: player.premierMatches?.toString() || "0",
      cupMatches: player.cupMatches?.toString() || "0",
      yellowCards: player.yellowCards?.toString() || "0",
      redCards: player.redCards?.toString() || "0",
      motmAwards: player.motmAwards?.toString() || "0",
      averageRating: player.averageRating?.toString() || "0",
      // Player Attributes
      pace: player.pace?.toString() || "70",
      shooting: player.shooting?.toString() || "70",
      passing: player.passing?.toString() || "70",
      dribbling: player.dribbling?.toString() || "70",
      defending: player.defending?.toString() || "70",
      physical: player.physical?.toString() || "70",
      // Trophies
      trophies: player.trophies || [],
    })
    setShowForm(true)
  }

  // Handle URL parameters to auto-edit a player
  useEffect(() => {
    const editParam = searchParams.get("edit")
    if (editParam) {
      const playerNum = parseInt(editParam)
      const playerToEdit = players.find((p) => p.num === playerNum)
      if (playerToEdit) {
        handleEditPlayer(playerToEdit)
      }
    }
  }, [searchParams, players])

  const handleSavePlayer = async () => {
    // Only admin can save players
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় সংরক্ষণ করতে পারে" : "Only admins can save players")
      return
    }

    if (!formData.name || !formData.num || !formData.cat) {
      alert(isBn ? "নাম, নম্বর এবং ক্যাটাগরি প্রয়োজন" : "Name, number and category are required")
      return
    }

    setIsSaving(true)
    try {
      const playerData = {
        num: parseInt(formData.num),
        name: formData.name,
        full_name: formData.fullName || formData.name,
        pos: formData.pos,
        cat: formData.cat as Player["cat"],
        age: parseInt(formData.age) || 18,
        hometown: formData.hometown,
        foot: formData.foot,
        goals: parseInt(formData.goals) || 0,
        assists: parseInt(formData.assists) || 0,
        clean_sheets: formData.cat === "GK" ? parseInt(formData.cleanSheets) || 0 : undefined,
        bio: formData.bio,
        photo_url: formData.photo.signedUrl || undefined,
        status: formData.status,
        date_of_birth: formData.dateOfBirth || undefined,
        join_date: formData.joinDate || undefined,
        season_year: formData.seasonYear || "2024-2025",
        appearances: parseInt(formData.appearances) || 0,
        minutes: parseInt(formData.minutes) || 0,
        pass_accuracy: parseInt(formData.passAccuracy) || 0,
        chances_created: parseInt(formData.chancesCreated) || 0,
        premier_matches: parseInt(formData.premierMatches) || 0,
        cup_matches: parseInt(formData.cupMatches) || 0,
        yellow_cards: parseInt(formData.yellowCards) || 0,
        red_cards: parseInt(formData.redCards) || 0,
        motm_awards: parseInt(formData.motmAwards) || 0,
        average_rating: parseFloat(formData.averageRating) || 0,
        pace: parseInt(formData.pace) || 70,
        shooting: parseInt(formData.shooting) || 70,
        passing: parseInt(formData.passing) || 70,
        dribbling: parseInt(formData.dribbling) || 70,
        defending: parseInt(formData.defending) || 70,
        physical: parseInt(formData.physical) || 70,
        trophies: formData.trophies,
      }

      if (editingPlayer) {
        await getDataService().updatePlayer(editingPlayer.id, playerData)
      } else {
        await getDataService().addPlayer(playerData)
      }
      
      resetForm()
    } catch (error) {
      console.error("Error saving player:", error)
      alert(isBn ? "খেলোয়াড় সংরক্ষণ করতে ব্যর্থ" : "Failed to save player")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    // Only admin can delete players
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় মুছতে পারে" : "Only admins can delete players")
      return
    }

    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return
    
    setIsDeleting(true)
    try {
      await getDataService().deletePlayer(playerId)
    } catch (error) {
      console.error("Error deleting player:", error)
      alert(isBn ? "খেলোয়াড় মুছতে ব্যর্থ" : "Failed to delete player")
    } finally {
      setIsDeleting(false)
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: "", fullName: "", email: "", num: "", pos: "", cat: "", 
      age: "", hometown: "", foot: "Right", goals: "0", assists: "0", 
      cleanSheets: "0", bio: "", photo: { signedUrl: "", filePath: "" },
      status: "active", dateOfBirth: "", joinDate: "", seasonYear: "2024-2025",
      appearances: "0", minutes: "0", passAccuracy: "0", chancesCreated: "0",
      premierMatches: "0", cupMatches: "0", yellowCards: "0", redCards: "0",
      motmAwards: "0", averageRating: "0",
      pace: "70", shooting: "70", passing: "70", dribbling: "70", defending: "70", physical: "70",
      trophies: [],
    })
    setNewTrophy({ name: "", year: "" })
    setShowForm(false)
    setEditingPlayer(null)
  }

  const filteredPlayers = players
    .filter(p => filter === "all" || p.cat === filter)
    .filter(p => 
      searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const statusBadge = (status: Player["status"]) => {
    const styles = {
      active: "bg-green-500/20 text-green-400",
      injured: "bg-yellow-500/20 text-yellow-400",
      suspended: "bg-red-500/20 text-red-400",
    }
    const labels = {
      active: isBn ? "সক্রিয়" : "Active",
      injured: isBn ? "আহত" : "Injured",
      suspended: isBn ? "স্থগিত" : "Suspended",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড় ব্যবস্থাপনা" : "Player Management"}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            {players.length} {isBn ? "জন খেলোয়াড়" : "players"}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          disabled={admin?.role !== "admin"}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          title={admin?.role !== "admin" ? (isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় যোগ করতে পারে" : "Only admins can add players") : ""}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "খোঁজ করুন..." : "Search players..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "GK", "DEF", "MID", "FWD"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              }`}
            >
              {tab === "all" ? (isBn ? "সব" : "All") : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingPlayer 
                ? (isBn ? "খেলোয়াড় সম্পাদনা" : "Edit Player")
                : (isBn ? "নতুন খেলোয়াড়" : "New Player")
              }
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ছবি" : "Photo"}
              </label>
              <PhotoUpload
                currentPhoto={formData.photo.signedUrl}
                currentFilePath={formData.photo.filePath}
                onPhotoUpload={handlePhotoUpload}
                onPhotoDelete={handlePhotoDelete}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "নাম (সংক্ষিপ্ত)" : "Name (Short)"}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "পুরো নাম" : "Full Name"}
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="number"
                placeholder={isBn ? "জার্সি নম্বর" : "Jersey #"}
                value={formData.num}
                onChange={(e) => setFormData((prev) => ({ ...prev, num: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "পজিশ�� (যেমন: CB / RB)" : "Position (e.g. CB / RB)"}
                value={formData.pos}
                onChange={(e) => setFormData((prev) => ({ ...prev, pos: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.cat}
                onChange={(e) => setFormData((prev) => ({ ...prev, cat: e.target.value as Player["cat"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="">{isBn ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"}</option>
                <option value="GK">{isBn ? "গোলরক্ষক (GK)" : "Goalkeeper (GK)"}</option>
                <option value="DEF">{isBn ? "ডিফেন্ডার (DEF)" : "Defender (DEF)"}</option>
                <option value="MID">{isBn ? "মিডফিল্ডার (MID)" : "Midfielder (MID)"}</option>
                <option value="FWD">{isBn ? "ফরওয��ার্ড (FWD)" : "Forward (FWD)"}</option>
              </select>
              <input
                type="number"
                placeholder={isBn ? "বয়স" : "Age"}
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "হোমটাউন" : "Hometown"}
                value={formData.hometown}
                onChange={(e) => setFormData((prev) => ({ ...prev, hometown: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.foot}
                onChange={(e) => setFormData((prev) => ({ ...prev, foot: e.target.value as Player["foot"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="Right">{isBn ? "ডান পা" : "Right Foot"}</option>
                <option value="Left">{isBn ? "বাম পা" : "Left Foot"}</option>
                <option value="Both">{isBn ? "উভয় পা" : "Both Feet"}</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Player["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                <option value="injured">{isBn ? "আহত" : "Injured"}</option>
                <option value="suspended">{isBn ? "স্থগিত" : "Suspended"}</option>
              </select>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder={isBn ? "গোল" : "Goals"}
                value={formData.goals}
                onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="number"
                placeholder={isBn ? "অ্যাসিস্ট" : "Assists"}
                value={formData.assists}
                onChange={(e) => setFormData((prev) => ({ ...prev, assists: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              {formData.cat === "GK" && (
                <input
                  type="number"
                  placeholder={isBn ? "ক্লিন শীট" : "Clean Sheets"}
                  value={formData.cleanSheets}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cleanSheets: e.target.value }))}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="date"
                placeholder={isBn ? "জন্মতারিখ" : "Date of Birth"}
                value={formData.dateOfBirth}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="date"
                placeholder={isBn ? "যোগ দেওয়ার তারিখ" : "Join Date"}
                value={formData.joinDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, joinDate: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "সিজন বছর" : "Season Year"}
                value={formData.seasonYear}
                onChange={(e) => setFormData((prev) => ({ ...prev, seasonYear: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <textarea
              placeholder={isBn ? "জীবনী" : "Bio"}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />

            {/* Match Stats Section */}
            <div className="border-t-2 border-secondary pt-4 mt-4">
              <h4 className={`flex items-center gap-2 font-semibold text-lg mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Activity className="w-5 h-5 text-primary" />
                {isBn ? "ম্যাচ পরিসংখ্যান" : "Match Statistics"}
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "উপস্থিতি" : "Appearances"}
                  </label>
                  <input
                    type="number"
                    value={formData.appearances}
                    onChange={(e) => setFormData((prev) => ({ ...prev, appearances: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "মিনিট" : "Minutes"}
                  </label>
                  <input
                    type="number"
                    value={formData.minutes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minutes: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "পাস নির্ভুলতা (%)" : "Pass Accuracy (%)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passAccuracy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, passAccuracy: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সুযোগ তৈরি" : "Chances Created"}
                  </label>
                  <input
                    type="number"
                    value={formData.chancesCreated}
                    onChange={(e) => setFormData((prev) => ({ ...prev, chancesCreated: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Season Stats Section */}
            <div className="border-t-2 border-secondary pt-4 mt-4">
              <h4 className={`flex items-center gap-2 font-semibold text-lg mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <TrendingUp className="w-5 h-5 text-primary" />
                {isBn ? "মৌসুমী পরিসংখ্যান" : "Season Stats"}
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "প্রিমিয়ার ম্যাচ" : "Premier Matches"}
                  </label>
                  <input
                    type="number"
                    value={formData.premierMatches}
                    onChange={(e) => setFormData((prev) => ({ ...prev, premierMatches: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "কাপ ম্যাচ" : "Cup Matches"}
                  </label>
                  <input
                    type="number"
                    value={formData.cupMatches}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cupMatches: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "হলুদ কার্ড" : "Yellow Cards"}
                  </label>
                  <input
                    type="number"
                    value={formData.yellowCards}
                    onChange={(e) => setFormData((prev) => ({ ...prev, yellowCards: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "লাল কার্ড" : "Red Cards"}
                  </label>
                  <input
                    type="number"
                    value={formData.redCards}
                    onChange={(e) => setFormData((prev) => ({ ...prev, redCards: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ম্যান অফ দ্য ম্যাচ" : "MOTM Awards"}
                  </label>
                  <input
                    type="number"
                    value={formData.motmAwards}
                    onChange={(e) => setFormData((prev) => ({ ...prev, motmAwards: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-xs text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "গড় রেটিং" : "Average Rating"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.averageRating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, averageRating: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Player Attributes Section */}
            <div className="border-t-2 border-secondary pt-4 mt-4">
              <h4 className={`flex items-center gap-2 font-semibold text-lg mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Target className="w-5 h-5 text-primary" />
                {isBn ? "খেলোয়াড়ের বৈশিষ্ট্য (0-100)" : "Player Attributes (0-100)"}
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: "pace", label: isBn ? "গতি" : "Pace" },
                  { key: "shooting", label: isBn ? "শুটিং" : "Shooting" },
                  { key: "passing", label: isBn ? "পাসিং" : "Passing" },
                  { key: "dribbling", label: isBn ? "ড্রিবলিং" : "Dribbling" },
                  { key: "defending", label: isBn ? "ডিফেন্ডিং" : "Defending" },
                  { key: "physical", label: isBn ? "শারীরিক" : "Physical" },
                ].map((attr) => (
                  <div key={attr.key}>
                    <label className="block text-xs text-foreground/60 mb-1">{attr.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData[attr.key as keyof typeof formData] as string}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [attr.key]: e.target.value }))}
                        className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData[attr.key as keyof typeof formData] as string}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [attr.key]: e.target.value }))}
                        className="w-16 px-2 py-1 text-center rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trophies Section */}
            <div className="border-t-2 border-secondary pt-4 mt-4">
              <h4 className={`flex items-center gap-2 font-semibold text-lg mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Trophy className="w-5 h-5 text-primary" />
                {isBn ? "ট্রফি" : "Trophies"}
              </h4>
              
              {/* Add Trophy */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder={isBn ? "ট্রফির নাম" : "Trophy Name"}
                  value={newTrophy.name}
                  onChange={(e) => setNewTrophy((prev) => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder={isBn ? "বছর" : "Year"}
                  value={newTrophy.year}
                  onChange={(e) => setNewTrophy((prev) => ({ ...prev, year: e.target.value }))}
                  className="w-24 px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTrophy.name && newTrophy.year) {
                      setFormData((prev) => ({
                        ...prev,
                        trophies: [...prev.trophies, { ...newTrophy }],
                      }))
                      setNewTrophy({ name: "", year: "" })
                    }
                  }}
                  className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Trophy List */}
              {formData.trophies.length > 0 && (
                <div className="space-y-2">
                  {formData.trophies.map((trophy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-2 rounded bg-secondary/30 border border-secondary"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        <span className="font-semibold">{trophy.name}</span>
                        <span className="text-foreground/60">({trophy.year})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            trophies: prev.trophies.filter((_, i) => i !== index),
                          }))
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSavePlayer}
                disabled={isSaving}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {isSaving ? (isBn ? "সংরক্ষণ করছে..." : "Saving...") : (editingPlayer ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save"))}
              </button>
              <button
                onClick={resetForm}
                disabled={isSaving}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="rounded-xl border-2 border-secondary bg-card p-4 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {player.photo ? (
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-[var(--font-display)] text-2xl text-primary">{player.num}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-[var(--font-display)] text-lg tracking-wider truncate">{player.name.toUpperCase()}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                    {player.cat}
                  </span>
                </div>
                <p className="text-sm text-foreground/60 truncate">{player.fullName}</p>
                <p className="text-xs text-foreground/50">{player.pos}</p>
                <div className="flex items-center gap-2 mt-2">
                  {statusBadge(player.status)}
                  <span className="text-xs text-foreground/50">#{player.num}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary">
              <div className="flex items-center gap-4 text-xs text-foreground/60">
                <span>{player.goals} {isBn ? "গোল" : "Goals"}</span>
                <span>{player.assists} {isBn ? "অ্যাসিস্ট" : "Assists"}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEditPlayer(player)}
                  disabled={admin?.role !== "admin"}
                  className="p-2 rounded hover:bg-primary/20 transition text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={admin?.role !== "admin" ? (isBn ? "শুধুমাত্র অ্যাডমিন সম্পাদনা করতে পারে" : "Only admins can edit") : (isBn ? "সম্পাদন�� করুন" : "Edit")}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  disabled={admin?.role !== "admin" || isDeleting}
                  className="p-2 rounded hover:bg-red-500/20 transition text-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={admin?.role !== "admin" ? (isBn ? "শুধুমাত্র অ্যাডমিন মুছতে পারে" : "Only admins can delete") : (isBn ? "মুছুন" : "Delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
          <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
            {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
          </p>
          <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন খেলোয়াড় যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new player"}
          </p>
        </div>
      )}
    </div>
  )
}
