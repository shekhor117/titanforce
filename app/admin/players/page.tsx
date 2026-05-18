"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Plus, Edit, Trash2, Save, X, ChevronDown } from "lucide-react"
import { dataStore, Player } from "@/lib/data-store"
import PlayerDataService from "@/lib/player-data-service"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [isClient, setIsClient] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    biography: false,
    attributes: false,
    stats: false
  })
  const [formData, setFormData] = useState({
    name: "",
    num: "",
    age: "",
    position: "",
    category: "",
    status: "",
    hometown: "",
    foot: "Right",
    email: "",
    date_of_birth: "",
    join_date: "",
    bio: "",
    image_url: "",
    goals: "",
    assists: "",
    clean_sheets: "",
    appearances: "",
    minutes_played: "",
    pass_accuracy: "",
    chances_created: "",
    premier_matches: "",
    cup_matches: "",
    yellow_cards: "",
    red_cards: "",
    man_of_the_match: "",
    average_rating: "",
    pace: "",
    shooting: "",
    passing: "",
    dribbling: "",
    defending: "",
    physical: ""
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    setIsClient(true)
    const playersData = await PlayerDataService.getPlayers()
    setPlayers(Array.isArray(playersData) ? playersData : [])
  }

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditPlayer = (player: Player) => {
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় সম্পাদনা করতে পারে" : "Only admins can edit players")
      return
    }
    setEditingPlayer(player)
    const imageUrl = player.image_url || ""
    setImagePreview(imageUrl)
    setFormData({
      name: player.name,
      num: player.num.toString(),
      age: player.age.toString(),
      position: player.position || "",
      category: player.category || "",
      status: player.status || "active",
      hometown: player.hometown || "",
      foot: player.foot || "Right",
      email: player.email || "",
      date_of_birth: player.date_of_birth || "",
      join_date: player.join_date || "",
      bio: player.bio || "",
      image_url: imageUrl,
      goals: player.goals?.toString() || "0",
      assists: player.assists?.toString() || "0",
      clean_sheets: player.clean_sheets?.toString() || "0",
      appearances: player.appearances?.toString() || "0",
      minutes_played: player.minutes_played?.toString() || "0",
      pass_accuracy: player.pass_accuracy?.toString() || "0",
      chances_created: player.chances_created?.toString() || "0",
      premier_matches: player.premier_matches?.toString() || "0",
      cup_matches: player.cup_matches?.toString() || "0",
      yellow_cards: player.yellow_cards?.toString() || "0",
      red_cards: player.red_cards?.toString() || "0",
      man_of_the_match: player.man_of_the_match?.toString() || "0",
      average_rating: player.average_rating?.toString() || "0",
      pace: player.pace?.toString() || "0",
      shooting: player.shooting?.toString() || "0",
      passing: player.passing?.toString() || "0",
      dribbling: player.dribbling?.toString() || "0",
      defending: player.defending?.toString() || "0",
      physical: player.physical?.toString() || "0"
    })
    setShowForm(true)
  }

  const handleDeletePlayer = (playerId: string) => {
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় মুছতে পারে" : "Only admins can delete players")
      return
    }
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return
    
    try {
      // Delete from dataStore
      dataStore.deletePlayer(playerId)
      alert(isBn ? "খেলোয়াড় মুছা হয়েছে" : "Player deleted")
      loadPlayers()
      setEditingPlayer(null)
    } catch (error) {
      console.error('[v0] Error deleting player:', error)
      alert(isBn ? 'খেলোয়াড় মোছা ব্যর্থ' : 'Failed to delete player')
    }
  }

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় সংরক্ষণ করতে পারে" : "Only admins can save players")
      return
    }

    try {
      const playerData: Partial<Player> = {
        name: formData.name,
        num: parseInt(formData.num),
        age: parseInt(formData.age),
        position: formData.position,
        category: formData.category as any,
        status: formData.status as any,
        hometown: formData.hometown,
        foot: formData.foot as any,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        join_date: formData.join_date,
        bio: formData.bio,
        image_url: formData.image_url,
        goals: parseInt(formData.goals),
        assists: parseInt(formData.assists),
        clean_sheets: parseInt(formData.clean_sheets),
        appearances: parseInt(formData.appearances),
        minutes_played: parseInt(formData.minutes_played),
        pass_accuracy: parseInt(formData.pass_accuracy),
        chances_created: parseInt(formData.chances_created),
        premier_matches: parseInt(formData.premier_matches),
        cup_matches: parseInt(formData.cup_matches),
        yellow_cards: parseInt(formData.yellow_cards),
        red_cards: parseInt(formData.red_cards),
        man_of_the_match: parseInt(formData.man_of_the_match),
        average_rating: parseInt(formData.average_rating),
        pace: parseInt(formData.pace),
        shooting: parseInt(formData.shooting),
        passing: parseInt(formData.passing),
        dribbling: parseInt(formData.dribbling),
        defending: parseInt(formData.defending),
        physical: parseInt(formData.physical)
      }

      if (editingPlayer) {
        dataStore.updatePlayer(editingPlayer.id, playerData)
      } else {
        dataStore.addPlayer(playerData as any)
      }

      alert(isBn ? "খেলোয়াড় সংরক্ষিত হয়েছে" : "Player saved successfully")
      setShowForm(false)
      setEditingPlayer(null)
      setFormData({ 
        name: "", num: "", age: "", position: "", category: "", status: "active", hometown: "", 
        foot: "Right", email: "", date_of_birth: "", join_date: "", bio: "", image_url: "",
        goals: "0", assists: "0", clean_sheets: "0", appearances: "0", minutes_played: "0",
        pass_accuracy: "0", chances_created: "0", premier_matches: "0", cup_matches: "0",
        yellow_cards: "0", red_cards: "0", man_of_the_match: "0", average_rating: "0",
        pace: "0", shooting: "0", passing: "0", dribbling: "0", defending: "0", physical: "0"
      })
      loadPlayers()
    } catch (error) {
      console.error('[v0] Error saving player:', error)
      alert(isBn ? 'খেলোয়াড় সংরক্ষণ ব্যর্থ' : 'Failed to save player')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      
      // Create a data URL for immediate preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image_url: result }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      alert(isBn ? "ছবি আপলোড ব্যর্থ" : "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const openNewPlayerForm = () => {
    setEditingPlayer(null)
    setImagePreview("")
    setFormData({ 
      name: "", num: "", age: "", position: "", category: "", status: "active", hometown: "", 
      foot: "Right", email: "", date_of_birth: "", join_date: "", bio: "", image_url: "",
      goals: "0", assists: "0", clean_sheets: "0", appearances: "0", minutes_played: "0",
      pass_accuracy: "0", chances_created: "0", premier_matches: "0", cup_matches: "0",
      yellow_cards: "0", red_cards: "0", man_of_the_match: "0", average_rating: "0",
      pace: "0", shooting: "0", passing: "0", dribbling: "0", defending: "0", physical: "0"
    })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড়" : "Players"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "দল খেলোয়াড় পরিচালনা করুন" : "Manage team players"}
          </p>
        </div>
        <button
          onClick={openNewPlayerForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder={isBn ? "খেলোয়াড় অনুসন্ধান করুন..." : "Search players..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-secondary bg-transparent"
        />
      </div>

      {/* Players Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="rounded-lg border-2 border-secondary bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{player.name}</h3>
                <p className="text-sm text-foreground/60">#{player.num}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                {player.position || player.pos || "N/A"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-foreground/70 mb-4">
              <p>{isBn ? "বয়স" : "Age"}: {player.age}</p>
              <p>{isBn ? "অবস্থান" : "Position"}: {player.position || player.pos}</p>
              <p>{isBn ? "অবস্থা" : "Status"}: {player.status}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditPlayer(player)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-primary text-primary hover:bg-primary/10 transition text-sm"
              >
                <Edit className="w-4 h-4" />
                {isBn ? "সম্পাদনা" : "Edit"}
              </button>
              <button
                onClick={() => handleDeletePlayer(player.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 transition text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {isBn ? "মুছুন" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কোনো খেলোয়াড় পাওয়া যায়নি" : "No players found"}
          </p>
        </div>
      )}

      {/* Add/Edit Player Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-secondary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center sticky top-0 bg-card pb-4 border-b border-secondary">
              <h2 className="text-2xl font-bold">
                {editingPlayer ? (isBn ? "খেলোয়াড় সম্পাদনা করুন" : "Edit Player") : (isBn ? "নতুন খেলোয়াড় যোগ করুন" : "Add New Player")}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setEditingPlayer(null)
                }}
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSavePlayer}>
              {/* BASIC INFORMATION */}
              <div className="border border-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setExpandedSections({ ...expandedSections, basic: !expandedSections.basic })}
                  className="w-full flex items-center justify-between px-4 py-3 font-semibold text-lg hover:bg-foreground/5"
                >
                  <span>{isBn ? "প্রাথমিক তথ্য" : "Basic Information"}</span>
                  <ChevronDown className={`w-5 h-5 transition ${expandedSections.basic ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.basic && (
                  <div className="px-4 py-4 space-y-4 border-t border-secondary">
                    <div>
                      <label className="block text-sm font-medium mb-1">{isBn ? "নাম" : "Name"} <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "জার্সি নং" : "Jersey #"} <span className="text-red-500">*</span></label>
                        <input type="number" required value={formData.num} onChange={(e) => setFormData({ ...formData, num: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "বয়স" : "Age"} <span className="text-red-500">*</span></label>
                        <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "অবস্থান" : "Position"} <span className="text-red-500">*</span></label>
                        <select required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50">
                          <option value="">Select</option>
                          <option value="CM">CM</option>
                          <option value="CDM">CDM</option>
                          <option value="GK">GK</option>
                          <option value="DF">DF</option>
                          <option value="MF">MF</option>
                          <option value="FW">FW</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "বিভাগ" : "Category"}</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50">
                          <option value="">Select</option>
                          <option value="GK">GK</option>
                          <option value="DEF">DEF</option>
                          <option value="MID">MID</option>
                          <option value="FWD">FWD</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "অবস্থা" : "Status"} <span className="text-red-500">*</span></label>
                        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50">
                          <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                          <option value="injured">{isBn ? "আহত" : "Injured"}</option>
                          <option value="suspended">{isBn ? "স্থগিত" : "Suspended"}</option>
                          <option value="recovering">{isBn ? "পুনরুদ্ধার" : "Recovering"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "পা" : "Foot"}</label>
                        <select value={formData.foot} onChange={(e) => setFormData({ ...formData, foot: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50">
                          <option value="Right">Right</option>
                          <option value="Left">Left</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "হোমটাউন" : "Hometown"}</label>
                        <input type="text" value={formData.hometown} onChange={(e) => setFormData({ ...formData, hometown: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "ইমেইল" : "Email"}</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "জন্মতারিখ" : "Date of Birth"}</label>
                        <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{isBn ? "যোগদানের তারিখ" : "Join Date"}</label>
                        <input type="date" value={formData.join_date} onChange={(e) => setFormData({ ...formData, join_date: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{isBn ? "খেলোয়াড়ের ছবি" : "Player Image"}</label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="mb-3">
                            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-secondary rounded-lg cursor-pointer hover:bg-foreground/5 transition">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                              />
                              <span className="text-center text-sm">
                                {uploadingImage ? (isBn ? "আপলোড হচ্ছে..." : "Uploading...") : (isBn ? "ছবি নির্বাচন করুন" : "Choose image")}
                              </span>
                            </label>
                          </div>
                          <label className="block text-xs font-medium mb-1">{isBn ? "অথবা URL" : "or Image URL"}</label>
                          <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => {
                              setFormData({ ...formData, image_url: e.target.value })
                              setImagePreview(e.target.value)
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 rounded border border-secondary bg-background/50 text-sm"
                          />
                        </div>
                        {imagePreview && (
                          <div className="w-24 h-32 rounded-lg overflow-hidden border border-secondary flex-shrink-0">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={() => setImagePreview("")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BIOGRAPHY */}
              <div className="border border-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setExpandedSections({ ...expandedSections, biography: !expandedSections.biography })}
                  className="w-full flex items-center justify-between px-4 py-3 font-semibold text-lg hover:bg-foreground/5"
                >
                  <span>{isBn ? "জীবনী" : "Biography"}</span>
                  <ChevronDown className={`w-5 h-5 transition ${expandedSections.biography ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.biography && (
                  <div className="px-4 py-4 space-y-4 border-t border-secondary">
                    <div>
                      <label className="block text-sm font-medium mb-1">{isBn ? "বায়োগ্রাফি" : "Biography"}</label>
                      <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                    </div>
                  </div>
                )}
              </div>

              {/* PLAYER ATTRIBUTES */}
              <div className="border border-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setExpandedSections({ ...expandedSections, attributes: !expandedSections.attributes })}
                  className="w-full flex items-center justify-between px-4 py-3 font-semibold text-lg hover:bg-foreground/5"
                >
                  <span>{isBn ? "খেলোয়াড়ের বৈশিষ্ট্য" : "Player Attributes (0-100)"}</span>
                  <ChevronDown className={`w-5 h-5 transition ${expandedSections.attributes ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.attributes && (
                  <div className="px-4 py-4 space-y-3 border-t border-secondary">
                    <div className="grid grid-cols-2 gap-3">
                      {[{ key: "pace", label: "Pace" }, { key: "shooting", label: "Shooting" }, { key: "passing", label: "Passing" }, { key: "dribbling", label: "Dribbling" }, { key: "defending", label: "Defending" }, { key: "physical", label: "Physical" }].map(attr => (
                        <div key={attr.key}>
                          <label className="block text-sm font-medium mb-1">{attr.label}</label>
                          <input type="number" min="0" max="100" value={formData[attr.key as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [attr.key]: e.target.value })} className="w-full px-3 py-2 rounded border border-secondary bg-background/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STATISTICS */}
              <div className="border border-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setExpandedSections({ ...expandedSections, stats: !expandedSections.stats })}
                  className="w-full flex items-center justify-between px-4 py-3 font-semibold text-lg hover:bg-foreground/5"
                >
                  <span>{isBn ? "পরিসংখ্যান" : "Statistics"}</span>
                  <ChevronDown className={`w-5 h-5 transition ${expandedSections.stats ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.stats && (
                  <div className="px-4 py-4 space-y-3 border-t border-secondary">
                    <div className="grid grid-cols-3 gap-2">
                      {[{ key: "goals", label: "Goals" }, { key: "assists", label: "Assists" }, { key: "appearances", label: "Appearances" }, { key: "minutes_played", label: "Minutes Played" }, { key: "pass_accuracy", label: "Pass Accuracy %" }, { key: "chances_created", label: "Chances Created" }, { key: "premier_matches", label: "Premier Matches" }, { key: "cup_matches", label: "Cup Matches" }, { key: "yellow_cards", label: "Yellow Cards" }, { key: "red_cards", label: "Red Cards" }, { key: "man_of_the_match", label: "MOTM Awards" }, { key: "average_rating", label: "Average Rating" }, { key: "clean_sheets", label: "Clean Sheets" }].map(stat => (
                        <div key={stat.key}>
                          <label className="block text-xs font-medium mb-1">{stat.label}</label>
                          <input type="number" value={formData[stat.key as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [stat.key]: e.target.value })} className="w-full px-2 py-1 rounded border border-secondary bg-background/50 text-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-card border-t border-secondary py-4">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">
                  <Save className="w-4 h-4" />
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingPlayer(null) }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-foreground/20 rounded hover:bg-foreground/5 transition">
                  <X className="w-4 h-4" />
                  {isBn ? "বাতিল করুন" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
