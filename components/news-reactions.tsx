"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, Heart, Sparkles, Frown } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"

interface NewsReactionsProps {
  newsId: string
}

const reactions = [
  { type: "like" as const, icon: ThumbsUp, label: "Like", labelBn: "পছন্দ", color: "text-blue-500" },
  { type: "love" as const, icon: Heart, label: "Love", labelBn: "ভালোবাসা", color: "text-red-500" },
  { type: "wow" as const, icon: Sparkles, label: "Wow", labelBn: "বাহ", color: "text-yellow-500" },
  { type: "sad" as const, icon: Frown, label: "Sad", labelBn: "দুঃখিত", color: "text-purple-500" },
]

export function NewsReactions({ newsId }: NewsReactionsProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [counts, setCounts] = useState({ like: 0, love: 0, wow: 0, sad: 0 })
  const [userReaction, setUserReaction] = useState<"like" | "love" | "wow" | "sad" | null>(null)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)

  useEffect(() => {
    setCounts(dataStore.getNewsReactionCounts(newsId))
    setUserReaction(dataStore.getVisitorNewsReaction(newsId))
  }, [newsId])

  const handleReaction = (type: "like" | "love" | "wow" | "sad") => {
    const result = dataStore.reactToNews(newsId, type)
    setCounts(dataStore.getNewsReactionCounts(newsId))
    setUserReaction(result ? type : null)
    setIsAnimating(type)
    setTimeout(() => setIsAnimating(null), 300)
  }

  const totalReactions = counts.like + counts.love + counts.wow + counts.sad

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 flex-wrap">
        {reactions.map(({ type, icon: Icon, label, labelBn, color }) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all duration-200 ${
              userReaction === type
                ? `border-current ${color} bg-current/10`
                : "border-secondary hover:border-current text-foreground/60 hover:text-foreground"
            } ${isAnimating === type ? "scale-110" : ""}`}
          >
            <Icon className={`w-4 h-4 ${userReaction === type ? color : ""}`} />
            <span className={`text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? labelBn : label}
            </span>
            {counts[type] > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/30">
                {counts[type]}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {totalReactions > 0 && (
        <p className={`text-xs text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {totalReactions} {isBn ? "প্রতিক্রিয়া" : "reactions"}
        </p>
      )}
    </div>
  )
}

// Compact version for news cards
export function NewsReactionsCompact({ newsId }: { newsId: string }) {
  const [counts, setCounts] = useState({ like: 0, love: 0, wow: 0, sad: 0 })

  useEffect(() => {
    setCounts(dataStore.getNewsReactionCounts(newsId))
  }, [newsId])

  const totalReactions = counts.like + counts.love + counts.wow + counts.sad

  if (totalReactions === 0) return null

  return (
    <div className="flex items-center gap-2 text-xs text-foreground/60">
      {counts.like > 0 && (
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 text-blue-500" /> {counts.like}
        </span>
      )}
      {counts.love > 0 && (
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-red-500" /> {counts.love}
        </span>
      )}
      {counts.wow > 0 && (
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-500" /> {counts.wow}
        </span>
      )}
      {counts.sad > 0 && (
        <span className="flex items-center gap-1">
          <Frown className="w-3 h-3 text-purple-500" /> {counts.sad}
        </span>
      )}
    </div>
  )
}
