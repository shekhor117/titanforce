"use client"

import { BarChart3, Zap, Target, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface TeamStatItem {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
  trend?: number
}

export function TeamStatsDashboard() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const stats: TeamStatItem[] = [
    {
      label: isBn ? "মোট গোল" : "Goals",
      value: 42,
      icon: <Target className="w-5 h-5" />,
      color: "from-red-500/20 to-red-500/5",
      trend: 12,
    },
    {
      label: isBn ? "পাস সম্পূর্ণতা" : "Pass Rate",
      value: "87%",
      icon: <Zap className="w-5 h-5" />,
      color: "from-green-500/20 to-green-500/5",
      trend: 5,
    },
    {
      label: isBn ? "শট লক্ষ্য" : "Shots Target",
      value: 156,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-blue-500/20 to-blue-500/5",
      trend: 8,
    },
    {
      label: isBn ? "ডিফেন্স" : "Tackles",
      value: 289,
      icon: <Shield className="w-5 h-5" />,
      color: "from-yellow-500/20 to-yellow-500/5",
      trend: -2,
    },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg tracking-[0.15em] uppercase match-title">
          {isBn ? "টিম স্ট্যাটস" : "Team Stats"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} border-2 border-primary/20 rounded-lg p-4 field-pattern relative overflow-hidden group hover:border-primary/40 transition-all animate-field-entrance`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Background glow */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-50" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">{stat.icon}</div>
                {stat.trend !== undefined && (
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    stat.trend > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {stat.trend > 0 ? "+" : ""}{stat.trend}
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="score-display text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
