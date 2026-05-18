"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
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
  const [formData, setFormData] = useState({
    name: "",
    num: "",
    age: "",
    position: "",
    status: ""
  })

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
    setFormData({
      name: player.name,
      num: player.num.toString(),
      age: player.age.toString(),
      position: player.position || "",
      status: player.status || ""
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
      const playerData = {
        name: formData.name,
        num: parseInt(formData.num),
        age: parseInt(formData.age),
        position: formData.position,
        status: formData.status || "active"
      }

      if (editingPlayer) {
        // Update existing player
        dataStore.updatePlayer(editingPlayer.id, playerData)
      } else {
        // Add new player
        dataStore.addPlayer(playerData)
      }

      alert(isBn ? "খেলোয়াড় সংরক্ষিত হয়েছে" : "Player saved successfully")
      setShowForm(false)
      setEditingPlayer(null)
      setFormData({ name: "", num: "", age: "", position: "", status: "" })
      loadPlayers()
    } catch (error) {
      console.error('[v0] Error saving player:', error)
      alert(isBn ? 'খেলোয়াড় সংরক্ষণ ব্যর্থ' : 'Failed to save player')
    }
  }

  const openNewPlayerForm = () => {
    setEditingPlayer(null)
    setFormData({ name: "", num: "", age: "", position: "", status: "active" })
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
          <div className="bg-card border-2 border-secondary rounded-lg max-w-md w-full max-h-96 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center">
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isBn ? "নাম" : "Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isBn ? "খেলোয়াড়ের নাম" : "Player name"}
                  className="w-full px-3 py-2 rounded border border-secondary bg-background/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isBn ? "জার্সি নং" : "Jersey #"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.num}
                    onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                    placeholder={isBn ? "নং" : "#"}
                    className="w-full px-3 py-2 rounded border border-secondary bg-background/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isBn ? "বয়স" : "Age"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder={isBn ? "বয়স" : "Age"}
                    className="w-full px-3 py-2 rounded border border-secondary bg-background/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {isBn ? "অবস্থান" : "Position"} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-secondary bg-background/50"
                >
                  <option value="">{isBn ? "নির্বাচন করুন" : "Select"}</option>
                  <option value="GK">{isBn ? "গোলকিপার" : "Goalkeeper"}</option>
                  <option value="DF">{isBn ? "ডিফেন্ডার" : "Defender"}</option>
                  <option value="MF">{isBn ? "মিডফিল্ডার" : "Midfielder"}</option>
                  <option value="FW">{isBn ? "ফরওয়ার্ড" : "Forward"}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {isBn ? "অবস্থা" : "Status"} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-secondary bg-background/50"
                >
                  <option value="">{isBn ? "নির্বাচন করুন" : "Select"}</option>
                  <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                  <option value="inactive">{isBn ? "নিষ্ক্রিয়" : "Inactive"}</option>
                  <option value="injured">{isBn ? "আহত" : "Injured"}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  <Save className="w-4 h-4" />
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPlayer(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-foreground/20 rounded hover:bg-foreground/5 transition"
                >
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
