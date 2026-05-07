"use client"

import { useRouter } from "next/navigation"
import { Star, ArrowRight } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  action: string
  actionUrl?: string
  icon?: React.ReactNode
  priority?: "high" | "medium" | "low"
  onClick?: () => void
}

interface PersonalizedRecommendationsProps {
  recommendations: Recommendation[]
  language?: "en" | "bn"
  onRecommendationClick?: (recommendation: Recommendation) => void
}

const priorityStyles = {
  high: "border-red-500 bg-red-500/10 hover:bg-red-500/20",
  medium: "border-amber-500 bg-amber-500/10 hover:bg-amber-500/20",
  low: "border-green-500 bg-green-500/10 hover:bg-green-500/20",
}

export function PersonalizedRecommendations({ recommendations, language = "en", onRecommendationClick }: PersonalizedRecommendationsProps) {
  const router = useRouter()
  const isBn = language === "bn"

  const handleRecommendationClick = (rec: Recommendation) => {
    if (rec.onClick) {
      rec.onClick()
    } else if (rec.actionUrl) {
      router.push(rec.actionUrl)
    } else if (onRecommendationClick) {
      onRecommendationClick(rec)
    }
  }

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-primary" />
        <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ব্যক্তিগত সুপারিশ" : "Personalized Recommendations"}
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <p className={`text-center text-foreground/60 py-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কোন সুপারিশ এখনো নেই" : "No recommendations yet"}
          </p>
        ) : (
          recommendations.map((rec) => (
            <button
              key={rec.id}
              onClick={() => handleRecommendationClick(rec)}
              className={`w-full p-4 rounded-lg border-2 ${priorityStyles[rec.priority || "medium"]} hover:shadow-lg transition-all duration-200 transform hover:scale-102 text-left`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                  <p className={`text-xs text-foreground/70 mt-1 line-clamp-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {rec.description}
                  </p>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded mt-3 transition ${
                  rec.priority === "high"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : rec.priority === "medium"
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {rec.action}
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
