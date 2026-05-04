"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Match {
  id: string
  title: string
  opponent: string
  date: string
  time?: string
  location: string
  status: "upcoming" | "completed" | "cancelled"
  titan_force_score?: number
  opponent_score?: number
  description?: string
}

export default function AdminMatches() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Match>>({
    status: "upcoming",
  })
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from("matches")
        .select("*")
        .order("date", { ascending: false })

      if (fetchError) throw fetchError
      setMatches(data || [])
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching matches:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch matches")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update existing match
        const { error: updateError } = await supabase
          .from("matches")
          .update(formData)
          .eq("id", editingId)

        if (updateError) throw updateError
        setEditingId(null)
      } else {
        // Create new match
        const { error: insertError } = await supabase
          .from("matches")
          .insert([formData])

        if (insertError) throw insertError
      }

      setFormData({ status: "upcoming" })
      setShowForm(false)
      await fetchMatches()
    } catch (err) {
      console.error("[v0] Error saving match:", err)
      setError(err instanceof Error ? err.message : "Failed to save match")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(isBn ? "এই ম্যাচ মুছতে চান?" : "Are you sure you want to delete this match?")) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from("matches")
        .delete()
        .eq("id", id)

      if (deleteError) throw deleteError
      await fetchMatches()
    } catch (err) {
      console.error("[v0] Error deleting match:", err)
      setError(err instanceof Error ? err.message : "Failed to delete match")
    }
  }

  const handleEdit = (match: Match) => {
    setFormData(match)
    setEditingId(match.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ status: "upcoming" })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ম্যাচ ব্যবস্থাপনা" : "Match Management"}
          </h1>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "ম্যাচ যোগ করুন" : "Add Match"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingId ? (isBn ? "ম্যাচ সম্পাদনা করুন" : "Edit Match") : (isBn ? "নতুন ম্যাচ" : "New Match")}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={isBn ? "শিরোনাম" : "Title"}
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="text"
              placeholder={isBn ? "প্রতিদ্বন্দ্বী" : "Opponent"}
              value={formData.opponent || ""}
              onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <input
              type="time"
              placeholder={isBn ? "সময়" : "Time"}
              value={formData.time || ""}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            />
            <input
              type="text"
              placeholder={isBn ? "অবস্থান" : "Location"}
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />
            <select
              value={formData.status || "upcoming"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            >
              <option value="upcoming">{isBn ? "আসন্ন" : "Upcoming"}</option>
              <option value="completed">{isBn ? "সম্পন্ন" : "Completed"}</option>
              <option value="cancelled">{isBn ? "বাতিল" : "Cancelled"}</option>
            </select>

            {formData.status === "completed" && (
              <>
                <input
                  type="number"
                  placeholder={isBn ? "টাইটান ফোর্স স্কোর" : "Titan Force Score"}
                  value={formData.titan_force_score || ""}
                  onChange={(e) => setFormData({ ...formData, titan_force_score: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
                  min="0"
                />
                <input
                  type="number"
                  placeholder={isBn ? "প্রতিদ্বন্দ্বী স্কোর" : "Opponent Score"}
                  value={formData.opponent_score || ""}
                  onChange={(e) => setFormData({ ...formData, opponent_score: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
                  min="0"
                />
              </>
            )}

            <textarea
              placeholder={isBn ? "বর্ণনা" : "Description"}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="md:col-span-2 px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground h-24 resize-none"
            />

            <button
              type="submit"
              className={`md:col-span-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {editingId ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "তৈরি করুন" : "Create")}
            </button>
          </form>
        </div>
      )}

      {/* Matches Table */}
      {isLoading ? (
        <div className="text-center py-8 text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-8 text-foreground/60">{isBn ? "কোন ম্যাচ নেই" : "No matches"}</div>
      ) : (
        <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary">
                <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "তারিখ" : "Date"}
                </th>
                <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ম্যাচ" : "Match"}
                </th>
                <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "স্কোর" : "Score"}
                </th>
                <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অবস্থা" : "Status"}
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                  <td className="px-4 py-3 text-sm text-foreground">{match.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    Titan Force vs {match.opponent}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary">
                    {match.status === "completed"
                      ? `${match.titan_force_score} - ${match.opponent_score}`
                      : "TBD"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        match.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : match.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-2 rounded hover:bg-primary/20 transition text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
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
      )}
    </div>
  )
}
