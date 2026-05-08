"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Player, useDataStore } from "@/lib/data-store"
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, X, Save, Search } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [filter, setFilter] = useState<"all" | "GK" | "DEF" | "MID" | "FWD">("all")
  const [searchTerm, setSearchTerm] = useState("")
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
  })
  
  const players = useDataStore(dataStore.getPlayers, "players")

  const handlePhotoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, photo: data }))
  }

  const handlePhotoDelete = () => {
    setFormData((prev) => ({ ...prev, photo: { signedUrl: "", filePath: "" } }))
  }

  const handleSavePlayer = () => {
    if (!formData.name || !formData.num || !formData.cat) {
      alert(isBn ? "নাম, নম্বর এবং ক্যাটাগরি প্রয়োজন" : "Name, number and category are required")
      return
    }

    const playerData: Omit<Player, "id"> = {
      num: parseInt(formData.num),
      name: formData.name,
      fullName: formData.fullName || formData.name,
      pos: formData.pos,
      cat: formData.cat as Player["cat"],
      age: parseInt(formData.age) || 18,
      hometown: formData.hometown,
      foot: formData.foot,
      goals: parseInt(formData.goals) || 0,
      assists: parseInt(formData.assists) || 0,
      cleanSheets: formData.cat === "GK" ? parseInt(formData.cleanSheets) || 0 : undefined,
      bio: formData.bio,
      photo: formData.photo.signedUrl || undefined,
      status: "active"
    }

    if (editingPlayer) {
      dataStore.updatePlayer(editingPlayer.id, playerData)
    } else {
      dataStore.addPlayer(playerData)
    }
    
    resetForm()
  }

  const handleEditPlayer = (player: Player) => {
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
    })
    setShowForm(true)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return
    dataStore.deletePlayer(playerId)
  }

  const resetForm = () => {
    setFormData({ 
      name: "", fullName: "", email: "", num: "", pos: "", cat: "", 
      age: "", hometown: "", foot: "Right", goals: "0", assists: "0", 
      cleanSheets: "0", bio: "", photo: { signedUrl: "", filePath: "" } 
    })
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
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
                placeholder={isBn ? "পজিশন (যেমন: CB / RB)" : "Position (e.g. CB / RB)"}
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
                <option value="FWD">{isBn ? "ফরওয়ার্ড (FWD)" : "Forward (FWD)"}</option>
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
            <textarea
              placeholder={isBn ? "জীবনী" : "Bio"}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePlayer}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {editingPlayer ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
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
                  className="p-2 rounded hover:bg-primary/20 transition text-primary"
                  title={isBn ? "সম্পাদনা করুন" : "Edit"}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                  title={isBn ? "মুছুন" : "Delete"}
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
