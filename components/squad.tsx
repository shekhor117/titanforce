"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, MapPin, Calendar, Footprints, Trophy, Target, Star, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { usePlayers } from "@/lib/use-data-store"
import { dataStore } from "@/lib/data-store"
import { PlayerRating } from "@/components/player-rating"

type Position = "all" | "GK" | "DEF" | "MID" | "FWD"

const filters: Position[] = ["all", "GK", "DEF", "MID", "FWD"]

  // Compact rating badge for player cards
function PlayerRatingBadge({ playerId }: { playerId: string }) {
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setRating(dataStore.getPlayerAverageRating(playerId))
    setIsFavorite(dataStore.getVisitorFavoritePlayer() === playerId)
  }, [playerId])

  if (rating.count === 0 && !isFavorite) return null

  return (
    <div className="flex items-center gap-2 mt-2">
      {rating.count > 0 && (
        <span className="flex items-center gap-1 text-[10px] text-yellow-500">
          <Star className="w-3 h-3 fill-yellow-400" />
          {rating.average.toFixed(1)}
        </span>
      )}
      {isFavorite && (
        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
      )}
    </div>
  )
}

export function Squad() {
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<Position>("all")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  
  // Use realtime hook for players - automatically syncs when admin updates
  const { players, loading: isLoading, error } = usePlayers()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const activePlayers = players.filter(p => p.status?.toLowerCase() === "active")
  const filteredPlayers =
    selectedPosition === "all" ? activePlayers : activePlayers.filter((p) => p.category === selectedPosition)

  const getPlayerPhoto = (player: Player) => {
    return player.image_url || null
  }

  return (
    <section id="squad" ref={sectionRef} className="py-12 sm:py-16 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-8 sm:mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {t.squad.title}
          </h2>
          <p className={`text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-2 mt-4 sm:mt-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আমাদের প্রতিভাবান খেলোয়াড়দের দেখুন যারা টাইটান ফোর্সের গর্বের প্রতিনিধিত্ব করে" : "Meet the talented players representing Titan Force on the pitch"}
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedPosition(filter)}
              className={`neo-btn px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${selectedPosition === filter
                ? "neo-btn-primary bg-primary text-primary-foreground"
                : "neo-soft text-foreground"
                } ${isBn && filter === "all" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {filter === "all" ? t.squad.all : filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-foreground/60">
              <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "খেলোয়াড় লোড হচ্ছে..." : "Loading players..."}
              </p>
            </div>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => {
              const photo = getPlayerPhoto(player)
              return (
                <Link
                  key={player.id}
                  href={`/player/${player.num}`}
                  className={`neo-soft p-3 sm:p-4 md:p-5 text-left block cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {photo ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 bg-secondary/30">
                      <Image
                        src={photo}
                        alt={player.full_name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 font-[var(--font-display)] text-lg sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {player.num}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 bg-secondary/30 flex items-center justify-center">
                      <div className="font-[var(--font-display)] text-3xl sm:text-4xl text-primary">
                        {player.num}
                      </div>
                    </div>
                  )}
                  <h3 className="font-[var(--font-display)] text-lg sm:text-xl tracking-wider mt-1 sm:mt-2 text-foreground truncate">
                    {player.name.toUpperCase()}
                  </h3>
                  <p className="text-xs uppercase tracking-wider mt-0.5 sm:mt-1 text-foreground/60 truncate">
                    {player.position}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-[10px] flex-wrap">
                    <span className="px-2 py-0.5 font-bold uppercase tracking-wider rounded bg-secondary text-primary flex-shrink-0">
                      {player.category}
                    </span>
                    <span className={`text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{t.squad.age} {player.age}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-[10px] text-foreground/60 flex-wrap">
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Target className="w-3 h-3" />
                      {player.goals}
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Trophy className="w-3 h-3" />
                      {player.assists}
                    </span>
                  </div>
                  {/* Compact Rating Display */}
                  <PlayerRatingBadge playerId={player.id} />
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-foreground/60">
              <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="neo-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
                {getPlayerPhoto(selectedPlayer) ? (
                  <Image
                    src={getPlayerPhoto(selectedPlayer)!}
                    alt={selectedPlayer.full_name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <span className="font-[var(--font-display)] text-4xl text-primary">
                    {selectedPlayer.num}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-2xl md:text-3xl tracking-wider text-foreground">
                  {selectedPlayer.full_name.toUpperCase()}
                </h3>
                <p className="text-sm uppercase tracking-wider text-primary mt-1">
                  {selectedPlayer.position}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                  {selectedPlayer.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`flex items-center gap-2 text-sm text-foreground/80 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Calendar className="w-4 h-4 text-primary" />
                <span>{t.squad.age}: {selectedPlayer.age}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{selectedPlayer.hometown}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-foreground/80 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Footprints className="w-4 h-4 text-primary" />
                <span>{selectedPlayer.foot} {t.squad.foot}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-xl mb-6">
              <div className="text-center">
                <div className="font-[var(--font-display)] text-3xl text-primary">
                  {selectedPlayer.goals}
                </div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.squad.goals}
                </div>
              </div>
              <div className="text-center">
                <div className="font-[var(--font-display)] text-3xl text-primary">
                  {selectedPlayer.assists}
                </div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.squad.assists}
                </div>
              </div>
              {selectedPlayer.cleanSheets !== undefined ? (
                <div className="text-center">
                  <div className="font-[var(--font-display)] text-3xl text-primary">
                    {selectedPlayer.cleanSheets}
                  </div>
                  <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.squad.cleanSheets}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-[var(--font-display)] text-3xl text-primary">
                    {selectedPlayer.goals + selectedPlayer.assists}
                  </div>
                  <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.squad.contributions}
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm leading-relaxed text-foreground/80 mb-4">
              {selectedPlayer.bio}
            </p>

            {/* Player Rating in Modal */}
            <div className="p-4 bg-secondary/30 rounded-xl mb-4">
              <h4 className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "রেটিং ও ভোট" : "Rate & Vote"}
              </h4>
              <PlayerRating 
                playerId={selectedPlayer.id} 
                playerName={selectedPlayer.fullName}
                size="md"
              />
            </div>

            <Link
              href={`/player/${selectedPlayer.num}`}
              className="block w-full text-center px-4 py-2 font-bold text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              {isBn ? "বিস্তারিত দেখুন" : "View Full Profile"}
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
