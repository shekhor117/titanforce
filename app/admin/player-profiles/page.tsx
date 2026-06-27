"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { Search, Edit, Eye, X, Save, User, Mail, Phone, MapPin, Calendar, Award, Trash2, Plus } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

interface PlayerProfile {
  id: string
  name: string
  email: string
  role: "player"
  status: "pending" | "approved" | "rejected"
  joinedAt: string
  playerProfile?: {
    phone?: string
    age?: string
    position?: string
    jersey?: string
    height?: string
    weight?: string
    foot?: string
    address?: string
    experience?: string
    photoUrl?: string
    dateOfBirth?: string
    joinDate?: string
    seasonYear?: string
  }
}

// Storage key for registered users with player profiles
const STORAGE_KEY = "titanforce_player_profiles"

// Get all registered players from localStorage
function getPlayerProfiles(): PlayerProfile[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : getDefaultProfiles()
  } catch {
    return getDefaultProfiles()
  }
}

// Default profiles for demo
function getDefaultProfiles(): PlayerProfile[] {
  // Also try to get any existing registered users
  const profiles: PlayerProfile[] = []
  
  // Check for logged-in users stored in titanforce_user
  if (typeof window !== "undefined") {
    const userKeys = Object.keys(localStorage).filter(key => 
      key.startsWith("titanforce_user") || key.includes("player")
    )
    
    userKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}")
        if (data.role === "player" && data.id) {
          profiles.push({
            id: data.id,
            name: data.name || "Unknown Player",
            email: data.email || "",
            role: "player",
            status: "approved",
            joinedAt: new Date().toISOString().split("T")[0],
            playerProfile: data.playerProfile || {}
          })
        }
      } catch {
        // Skip invalid entries
      }
    })
  }
  
  return profiles
}

function savePlayerProfiles(profiles: PlayerProfile[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    window.dispatchEvent(new CustomEvent("dataStoreUpdate", { detail: { key: STORAGE_KEY } }))
  } catch (error) {
    console.error("Failed to save player profiles:", error)
  }
}

export default function AdminPlayerProfiles() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [players, setPlayers] = useState<PlayerProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [editingPlayer, setEditingPlayer] = useState<PlayerProfile | null>(null)
  const [viewingPlayer, setViewingPlayer] = useState<PlayerProfile | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "approved" as PlayerProfile["status"],
    phone: "",
    age: "",
    position: "",
    jersey: "",
    height: "",
    weight: "",
    foot: "",
    address: "",
    experience: "",
    photoUrl: "",
    dateOfBirth: "",
    joinDate: "",
    seasonYear: "2024-2025"
  })

  useEffect(() => {
    setPlayers(getPlayerProfiles())
  }, [])

  const handleEditPlayer = (player: PlayerProfile) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      email: player.email,
      status: player.status,
      phone: player.playerProfile?.phone || "",
      age: player.playerProfile?.age || "",
      position: player.playerProfile?.position || "",
      jersey: player.playerProfile?.jersey || "",
      height: player.playerProfile?.height || "",
      weight: player.playerProfile?.weight || "",
      foot: player.playerProfile?.foot || "",
      address: player.playerProfile?.address || "",
      experience: player.playerProfile?.experience || "",
      photoUrl: player.playerProfile?.photoUrl || "",
      dateOfBirth: player.playerProfile?.dateOfBirth || "",
      joinDate: player.playerProfile?.joinDate || "",
      seasonYear: player.playerProfile?.seasonYear || "2024-2025"
    })
  }

  const handleSavePlayer = () => {
    if (!editingPlayer) return

    const updatedProfiles = players.map(p => {
      if (p.id === editingPlayer.id) {
        return {
          ...p,
          name: formData.name,
          email: formData.email,
          status: formData.status,
          playerProfile: {
            phone: formData.phone,
            age: formData.age,
            position: formData.position,
            jersey: formData.jersey,
            height: formData.height,
            weight: formData.weight,
            foot: formData.foot,
            address: formData.address,
            experience: formData.experience,
            photoUrl: formData.photoUrl,
            dateOfBirth: formData.dateOfBirth,
            joinDate: formData.joinDate,
            seasonYear: formData.seasonYear
          }
        }
      }
      return p
    })

    setPlayers(updatedProfiles)
    savePlayerProfiles(updatedProfiles)
    
    // Also update the user in titanforce_user if they're logged in
    const userKey = "titanforce_user"
    try {
      const userData = localStorage.getItem(userKey)
      if (userData) {
        const user = JSON.parse(userData)
        if (user.id === editingPlayer.id) {
          const updatedUser = {
            ...user,
            name: formData.name,
            playerProfile: {
              phone: formData.phone,
              age: formData.age,
              position: formData.position,
              jersey: formData.jersey,
              height: formData.height,
              weight: formData.weight,
              foot: formData.foot,
              address: formData.address,
              experience: formData.experience,
              photoUrl: formData.photoUrl
            }
          }
          localStorage.setItem(userKey, JSON.stringify(updatedUser))
        }
      }
    } catch {
      // Ignore errors
    }

    setEditingPlayer(null)
    resetForm()
  }

  const handleStatusChange = (playerId: string, newStatus: PlayerProfile["status"]) => {
    const updatedProfiles = players.map(p => 
      p.id === playerId ? { ...p, status: newStatus } : p
    )
    setPlayers(updatedProfiles)
    savePlayerProfiles(updatedProfiles)
  }

  const handleAddPlayer = () => {
    setIsAdding(true)
    resetForm()
  }

  const handleSaveNewPlayer = () => {
    const newPlayer: PlayerProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: "player",
      status: formData.status,
      joinedAt: new Date().toISOString().split("T")[0],
      playerProfile: {
        phone: formData.phone,
        age: formData.age,
        position: formData.position,
        jersey: formData.jersey,
        height: formData.height,
        weight: formData.weight,
        foot: formData.foot,
        address: formData.address,
        experience: formData.experience,
        photoUrl: formData.photoUrl
      }
    }
    const updatedProfiles = [...players, newPlayer]
    setPlayers(updatedProfiles)
    savePlayerProfiles(updatedProfiles)
    setIsAdding(false)
    resetForm()
  }

  const handleDeletePlayer = (playerId: string) => {
    const updatedProfiles = players.filter(p => p.id !== playerId)
    setPlayers(updatedProfiles)
    savePlayerProfiles(updatedProfiles)
    setDeleteConfirm(null)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      status: "approved",
      phone: "",
      age: "",
      position: "",
      jersey: "",
      height: "",
      weight: "",
      foot: "",
      address: "",
      experience: "",
      photoUrl: "",
      dateOfBirth: "",
      joinDate: "",
      seasonYear: "2024-2025"
    })
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || player.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: PlayerProfile["status"]) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400"
    }
    const labels = {
      pending: isBn ? "অপেক্ষমাণ" : "Pending",
      approved: isBn ? "অনুমোদিত" : "Approved",
      rejected: isBn ? "প্রত্যাখ্যাত" : "Rejected"
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold uppercase ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getPositionLabel = (position: string) => {
    const labels: Record<string, { en: string; bn: string }> = {
      goalkeeper: { en: "Goalkeeper", bn: "গোলকিপার" },
      defender: { en: "Defender", bn: "ডিফেন্ডার" },
      midfielder: { en: "Midfielder", bn: "মিডফিল্ডার" },
      forward: { en: "Forward", bn: "ফরোয়ার্ড" }
    }
    return labels[position]?.[isBn ? "bn" : "en"] || position
  }

    return (
      <FeatureProtectedRoute featureName="Player Profiles" category="team">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড় প্রোফাইল" : "Player Profiles"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সমস্ত নিবন্ধিত খেলোয়াড়ের প্রোফাইল পরিচালনা করুন" : "Manage all registered player profiles"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{players.length}</div>
            <div className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মোট খেলোয়াড়" : "Total Players"}
            </div>
          </div>
          <button
            onClick={handleAddPlayer}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Plus className="w-4 h-4" />
            {isBn ? "নতুন খেলোয়াড়" : "Add Player"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder={isBn ? "খেলোয়াড় খুঁজুন..." : "Search players..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-card text-foreground outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "approved", "pending", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {status === "all" ? (isBn ? "সব" : "All") :
               status === "approved" ? (isBn ? "অনুমোদিত" : "Approved") :
               status === "pending" ? (isBn ? "অপেক্ষমাণ" : "Pending") :
               (isBn ? "প্রত্যাখ্যাত" : "Rejected")}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-red-500 p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "খেলোয়াড় মুছুন?" : "Delete Player?"}
              </h3>
              <p className={`text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।" : "This action cannot be undone."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={() => handleDeletePlayer(deleteConfirm)}
                  className={`flex-1 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "মুছুন" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-primary p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নতুন খেলোয়াড় যোগ করুন" : "Add New Player"}
              </h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ছবি" : "Photo"}
                </label>
                <PhotoUpload
                  currentPhoto={formData.photoUrl}
                  currentFilePath=""
                  onPhotoUpload={(data) => setFormData(prev => ({ ...prev, photoUrl: data.signedUrl }))}
                  onPhotoDelete={() => setFormData(prev => ({ ...prev, photoUrl: "" }))}
                />
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নাম" : "Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল" : "Email"} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থা" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PlayerProfile["status"] }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="approved">{isBn ? "অনুমোদিত" : "Approved"}</option>
                    <option value="pending">{isBn ? "অপেক্ষমাণ" : "Pending"}</option>
                    <option value="rejected">{isBn ? "প-ত্যাখ্যাত" : "Rejected"}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ফোন" : "Phone"}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বয়স" : "Age"}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Player Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থান" : "Position"}
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="">{isBn ? "অবস্থান নির্বাচন করুন" : "Select position"}</option>
                    <option value="goalkeeper">{isBn ? "গোলকিপার" : "Goalkeeper"}</option>
                    <option value="defender">{isBn ? "ডিফেন্ডার" : "Defender"}</option>
                    <option value="midfielder">{isBn ? "মিডফিল্ডার" : "Midfielder"}</option>
                    <option value="forward">{isBn ? "ফরোয়ার্ড" : "Forward"}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "জার্সি নম্বর" : "Jersey Number"}
                  </label>
                  <input
                    type="number"
                    value={formData.jersey}
                    onChange={(e) => setFormData(prev => ({ ...prev, jersey: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "প্রধান পা" : "Preferred Foot"}
                  </label>
                  <select
                    value={formData.foot}
                    onChange={(e) => setFormData(prev => ({ ...prev, foot: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="">{isBn ? "পা নির্বাচন করুন" : "Select foot"}</option>
                    <option value="left">{isBn ? "বাম" : "Left"}</option>
                    <option value="right">{isBn ? "ডান" : "Right"}</option>
                    <option value="both">{isBn ? "উভয়" : "Both"}</option>
                  </select>
                </div>
              </div>

              {/* Physical Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "উচ্চতা (সেমি)" : "Height (cm)"}
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ওজন (কেজি)" : "Weight (kg)"}
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অভিজ্ঞতা (বছর)" : "Experience (years)"}
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Date Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "জন্মতারিখ" : "Date of Birth"}
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "যোগ দেওয়ার তারিখ" : "Join Date"}
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ঠিকানা" : "Address"}
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveNewPlayer}
                  disabled={!formData.name || !formData.email}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Plus className="w-4 h-4" />
                  {isBn ? "খেল���য়াড় যোগ করুন" : "Add Player"}
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-primary p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "খেলোয়াড় সম্পাদনা" : "Edit Player Profile"}
              </h3>
              <button onClick={() => setEditingPlayer(null)} className="p-2 hover:bg-secondary/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ছবি" : "Photo"}
                </label>
                <PhotoUpload
                  currentPhoto={formData.photoUrl}
                  currentFilePath=""
                  onPhotoUpload={(data) => setFormData(prev => ({ ...prev, photoUrl: data.signedUrl }))}
                  onPhotoDelete={() => setFormData(prev => ({ ...prev, photoUrl: "" }))}
                />
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নাম" : "Name"}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থা" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PlayerProfile["status"] }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="approved">{isBn ? "অনুমোদিত" : "Approved"}</option>
                    <option value="pending">{isBn ? "অপেক্ষমাণ" : "Pending"}</option>
                    <option value="rejected">{isBn ? "প্রত্যাখ্যাত" : "Rejected"}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "��োন" : "Phone"}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বয়স" : "Age"}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Player Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্���ান" : "Position"}
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="">{isBn ? "অবস্থান নির্বাচন করুন" : "Select position"}</option>
                    <option value="goalkeeper">{isBn ? "গোলকিপার" : "Goalkeeper"}</option>
                    <option value="defender">{isBn ? "ডিফেন্ডার" : "Defender"}</option>
                    <option value="midfielder">{isBn ? "মিডফিল্ডার" : "Midfielder"}</option>
                    <option value="forward">{isBn ? "ফরোয়ার্ড" : "Forward"}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "জার্সি নম্বর" : "Jersey Number"}
                  </label>
                  <input
                    type="number"
                    value={formData.jersey}
                    onChange={(e) => setFormData(prev => ({ ...prev, jersey: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "প্রধান পা" : "Preferred Foot"}
                  </label>
                  <select
                    value={formData.foot}
                    onChange={(e) => setFormData(prev => ({ ...prev, foot: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  >
                    <option value="">{isBn ? "পা নির্বাচন করুন" : "Select foot"}</option>
                    <option value="left">{isBn ? "বাম" : "Left"}</option>
                    <option value="right">{isBn ? "ডান" : "Right"}</option>
                    <option value="both">{isBn ? "উভয়" : "Both"}</option>
                  </select>
                </div>
              </div>

              {/* Physical Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "উচ্চতা (সেমি)" : "Height (cm)"}
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ওজন (কেজি)" : "Weight (kg)"}
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অভিজ্ঞতা (বছর)" : "Experience (years)"}
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Date Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "জন্মতারিখ" : "Date of Birth"}
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "যোগ দেওয়ার তারিখ" : "Join Date"}
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সিজন বছর" : "Season Year"}
                  </label>
                  <input
                    type="text"
                    value={formData.seasonYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, seasonYear: e.target.value }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
                    placeholder="2024-2025"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ঠিকানা" : "Address"}
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSavePlayer}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Save className="w-4 h-4" />
                  {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingPlayer(null)}
                  className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-primary p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "খেলোয়াড় বিবরণ" : "Player Details"}
              </h3>
              <button onClick={() => setViewingPlayer(null)} className="p-2 hover:bg-secondary/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              {viewingPlayer.playerProfile?.photoUrl ? (
                <img 
                  src={viewingPlayer.playerProfile.photoUrl} 
                  alt={viewingPlayer.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
              <h4 className="text-xl font-bold text-foreground">{viewingPlayer.name}</h4>
              <p className="text-foreground/60">{viewingPlayer.email}</p>
              <div className="mt-2">{getStatusBadge(viewingPlayer.status)}</div>
            </div>

            <div className="space-y-3 text-sm">
              {viewingPlayer.playerProfile?.position && (
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-foreground/60">{isBn ? "অব��্থান:" : "Position:"}</span>
                  <span className="text-foreground">{getPositionLabel(viewingPlayer.playerProfile.position)}</span>
                </div>
              )}
              {viewingPlayer.playerProfile?.jersey && (
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 text-primary font-bold">#</span>
                  <span className="text-foreground/60">{isBn ? "জার্সি:" : "Jersey:"}</span>
                  <span className="text-foreground">{viewingPlayer.playerProfile.jersey}</span>
                </div>
              )}
              {viewingPlayer.playerProfile?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-foreground/60">{isBn ? "ফোন:" : "Phone:"}</span>
                  <span className="text-foreground">{viewingPlayer.playerProfile.phone}</span>
                </div>
              )}
              {viewingPlayer.playerProfile?.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground/60">{isBn ? "ঠিকানা:" : "Address:"}</span>
                  <span className="text-foreground">{viewingPlayer.playerProfile.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground/60">{isBn ? "যোগদান:" : "Joined:"}</span>
                <span className="text-foreground">{viewingPlayer.joinedAt}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setViewingPlayer(null)
                handleEditPlayer(viewingPlayer)
              }}
              className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              <Edit className="w-4 h-4" />
              {isBn ? "সম্পাদনা করুন" : "Edit Profile"}
            </button>
          </div>
        </div>
      )}

      {/* Players Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="rounded-xl border-2 border-secondary bg-card p-4/50 transition">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {player.playerProfile?.photoUrl ? (
                    <img src={player.playerProfile.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[var(--font-display)] text-lg tracking-wider truncate">{player.name.toUpperCase()}</h3>
                  <p className="text-sm text-foreground/60 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {player.email}
                  </p>
                  {player.playerProfile?.position && (
                    <p className="text-xs text-foreground/50">{getPositionLabel(player.playerProfile.position)}</p>
                  )}
                  <div className="mt-2">
                    {getStatusBadge(player.status)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary">
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  {player.playerProfile?.jersey && (
                    <span>#{player.playerProfile.jersey}</span>
                  )}
                  {player.playerProfile?.age && (
                    <span>{player.playerProfile.age} {isBn ? "বছর" : "yrs"}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingPlayer(player)}
                    className="p-2 rounded hover:bg-secondary/20 transition text-foreground/70"
                    title={isBn ? "দেখুন" : "View"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditPlayer(player)}
                    className="p-2 rounded hover:bg-primary/20 transition text-primary"
                    title={isBn ? "সম্পাদনা" : "Edit"}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(player.id)}
                    className="p-2 rounded hover:bg-red-500/20 transition text-red-500"
                    title={isBn ? "মুছুন" : "Delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
            {isBn ? "কোন খেলোয়াড় প্রোফাইল পাওয়া যায়নি" : "No player profiles found"}
          </p>
          <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড়রা নিবন্ধন করলে এখানে দেখা যাবে" : "Players will appear here when they register"}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBn ? "মোট" : "Total", value: players.length, color: "text-primary" },
          { label: isBn ? "অনুমোদিত" : "Approved", value: players.filter(p => p.status === "approved").length, color: "text-green-400" },
          { label: isBn ? "অপেক্ষমাণ" : "Pending", value: players.filter(p => p.status === "pending").length, color: "text-yellow-400" },
          { label: isBn ? "প্রত্যাখ্যাত" : "Rejected", value: players.filter(p => p.status === "rejected").length, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{stat.label}</div>
          </div>
        ))}
      </div>
        </div>
      </FeatureProtectedRoute>
    )
  }
