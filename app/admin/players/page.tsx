"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Player {
  id: string
  user_id: string
  jersey: number
  position: string
  age: number
  address?: string
  foot: string
  goals?: number
  assists?: number
}

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const supabase = createClient()
  const [showForm, setShowForm] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    jersey: "",
    position: "",
    age: "",
    address: "",
    foot: "Right",
  })

  // Fetch players on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        const { data, error: fetchError } = await supabase
          .from("player_profiles")
          .select("*")
          .order("jersey", { ascending: true })

        if (fetchError) throw fetchError
        setPlayers(data || [])
        setError(null)
        console.log("[v0] Players loaded:", data?.length)
      } catch (err) {
        console.error("[v0] Error fetching players:", err)
        setError(err instanceof Error ? err.message : "Failed to load players")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("You must be logged in")
        return
      }

      const playerData = {
        user_id: user.id,
        jersey: parseInt(formData.jersey),
        position: formData.position,
        age: parseInt(formData.age),
        address: formData.address || null,
        foot: formData.foot,
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      }

      if (editingId) {
        // Update existing player
        const { data, error: updateError } = await supabase
          .from("player_profiles")
          .update(playerData)
          .eq("id", editingId)
          .select()

        if (updateError) throw updateError
        setPlayers(players.map(p => p.id === editingId ? data[0] : p))
        console.log("[v0] Player updated:", data?.[0])
      } else {
        // Create new player
        const { data, error: createError } = await supabase
          .from("player_profiles")
          .insert([playerData])
          .select()

        if (createError) throw createError
        setPlayers([...players, data[0]])
        console.log("[v0] Player created:", data?.[0])
      }

      // Reset form
      setFormData({ jersey: "", position: "", age: "", address: "", foot: "Right" })
      setEditingId(null)
      setShowForm(false)
      setError(null)
    } catch (err) {
      console.error("[v0] Error saving player:", err)
      setError(err instanceof Error ? err.message : "Failed to save player")
    }
  }

  const handleEdit = (player: Player) => {
    setFormData({
      jersey: player.jersey.toString(),
      position: player.position,
      age: player.age.toString(),
      address: player.address || "",
      foot: player.foot,
    })
    setEditingId(player.id)
    setShowForm(true)
  }

  const handleDelete = async (playerId: string) => {
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return

    try {
      const { error: deleteError } = await supabase
        .from("player_profiles")
        .delete()
        .eq("id", playerId)

      if (deleteError) throw deleteError
      setPlayers(players.filter(p => p.id !== playerId))
      console.log("[v0] Player deleted:", playerId)
    } catch (err) {
      console.error("[v0] Error deleting player:", err)
      setError(err instanceof Error ? err.message : "Failed to delete player")
    }
  }

  const handleCancel = () => {
    setFormData({ jersey: "", position: "", age: "", address: "", foot: "Right" })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড় ব্যবস্থাপনা" : "Player Management"}
          </h1>
        </div>
        <button
          onClick={() => !showForm ? setShowForm(true) : handleCancel()}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border-2 border-red-500/30 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingId ? (isBn ? "খেলোয়াড় সম্পাদনা করুন" : "Edit Player") : (isBn ? "নতুন খেলোয়াড়" : "New Player")}
            </h3>
            <button onClick={handleCancel} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder={isBn ? "জার্সি নম্বর" : "Jersey #"}
              value={formData.jersey}
              onChange={(e) => setFormData({ ...formData, jersey: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="text"
              placeholder={isBn ? "অবস্থান (GK, CB, RB, LB, CM, ST)" : "Position (GK, CB, RB, LB, CM, ST)"}
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="number"
              placeholder={isBn ? "বয়স" : "Age"}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="text"
              placeholder={isBn ? "ঠিকানা" : "Address"}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            />
            <select
              value={formData.foot}
              onChange={(e) => setFormData({ ...formData, foot: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            >
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className={`flex-1 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {editingId ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`flex-1 px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "বাতিল করুন" : "Cancel"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border-2 border-secondary bg-card p-8 text-center text-foreground/60">
          {isBn ? "খেলোয়াড় লোড হচ্ছে..." : "Loading players..."}
        </div>
      )}

      {/* Players Table */}
      {!isLoading && (
        <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
          {players.length === 0 ? (
            <div className="p-8 text-center text-foreground/60">
              {isBn ? "কোন খেলোয়াড় নেই" : "No players yet"}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary">
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">#</th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থান" : "Position"}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বয়স" : "Age"}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "গোল" : "Goals"}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অ্যাসিস্ট" : "Assists"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                    <td className="px-4 py-3 text-sm font-semibold text-primary">{player.jersey}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{player.position}</td>
                    <td className="px-4 py-3 text-sm text-foreground/80">{player.age}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{player.goals || 0}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{player.assists || 0}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(player)}
                        className="p-2 rounded hover:bg-primary/20 transition text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(player.id)}
                        className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
