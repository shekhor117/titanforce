"use client"

import { useState, useEffect } from "react"
import { Star, Heart } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"

interface PlayerRatingProps {
  playerId: string
  playerName: string
  showFavorite?: boolean
  size?: "sm" | "md" | "lg"
}

export function PlayerRating({ playerId, playerName, showFavorite = true, size = "md" }: PlayerRatingProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 })
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load initial data
    setAverageRating(dataStore.getPlayerAverageRating(playerId))
    setUserRating(dataStore.getVisitorPlayerRating(playerId))
    setFavoriteCount(dataStore.getPlayerVoteCount(playerId, "favorite"))
    setIsFavorite(dataStore.getVisitorFavoritePlayer() === playerId)
  }, [playerId])

  const handleRate = (rating: number) => {
    dataStore.ratePlayer(playerId, rating)
    setUserRating(rating)
    setAverageRating(dataStore.getPlayerAverageRating(playerId))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleFavorite = () => {
    dataStore.voteForPlayer(playerId, "favorite")
    const newFavorite = dataStore.getVisitorFavoritePlayer() === playerId
    setIsFavorite(newFavorite)
    setFavoriteCount(dataStore.getPlayerVoteCount(playerId, "favorite"))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const starSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
  const heartSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"

  return (
    <div className="space-y-3">
      {/* Star Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = hoverRating !== null ? star <= hoverRating : star <= (userRating || 0)
            const avgFilled = star <= Math.round(averageRating.average)
            
            return (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className={`transition-all duration-200 ${isAnimating ? "scale-110" : ""}`}
              >
                <Star
                  className={`${starSize} transition-colors ${
                    filled
                      ? "fill-yellow-400 text-yellow-400"
                      : userRating
                      ? "text-secondary/50"
                      : avgFilled
                      ? "fill-yellow-400/50 text-yellow-400/50"
                      : "text-secondary/50"
                  }`}
                />
              </button>
            )
          })}
        </div>
        <span className={`${textSize} text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {averageRating.count > 0 ? (
            <>
              {averageRating.average.toFixed(1)} ({averageRating.count} {isBn ? "ভোট" : "votes"})
            </>
          ) : (
            isBn ? "রেটিং দিন" : "Rate player"
          )}
        </span>
      </div>

      {/* Favorite Button */}
      {showFavorite && (
        <button
          onClick={handleFavorite}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-200 ${
            isFavorite
              ? "border-red-500 bg-red-500/10 text-red-500"
              : "border-secondary hover:border-red-500/50 text-foreground/60 hover:text-red-500"
          } ${isAnimating ? "scale-105" : ""}`}
        >
          <Heart
            className={`${heartSize} transition-all ${isFavorite ? "fill-red-500" : ""}`}
          />
          <span className={`${textSize} ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isFavorite ? (isBn ? "প্রিয়" : "Favorite") : (isBn ? "প্রিয় করুন" : "Add Favorite")}
          </span>
          {favoriteCount > 0 && (
            <span className={`${textSize} px-1.5 py-0.5 rounded-full bg-secondary/30`}>
              {favoriteCount}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

// Compact version for cards
export function PlayerRatingCompact({ playerId, size = "sm" }: { playerId: string; size?: "sm" | "md" }) {
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 })
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setAverageRating(dataStore.getPlayerAverageRating(playerId))
    setIsFavorite(dataStore.getVisitorFavoritePlayer() === playerId)
  }, [playerId])

  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"
  const textSize = size === "sm" ? "text-xs" : "text-sm"

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
        <span className={textSize}>
          {averageRating.average > 0 ? averageRating.average.toFixed(1) : "-"}
        </span>
      </div>
      {isFavorite && (
        <Heart className={`${starSize} fill-red-500 text-red-500`} />
      )}
    </div>
  )
}
