"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

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

export default function PlayerProfile() {
  const params = useParams()
  const playerJersey = parseInt(params.number as string)
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from("player_profiles")
          .select("*")
          .eq("jersey", playerJersey)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error("Player not found")

        setPlayer(data)
        setError(null)
        console.log("[v0] Player loaded:", data)
      } catch (err) {
        console.error("[v0] Error fetching player:", err)
        setError(err instanceof Error ? err.message : "Failed to load player")
        setPlayer(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [playerJersey])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{isBn ? "খেলোয়াড় খুঁজে পাওয়া যায়নি" : "Player Not Found"}</h1>
          <p className="text-foreground/60 mb-6">{error}</p>
          <Link href="/#squad" className="text-primary hover:text-primary/80">
            {isBn ? "দলে ফিরুন" : "Go Back to Squad"}
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Appearances", value: "0" },
    { title: "Goals", value: (player.goals || 0).toString() },
    { title: "Assists", value: (player.assists || 0).toString() },
    { title: "Minutes", value: "0" },
    { title: "Pass Accuracy", value: "92%" },
    { title: "Chances Created", value: "41" },
  ]

  const seasonStats = [
    { label: "Premier Matches", value: "0" },
    { label: "Cup Matches", value: "0" },
    { label: "Yellow Cards", value: "0" },
    { label: "Red Cards", value: "0" },
    { label: "Man of the Match", value: "0" },
    { label: "Average Rating", value: "0" },
  ]

  const trophies = [
    { name: "Daudpur Tournament Champion", year: "2026" },
    { name: "Championship", year: "" },
    { name: "Best Young Player Award", year: "" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: scale(1.02);
        }

        .zoom {
          animation: zoom 10s infinite alternate ease-in-out;
        }

        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>

      {/* Back Button */}
      <div className="bg-secondary/20 border-b border-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/#squad"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "দলে ফিরুন" : "Back to Squad"}
            </span>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden border-b border-secondary">
        <div
          className="absolute inset-0 w-full h-full object-cover opacity-20 zoom"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            <div className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-3xl border-4 border-primary shadow-2xl card bg-secondary/30 flex items-center justify-center">
              <span className="font-[var(--font-display)] text-6xl md:text-7xl text-primary">
                #{player.jersey}
              </span>
            </div>

            <div className="flex-1">
              <p className="uppercase tracking-[0.3em] text-foreground/60 text-sm mb-2">
                Titan Force FC
              </p>

              <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none text-foreground">
                {isBn ? "খেলোয়াড়" : `Player ${player.jersey}`}
              </h1>

              <div className={`flex flex-wrap items-center gap-4 mt-4 text-base md:text-lg text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="text-primary font-bold">#{player.jersey}</span>
                <span>{player.position}</span>
                <span>Bangladesh</span>
                <span>{player.foot} Footed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="card bg-secondary/20 border border-secondary rounded-2xl p-6 shadow-lg"
          >
            <p className={`text-xs uppercase tracking-widest text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {item.title}
            </p>
            <h2 className="font-[var(--font-display)] text-4xl text-primary mt-3">
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="space-y-8">
          {/* Player Details */}
          <div className="card bg-secondary/20 border border-secondary rounded-3xl p-8">
            <h2 className={`text-2xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড়ের বিবরণ" : "Player Details"}
            </h2>

            <div className={`space-y-4 text-foreground/80 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {[
                ["Full Name", isBn ? "খেলোয়াড়" : "Player"],
                ["Position", player.position],
                ["Age", player.age.toString()],
                ["Jersey Number", player.jersey.toString()],
                ["Address", player.address || "N/A"],
                ["Preferred Foot", player.foot],
                ["Club", "Titan Force FC"],
                ["Status", "Active"],
              ].map(([label, value], index) => (
                <div key={index} className="flex justify-between border-b border-secondary/30 pb-3">
                  <span className="text-foreground/60">{label}</span>
                  <span className="text-foreground font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Season Stats */}
          <div className="card bg-secondary/20 border border-secondary rounded-3xl p-8">
            <h2 className={`text-2xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মৌসুমী পরিসংখ্যান" : "Season Stats"}
            </h2>

            <div className="space-y-5">
              {seasonStats.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-foreground/70">{item.label}</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-primary rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Biography */}
          <div className="card bg-secondary/20 border border-secondary rounded-3xl p-8">
            <h2 className={`text-3xl font-bold mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "জীবনী" : "Biography"}
            </h2>
            <p className={`text-foreground/80 leading-8 text-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "প্রতিভাবান খেলোয়াড়ের একটি বিস্তৃত বায়োগ্রাফি" : "An accomplished player representing Titan Force FC with dedication and skill on the field."}
            </p>
          </div>

          {/* Player Attributes */}
          <div className="card bg-secondary/20 border border-secondary rounded-3xl p-8">
            <h2 className={`text-3xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড়ের বৈশিষ্ট্য" : "Player Attributes"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                ["Pace", "84%"],
                ["Shooting", "81%"],
                ["Passing", "92%"],
                ["Dribbling", "89%"],
                ["Defending", "64%"],
                ["Physical", "76%"],
              ].map(([skill, value], index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{skill}</span>
                    <span>{value}</span>
                  </div>
                  <div className="w-full h-3 bg-secondary/50 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophies */}
          <div className="card bg-secondary/20 border border-secondary rounded-3xl p-8">
            <h2 className={`text-3xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ট্রফি" : "Trophies"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trophies.map((trophy, i) => (
                <div
                  key={i}
                  className="card bg-secondary/30 border border-secondary rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className={`font-bold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {trophy.name}
                  </h3>
                  <p className="text-foreground/50 mt-2">{trophy.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
