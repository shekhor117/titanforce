"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminPlayers() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)

  const players = [
    { id: 1, name: "Sajon Khan", number: 9, position: "ST", goals: 15, assists: 4 },
    { id: 2, name: "Shuvo Islam", number: 7, position: "FWD", goals: 12, assists: 8 },
    { id: 3, name: "Sujon Ahmed", number: 6, position: "CAM", goals: 7, assists: 9 },
  ]

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
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "খেলোয়াড় যোগ করুন" : "Add Player"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <h3 className={`font-[var(--font-display)] text-xl tracking-wider mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন খেলোয়াড়" : "New Player"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder={isBn ? "নাম" : "Name"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="number" placeholder={isBn ? "জার্সি নম্বর" : "Jersey #"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="text" placeholder={isBn ? "অবস্থান" : "Position"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="file" accept="image/*" className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <button className={`md:col-span-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সংরক্ষণ করুন" : "Save"}
            </button>
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
                <td className="px-4 py-3 text-sm font-semibold text-primary">{player.number}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.name}</td>
                <td className="px-4 py-3 text-sm text-foreground/80">{player.position}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.goals}</td>
                <td className="px-4 py-3 text-sm text-foreground">{player.assists}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-primary/20 transition text-primary">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded hover:bg-red-500/20 transition text-red-400">
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
