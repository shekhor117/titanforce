"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2 } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

interface Player {
  id: number
  name: string
  number: number
  position: string
  goals: number
  assists: number
  photoUrl?: string
  photoPath?: string
}

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    position: "",
    photo: { signedUrl: "", filePath: "" },
  })
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Sajon Khan", number: 9, position: "ST", goals: 15, assists: 4 },
    { id: 2, name: "Shuvo Islam", number: 7, position: "FWD", goals: 12, assists: 8 },
    { id: 3, name: "Sujon Ahmed", number: 6, position: "CAM", goals: 7, assists: 9 },
  ])

  const handlePhotoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({
      ...prev,
      photo: data,
    }))
    console.log("[v0] Photo uploaded:", data.filePath)
  }

  const handlePhotoDelete = () => {
    setFormData((prev) => ({
      ...prev,
      photo: { signedUrl: "", filePath: "" },
    }))
    console.log("[v0] Photo deleted")
  }

  const handleSavePlayer = () => {
    if (!formData.name || !formData.number || !formData.position) {
      alert(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all fields")
      return
    }

    const newPlayer: Player = {
      id: Math.max(...players.map((p) => p.id), 0) + 1,
      name: formData.name,
      number: parseInt(formData.number),
      position: formData.position,
      goals: 0,
      assists: 0,
      photoUrl: formData.photo.signedUrl,
      photoPath: formData.photo.filePath,
    }

    setPlayers([...players, newPlayer])
    setFormData({ name: "", number: "", position: "", photo: { signedUrl: "", filePath: "" } })
    setShowForm(false)
    console.log("[v0] Player saved:", newPlayer)
  }

  const handleDeletePlayer = async (playerId: number, photoPath?: string) => {
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return

    // If photo exists, it will be deleted from Storage via cascade or manually
    setPlayers(players.filter((p) => p.id !== playerId))
    console.log("[v0] Player deleted:", playerId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "খেলোয়াড় ব্যবস্থাপনা" : "Player Management"}
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <h3
            className={`font-[var(--font-display)] text-xl tracking-wider mb-4 ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "নতুন খেলোয়াড়" : "New Player"}
          </h3>
          <div className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "ছবি" : "Photo (Supabase Storage)"}
              </label>
              <PhotoUpload
                currentPhoto={formData.photo.signedUrl}
                currentFilePath={formData.photo.filePath}
                onPhotoUpload={handlePhotoUpload}
                onPhotoDelete={handlePhotoDelete}
              />
              {formData.photo.filePath && (
                <p className="text-xs text-foreground/60 mt-2">
                  {isBn ? "সংরক্ষিত:" : "Saved:"} {formData.photo.filePath}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isBn ? "নাম" : "Name"}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="px-4 py-2 rounded border-2 border-card bg-transparent"
              />
              <input
                type="number"
                placeholder={isBn ? "জার্সি নম্বর" : "Jersey #"}
                value={formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
                className="px-4 py-2 rounded border-2 border-card bg-transparent"
              />
              <input
                type="text"
                placeholder={isBn ? "অবস্থান" : "Position"}
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="px-4 py-2 rounded border-2 border-card bg-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSavePlayer}
                className={`flex-1 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "সংরক্ষণ করুন" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setFormData({ name: "", number: "", position: "", photo: { signedUrl: "", filePath: "" } })
                }}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">#</th>
              <th
                className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "নাম" : "Name"}
              </th>
              <th
                className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "অবস্থান" : "Position"}
              </th>
              <th
                className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "গোল" : "Goals"}
              </th>
              <th
                className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${
                  isBn ? "font-[var(--font-bengali)]" : ""
                }`}
              >
                {isBn ? "অ্যাসিস্ট" : "Assists"}
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3 text-sm font-semibold text-primary">{player.number}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.name}</td>
                <td className="px-4 py-3 text-sm text-foreground/80">{player.position}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.goals}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.assists}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-primary/20 transition text-primary">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.id, player.photoPath)}
                    className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
