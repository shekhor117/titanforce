"use client"

import { useLanguage } from "@/lib/language-context"

export default function AdminFans() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const fans = [
    { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", status: "Active", joined: "Jan 1, 2025" },
    { id: 2, name: "Fatima Khan", email: "fatima@example.com", status: "Active", joined: "Jan 5, 2025" },
    { id: 3, name: "Karim Ali", email: "karim@example.com", status: "Pending", joined: "Jan 10, 2025" },
  ]

  return (
    <div className="space-y-6">
      <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "অনুরাগী ব্যবস্থাপনা" : "Fan Management"}
      </h1>

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
            {fans.map((fan) => (
              <tr key={fan.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3 text-sm text-foreground">{fan.name}</td>
                <td className="px-4 py-3 text-sm text-foreground/80">{fan.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${fan.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {fan.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{fan.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
