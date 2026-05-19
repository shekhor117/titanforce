"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { getDataService } from "@/lib/data-service"
import type { Player } from "@/lib/data-service"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    position: "",
    status: "active" as "active" | "injured" | "suspended",
    bio: "",
    image_url: "",
    goals: 0,
    assists: 0,
    appearances: 0,
  })

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      setIsLoading(true)
      const dataService = getDataService()
      const data = await dataService.getPlayers()
      setPlayers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error loading players:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePlayer = async () => {
    if (!formData.name || !formData.number) {
      alert(isBn ? "নাম এবং নম্বর প্রয়োজন" : "Name and number are required")
      return
    }

    try {
      const dataService = getDataService()
      const playerData = {
        name: formData.name,
        number: parseInt(formData.number),
        position: formData.position || "Forward",
        status: formData.status,
        bio: formData.bio,
        image_url: formData.image_url,
        goals: formData.goals,
        assists: formData.assists,
        appearances: formData.appearances,
      }

      if (editingPlayer) {
        await dataService.updatePlayer(editingPlayer.id, playerData)
      } else {
        await dataService.createPlayer(playerData)
      }

      await loadPlayers()
      resetForm()
      alert(isBn ? "সংরক্ষণ সফল" : "Saved successfully")
    } catch (error) {
      console.error("[v0] Error:", error)
      alert(isBn ? "ত্রুটি হয়েছে" : "Error occurred")
    }
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      number: player.number.toString(),
      position: player.position || "",
      status: player.status || "active",
      bio: player.bio || "",
      image_url: player.image_url || "",
      goals: player.goals || 0,
      assists: player.assists || 0,
      appearances: player.appearances || 0,
    })
    setShowForm(true)
  }

  const handleDeletePlayer = async (id: string) => {
    if (!confirm(isBn ? "নিশ্চিত?" : "Are you sure?")) return

    try {
      const dataService = getDataService()
      await dataService.deletePlayer(id)
      await loadPlayers()
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      position: "",
      status: "active",
      bio: "",
      image_url: "",
      goals: 0,
      assists: 0,
      appearances: 0,
    })
    setEditingPlayer(null)
    setShowForm(false)
  }

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{isBn ? "খেলোয়াড় পরিচালনা" : "Players"}</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" />
            {isBn ? "নতুন যোগ করুন" : "Add"}
          </button>
          <input
            type="text"
            placeholder={isBn ? "খুঁজুন..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-border rounded flex-1"
          />
        </div>

        {showForm && (
          <div className="bg-muted p-4 rounded-lg mb-6 space-y-3">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <input type="number" placeholder="Number" value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <input type="text" placeholder="Position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-border rounded">
              <option value="active">Active</option>
              <option value="injured">Injured</option>
              <option value="suspended">Suspended</option>
            </select>
            <input type="number" placeholder="Goals" value={formData.goals} onChange={(e) => setFormData({...formData, goals: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-border rounded" />
            <div className="flex gap-2">
              <button onClick={handleSavePlayer} className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {isBn ? "সংরক্ষণ" : "Save"}
              </button>
              <button onClick={resetForm} className="flex-1 bg-gray-600 text-white py-2 rounded">
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPlayers.map(player => (
            <div key={player.id} className="border border-border rounded-lg p-4">
              <h3 className="font-bold text-lg">{player.name} #{player.number}</h3>
              <p className="text-sm text-muted-foreground">{player.position}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEditPlayer(player)} className="flex-1 bg-blue-600 text-white py-2 rounded text-sm">Edit</button>
                <button onClick={() => handleDeletePlayer(player.id)} className="flex-1 bg-red-600 text-white py-2 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
