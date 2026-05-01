"use client"

import { useLanguage } from "@/lib/language-context"
import { Plus } from "lucide-react"

export default function AdminNews() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const news = [
    { id: 1, title: "Titan Force Wins 2-1 Against Star Academy", date: "Jan 10, 2025", status: "Published" },
    { id: 2, title: "New Player Joins the Squad", date: "Jan 8, 2025", status: "Published" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "সংবাদ ব্যবস্থাপনা" : "News Management"}
        </h1>
        <button className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          <Plus className="w-4 h-4" />
          {isBn ? "সংবাদ যোগ করুন" : "Add News"}
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="rounded-xl border-2 border-secondary bg-card p-4 hover:border-primary transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-foreground/50 mt-1">{item.date}</p>
              </div>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
