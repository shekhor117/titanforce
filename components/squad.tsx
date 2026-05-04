"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { X, MapPin, Calendar, Footprints, Trophy, Target } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Position = "all" | "GK" | "DEF" | "MID" | "FWD"

interface Player {
  num: number
  name: string
  fullName: string
  pos: string
  cat: Exclude<Position, "all">
  age: number
  hometown: string
  foot: "Left" | "Right" | "Both"
  goals: number
  assists: number
  cleanSheets?: number
  bio: string
}

const players: Player[] = [
  {
    num: 1,
    name: "Shuronjit",
    fullName: "Shuronjit Biswas",
    pos: "Goalkeeper",
    cat: "GK",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    bio: "A commanding presence in goal with excellent reflexes and shot-stopping ability. The last line of defense for Titan Force."
  },
  {
    num: 3,
    name: "Srijon",
    fullName: "Srijon Roy",
    pos: "CB / RB",
    cat: "DEF",
    age: 21,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile defender who can play both center-back and right-back. Known for his pace and recovery runs."
  },
  {
    num: 4,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / LB",
    cat: "DEF",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Strong left-footed defender with excellent aerial ability. A rock at the back for the team."
  },
  {
    num: 5,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / CDM",
    cat: "DEF",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Both",
    goals: 0,
    assists: 0,
    bio: "The defensive anchor who can drop back or push forward. Great at breaking up opposition attacks."
  },
  {
    num: 6,
    name: "Sujon",
    fullName: "Sujon Roy",
    pos: "CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Creative playmaker with excellent vision and passing range. The engine of Titan Force&apos;s attack."
  },
  {
    num: 7,
    name: "Shuvo",
    fullName: "Shuvo Roy",
    pos: "LW / RW / CAM",
    cat: "FWD",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Explosive winger with pace to burn. Can play on either flank and loves to cut inside to shoot."
  },
  {
    num: 8,
    name: "Sojib",
    fullName: "Sojib Roy",
    pos: "CM / CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Box-to-box midfielder who covers every blade of grass. Combines work rate with technical quality."
  },
  {
    num: 9,
    name: "Sajon",
    fullName: "Sajon Biswas",
    pos: "ST / CF",
    cat: "FWD",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Clinical striker with a natural instinct for goal. The team&apos;s top scorer and focal point of the attack."
  },
  {
    num: 11,
    name: "Kourov",
    fullName: "Kourov Chakroborty",
    pos: "LW / ST",
    cat: "FWD",
    age: 18,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Tricky left winger who can also play as a second striker. Dangerous in one-on-one situations."
  },
  {
    num: 17,
    name: "Shekhor",
    fullName: "Shekhor Mohan Roy",
    pos: "CB / CM / CDM",
    cat: "DEF",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile player who can slot into defense or midfield. A true utility player with leadership qualities."
  },
]

const filters: Position[] = ["all", "GK", "DEF", "MID", "FWD"]

export function Squad() {
  const [activeFilter, setActiveFilter] = useState<Position>("all")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

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

  const filteredPlayers =
    activeFilter === "all" ? players : players.filter((p) => p.cat === activeFilter)

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
          {filteredPlayers.map((player, index) => (
            <Link
              key={`${player.num}-${player.name}`}
              href={`/player/${player.num}`}
              className={`card-glow rounded-xl p-5 border-2 border-secondary bg-card transition-all duration-300 hover:-translate-y-1 text-left block cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="font-[var(--font-display)] text-4xl text-primary">{player.num}</div>
              <h3 className="font-[var(--font-display)] text-xl tracking-wider mt-2 text-foreground">
                {player.name.toUpperCase()}
              </h3>
              <p className="text-xs uppercase tracking-wider mt-1 text-foreground/60">
                {player.pos}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                  {player.cat}
                </span>
                <span className={`text-[10px] text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{t.squad.age} {player.age}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground/60">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {player.goals}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {player.assists}
                </span>
              </div>
            </Link>
          ))}
        </div>
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
              <div className="flex-shrink-0 w-5 h-5 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="font-[var(--font-display)] text-4xl text-primary">
                  {selectedPlayer.num}
                </span>
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-2xl md:text-3xl tracking-wider text-foreground">
                  {selectedPlayer.fullName.toUpperCase()}
                </h3>
                <p className="text-sm uppercase tracking-wider text-primary mt-1">
                  {selectedPlayer.pos}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-secondary text-primary">
                  {selectedPlayer.cat}
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

            <div className="flex gap-3">
              <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                {selectedPlayer.bio}
              </p>
              <Link
                href={`/player/${selectedPlayer.num}`}
                className="px-4 py-2 font-bold text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition whitespace-nowrap h-fit"
              >
                {isBn ? "বিস্তারিত" : "View"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
