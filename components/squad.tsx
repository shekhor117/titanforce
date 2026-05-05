"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { X, MapPin, Calendar, Footprints, Trophy, Target } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"

type Position = "all" | "GK" | "DEF" | "MID" | "FWD"

interface Player {
  id: string
  user_id: string
  jersey: number
  position: string
  age: number
  address?: string
  foot: string
  goals?: number
  assists?: number
  cleanSheets?: number
}

const filters: Position[] = ["all", "GK", "DEF", "MID", "FWD"]

const getCategory = (position: string): Exclude<Position, "all"> => {
  const pos = position?.toUpperCase() || ""
  if (pos.includes("GK")) return "GK"
  if (pos.includes("DEF") || pos.includes("CB") || pos.includes("RB") || pos.includes("LB")) return "DEF"
  if (pos.includes("MID") || pos.includes("CM") || pos.includes("CAM") || pos.includes("CDM")) return "MID"
  return "FWD"
}

export function Squad() {
  const [activeFilter, setActiveFilter] = useState<Position>("all")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  const supabase = createClient()

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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        const { data, error: fetchError } = await supabase
          .from("player_profiles")
          .select("*")
          .order("jersey", { ascending: true })

        if (fetchError) throw fetchError
        setPlayers(data || [])
        setError(null)
        console.log("[v0] Players fetched:", data)
      } catch (err) {
        console.error("[v0] Error fetching players:", err)
        setError(err instanceof Error ? err.message : "Failed to load players")
        setPlayers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [supabase])

  const getPlayerName = (player: Player): string => {
    // Use jersey number as identifier or "Player" as fallback
    return `Player ${player.jersey}`
  }

  const filteredPlayers =
    activeFilter === "all"
      ? players
      : players.filter((p) => getCategory(p.position) === activeFilter)

  if (isLoading) {
    return (
      <section id="squad" ref={sectionRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-foreground/60">
          {isBn ? "খেলোয়াড় লোড হচ্ছে..." : "Loading players..."}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="squad" ref={sectionRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    )
  }

  return (
    <section id="squad" ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {t.squad.subtitle}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {t.squad.title}
          </h2>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border-2 transition-all ${activeFilter === filter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-card bg-transparent text-foreground hover:border-primary/50"
                } ${isBn && filter === "all" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {filter === "all" ? t.squad.all : filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.map((player, index) => {
            const category = getCategory(player.position)
            return (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`card-glow rounded-xl p-5 border-2 border-secondary bg-card transition-all duration-300 hover:-translate-y-1 text-left block cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="font-[var(--font-display)] text-4xl text-primary">{player.jersey}</div>
                <h3 className="font-[var(--font-display)] text-xl tracking-wider mt-2 text-foreground truncate">
                  {getPlayerName(player).toUpperCase()}
                </h3>
                <p className="text-xs uppercase tracking-wider mt-1 text-foreground/60 truncate">
                  {player.position}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                    {category}
                  </span>
                  <span className={`text-[10px] text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{t.squad.age} {player.age}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {player.goals || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {player.assists || 0}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {isBn ? "কোন খেলোয়াড় পাওয়া যায়নি" : "No players found"}
          </div>
        )}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="relative w-full max-w-lg bg-card border-2 border-primary rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
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
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="font-[var(--font-display)] text-3xl text-primary">
                  {selectedPlayer.jersey}
                </span>
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-2xl md:text-3xl tracking-wider text-foreground">
                  {getPlayerName(selectedPlayer).toUpperCase()}
                </h3>
                <p className="text-sm uppercase tracking-wider text-primary mt-1">
                  {selectedPlayer.position}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                  {getCategory(selectedPlayer.position)}
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
                <span>{selectedPlayer.address || "N/A"}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-foreground/80 col-span-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Footprints className="w-4 h-4 text-primary" />
                <span>{selectedPlayer.foot} {t.squad.foot}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="text-center">
                <div className="font-[var(--font-display)] text-3xl text-primary">
                  {selectedPlayer.goals || 0}
                </div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.squad.goals}
                </div>
              </div>
              <div className="text-center">
                <div className="font-[var(--font-display)] text-3xl text-primary">
                  {selectedPlayer.assists || 0}
                </div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.squad.assists}
                </div>
              </div>
              <div className="text-center">
                <div className="font-[var(--font-display)] text-3xl text-primary">
                  {(selectedPlayer.goals || 0) + (selectedPlayer.assists || 0)}
                </div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {t.squad.contributions}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
