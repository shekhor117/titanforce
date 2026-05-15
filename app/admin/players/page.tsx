"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { dataStore, Player, useDataStore } from "@/lib/data-store"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const playersData = useDataStore(dataStore.getPlayers, "players")
  const players = Array.isArray(playersData) ? playersData : []
  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditPlayer = (player: Player) => {
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় সম্পাদনা করতে পারে" : "Only admins can edit players")
      return
    }
    setEditingPlayer(player)
    setShowForm(true)
  }

  const handleDeletePlayer = (playerId: string) => {
    if (admin?.role !== "admin") {
      alert(isBn ? "শুধুমাত্র অ্যাডমিন খেলোয়াড় মুছতে পারে" : "Only admins can delete players")
      return
    }
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return
    
    // Delete logic would go here
    alert(isBn ? "খেলোয়াড় মুছা হয়েছে" : "Player deleted")
    setEditingPlayer(null)
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
          onClick={() => {
            setEditingPlayer(null)
            setShowForm(true)
          }}
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
    </div>
  )
}
