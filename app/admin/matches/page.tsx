"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminMatches() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)

  const matches = [
    { id: 1, home: "Titan Force", away: "FC United", date: "Jan 15, 2025", score: null, status: "Upcoming" },
    { id: 2, home: "Titan Force", away: "Star Academy", date: "Jan 10, 2025", score: "2-1", status: "Completed" },
  ]

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
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "ম্যাচ যোগ করুন" : "Add Match"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <h3 className={`font-[var(--font-display)] text-xl tracking-wider mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন ম্যাচ" : "New Match"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder={isBn ? "বাড়ির দল" : "Home Team"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="text" placeholder={isBn ? "বিদেশী দল" : "Away Team"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="datetime-local" className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <input type="text" placeholder={isBn ? "স্থান" : "Venue"} className="px-4 py-2 rounded border-2 border-card bg-transparent" />
            <button className={`md:col-span-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সংরক্ষণ করুন" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Matches Table */}
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
                <td className="px-4 py-3 text-sm text-foreground">{match.home} vs {match.away}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{match.score || "TBD"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${match.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {match.status}
                  </span>
                </td>
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
