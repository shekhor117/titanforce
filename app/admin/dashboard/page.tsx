"use client"

import { useLanguage } from "@/lib/language-context"

export default function AdminDashboard() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const stats = [
    { label: isBn ? "মোট খেলোয়াড়" : "Total Players", value: "10", icon: "⚽" },
    { label: isBn ? "মোট ম্যাচ" : "Total Matches", value: "24", icon: "🏆" },
    { label: isBn ? "মোট অনুরাগী" : "Total Fans", value: "1.2K", icon: "👥" },
    { label: isBn ? "অংশীদার" : "Partners", value: "5", icon: "🤝" },
  ]

  const recentActivities = [
    { action: isBn ? "নতুন ম্যাচ যোগ করা হয়েছে" : "New match added", time: "2 hours ago" },
    { action: isBn ? "খেলোয়াড় আপডেট হয়েছে" : "Player stats updated", time: "4 hours ago" },
    { action: isBn ? "নতুন অনুরাগী যোগ হয়েছে" : "New fan registered", time: "1 day ago" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "টাইটান ফোর্স ম্যানেজমেন্ট সিস্টেম" : "Titan Force Management System"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-6 border-2 border-secondary bg-card hover:border-primary transition"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-[var(--font-display)] text-primary">{stat.value}</div>
            <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "সম্প্রতি কার্যকলাপ" : "Recent Activity"}
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded bg-secondary/30">
              <span className={`text-foreground/80 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {activity.action}
              </span>
              <span className="text-xs text-foreground/50">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
