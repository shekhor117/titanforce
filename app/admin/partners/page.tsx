"use client"

import { useLanguage } from "@/lib/language-context"
import { Plus } from "lucide-react"

export default function AdminPartners() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const partners = [
    { id: 1, name: "Tech Solutions Ltd", level: "Gold", value: "$5000", status: "Active" },
    { id: 2, name: "Sports Gear Co", level: "Silver", value: "$3000", status: "Active" },
    { id: 3, name: "Local Market", level: "Bronze", value: "$1000", status: "Pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "অংশীদার ব্যবস্থাপনা" : "Partner Management"}
        </h1>
        <button className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          <Plus className="w-4 h-4" />
          {isBn ? "অংশীদার যোগ করুন" : "Add Partner"}
        </button>
      </div>

      <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কোম্পানি" : "Company"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "স্তর" : "Level"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "মূল্য" : "Value"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থা" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3 text-sm text-foreground">{partner.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${partner.level === "Gold" ? "bg-yellow-500/20 text-yellow-400" : partner.level === "Silver" ? "bg-gray-500/20 text-gray-400" : "bg-orange-500/20 text-orange-400"}`}>
                    {partner.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{partner.value}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${partner.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {partner.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
