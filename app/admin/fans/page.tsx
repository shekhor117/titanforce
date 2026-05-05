"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { CheckCircle, XCircle, Clock, Users } from "lucide-react"

interface Fan {
  id: string
  name: string
  email: string
  avatar_url: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function AdminFans() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [fans, setFans] = useState<Fan[]>([
    { id: "1", name: "Ahmed Hassan", email: "ahmed@example.com", avatar_url: null, status: "approved", created_at: "Jan 1, 2025" },
    { id: "2", name: "Fatima Khan", email: "fatima@example.com", avatar_url: null, status: "approved", created_at: "Jan 5, 2025" },
    { id: "3", name: "Karim Ali", email: "karim@example.com", avatar_url: null, status: "approved", created_at: "Jan 10, 2025" },
    { id: "4", name: "New Fan", email: "newfan@example.com", avatar_url: null, status: "approved", created_at: "May 5, 2025" },
  ])

  const filteredFans = filter === "all" ? fans : fans.filter(f => f.status === filter)
  const totalFans = fans.filter(f => f.status === "approved").length

  const statusBadge = (status: Fan["status"]) => {
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
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অনুরাগী ব্যবস্থাপনা" : "Fan Management"}
          </h1>
          <p className={`text-foreground/60 text-sm mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অনুরাগীরা স্বয়ংক্রিয়ভাবে অনুমোদিত" : "Fans are auto-approved on signup"}
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <div className="text-2xl font-[var(--font-display)] text-primary">{totalFans}</div>
            <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মোট অনুরাগী" : "Total Fans"}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "approved"] as const).map((tab) => (
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
            {tab === "approved" && (isBn ? "অনুমোদিত" : "Approved")}
          </button>
        ))}
      </div>

      {/* Fans Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নাম" : "Name"}
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Email</th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থা" : "Status"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "যোগ হয়েছে" : "Joined"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFans.map((fan) => (
              <tr key={fan.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {fan.name.charAt(0)}
                    </div>
                    <span className="text-sm text-foreground">{fan.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground/80">{fan.email}</td>
                <td className="px-4 py-3">{statusBadge(fan.status)}</td>
                <td className="px-4 py-3 text-sm text-foreground">{fan.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFans.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {isBn ? "কোন অনুরাগী পাওয়া যায়নি" : "No fans found"}
          </div>
        )}
      </div>
    </div>
  )
}
