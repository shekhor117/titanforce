"use client"

import { Clock, Trophy, TrendingUp } from "lucide-react"

interface ActivityItem {
  id: string
  type: "match" | "goal" | "achievement" | "comment" | "milestone"
  title: string
  description: string
  timestamp: string
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  items: ActivityItem[]
  language?: "en" | "bn"
}

const iconMap = {
  match: <Clock className="w-5 h-5" />,
  goal: <Trophy className="w-5 h-5" />,
  achievement: <Trophy className="w-5 h-5" />,
  comment: <Clock className="w-5 h-5" />,
  milestone: <TrendingUp className="w-5 h-5" />,
}

const colorMap = {
  match: "bg-accent/20 text-accent",
  goal: "bg-green-500/20 text-green-500",
  achievement: "bg-purple-500/20 text-purple-500",
  comment: "bg-amber-500/20 text-amber-500",
  milestone: "bg-pink-500/20 text-pink-500",
}

export function ActivityFeed({ items, language = "en" }: ActivityFeedProps) {
  const isBn = language === "bn"

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-6">
      <h3 className={`font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "সম্প্রতি ক্রিয়াকলাপ" : "Recent Activity"}
      </h3>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className={`text-center text-foreground/60 py-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কোন কার্যকলাপ এখনো নেই" : "No activity yet"}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-secondary/20 transition group cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[item.type]}`}>
                {iconMap[item.type] || item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.title}
                </p>
                <p className={`text-xs text-foreground/60 mt-1 line-clamp-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {item.description}
                </p>
              </div>
              <div className={`text-xs text-foreground/50 whitespace-nowrap flex-shrink-0 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {item.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
