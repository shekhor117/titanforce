"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { createClient } from "@/lib/supabase/client"

interface Player {
  id: string
  name: string
  email: string
  position: string | null
  jersey_number: number | null
  status: "pending" | "approved" | "rejected"
  avatar_url?: string
  created_at: string
}

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    position: "",
    photo: { signedUrl: "", filePath: "" },
  })
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Sajon Khan", email: "sajon@example.com", position: "ST", jersey_number: 9, status: "approved", created_at: "2025-01-01" },
    { id: "2", name: "Shuvo Islam", email: "shuvo@example.com", position: "FWD", jersey_number: 7, status: "approved", created_at: "2025-01-02" },
    { id: "3", name: "New Player", email: "new@example.com", position: null, jersey_number: null, status: "pending", created_at: "2025-05-05" },
  ])

  const handlePhotoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, photo: data }))
  }

  const handlePhotoDelete = () => {
    setFormData((prev) => ({ ...prev, photo: { signedUrl: "", filePath: "" } }))
  }

  const handleApprove = async (playerId: string) => {
    // In production, update Supabase
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, status: "approved" as const } : p
    ))
  }

  const handleReject = async (playerId: string) => {
    if (!confirm(isBn ? "এই অনুরোধ প্রত্যাখ্যান করতে চান?" : "Reject this request?")) return
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, status: "rejected" as const } : p
    ))
  }

  const handleSavePlayer = () => {
    if (!formData.name || !formData.number || !formData.position) {
      alert(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all fields")
      return
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: "",
      jersey_number: parseInt(formData.number),
      position: formData.position,
      status: "approved",
      avatar_url: formData.photo.signedUrl,
      created_at: new Date().toISOString(),
    }

    setPlayers([...players, newPlayer])
    setFormData({ name: "", number: "", position: "", photo: { signedUrl: "", filePath: "" } })
    setShowForm(false)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm(isBn ? "এই খেলোয়াড় মুছতে চান?" : "Delete this player?")) return
    setPlayers(players.filter((p) => p.id !== playerId))
  }

  const filteredPlayers = filter === "all" ? players : players.filter(p => p.status === filter)
  const pendingCount = players.filter(p => p.status === "pending").length

  const statusBadge = (status: Player["status"]) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    }
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    }
    const labels = {
      pending: isBn ? "অপেক্ষমান" : "Pending",
      approved: isBn ? "অনুমোদিত" : "Approved",
      rejected: isBn ? "প্রত্যাখ্যান" : "Rejected",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {icons[status]} {labels[status]}
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
          {pendingCount > 0 && (
            <p className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pendingCount} {isBn ? "অনুমোদনের অপেক্ষায়" : "pending approval"}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
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
            {tab === "pending" && (isBn ? "অপেক্ষমান" : "Pending")}
            {tab === "approved" && (isBn ? "অনুমোদিত" : "Approved")}
            {tab === "rejected" && (isBn ? "প্রত্যাখ্যান" : "Rejected")}
            {tab === "pending" && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <h3 className={`font-[var(--font-display)] text-xl tracking-wider mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন খেলোয়াড়" : "New Player"}
          </h3>
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
                placeholder={isBn ? "নাম" : "Name"}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="number"
                placeholder={isBn ? "জার্সি নম্বর" : "Jersey #"}
                value={formData.number}
                onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "অবস্থান" : "Position"}
                value={formData.position}
                onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePlayer}
                className={`flex-1 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "সংরক্ষণ করুন" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setFormData({ name: "", number: "", position: "", photo: { signedUrl: "", filePath: "" } })
                }}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নাম" : "Name"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থান" : "Position"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থা" : "Status"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কার্যক্রম" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3 text-sm font-semibold text-primary">
                  {player.jersey_number || "-"}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{player.name}</div>
                    <div className="text-xs text-foreground/60">{player.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground/80">
                  {player.position || (isBn ? "নির্ধারিত নয়" : "Not set")}
                </td>
                <td className="px-4 py-3">{statusBadge(player.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {player.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(player.id)}
                          className="p-2 rounded hover:bg-green-500/20 transition text-green-400"
                          title={isBn ? "অনুমোদন করুন" : "Approve"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(player.id)}
                          className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                          title={isBn ? "প্রত্যাখ্যান করুন" : "Reject"}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="p-2 rounded hover:bg-primary/20 transition text-primary">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.id)}
                      className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
          </div>
        )}
      </div>
    </div>
  )
}
