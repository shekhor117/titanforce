"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Zap, Target, Shield, Heart, TrendingUp, Award, BarChart3, Trophy } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { PlayerRating } from "@/components/player-rating"
import { TrainingChart } from "@/components/training-chart"
import { StatCard } from "@/components/stat-card"
import { SkillBar } from "@/components/skill-bar"
import { useEffect, useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { getDataService } from "@/lib/data-service"
import type { Player } from "@/lib/data-service"

export default function PlayerProfile() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const playerNum = parseInt(params.number as string)

  useEffect(() => {
    setMounted(true)
    try {
      const adminData = localStorage.getItem("titanforce_admin")
      if (adminData) {
        const admin = JSON.parse(adminData)
        setIsAdmin(admin.role === "admin")
      }
    } catch {
      // Silent fail
    }
  }, [])

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!mounted) return
      try {
        setLoading(true)
        const service = getDataService()
        const players = await service.getPlayers()
        const foundPlayer = players.find(p => p.num === playerNum)
        setPlayer(foundPlayer)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [playerNum, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{isBn ? "খেলোয়াড় পাওয়া যায়নি" : "Player Not Found"}</h1>
          <Link href="/team-squad" className="text-primary">{isBn ? "দলে ফিরে যান" : "Go Back"}</Link>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Appearances", value: (player.appearances || 0).toString(), icon: Zap },
    { title: "Goals", value: (player.goals || 0).toString(), icon: Target },
    { title: "Assists", value: (player.assists || 0).toString(), icon: Award },
    { title: "Minutes", value: (player.minutes_played || 0).toString(), icon: TrendingUp },
    { title: "Pass Accuracy", value: `${player.pass_accuracy || 0}%`, icon: Shield },
    { title: "Chances Created", value: (player.chances_created || 0).toString(), icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .zoom {
          animation: zoom 10s infinite alternate ease-in-out;
        }
      `}</style>

      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? "পিছনে" : "Back"}</span>
          </button>
          
          {isAdmin && (
            <Link
              href={`/admin/players?edit=${player.num}`}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded bg-primary/20 text-primary text-xs sm:text-sm font-semibold"
            >
              <Edit className="w-4 h-4" />
              <span>{isBn ? "সম্পাদনা করুন" : "Edit"}</span>
            </Link>
          )}
        </div>
      </div>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-secondary/30 to-black/20 border-b border-secondary">
        <div className="absolute inset-0 w-full h-full opacity-30 zoom" style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            {/* Player Image */}
            {player.image_url ? (
              <div className="w-full md:w-auto md:flex-shrink-0 py-6 sm:py-8 md:py-10 flex justify-center md:justify-start">
                <div className="relative w-48 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-80 md:h-96 lg:h-full rounded-3xl border-4 border-primary shadow-2xl overflow-hidden">
                  <Image src={player.image_url} alt={player.full_name} fill className="object-cover object-center" sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 40vw" priority />
                </div>
              </div>
            ) : (
              <div className="w-full md:w-auto md:flex-shrink-0 py-6 sm:py-8 md:py-10 flex justify-center md:justify-start">
                <div className="w-48 sm:w-56 md:w-64 lg:w-72 rounded-3xl border-4 border-primary shadow-2xl bg-secondary/30 flex items-center justify-center aspect-square">
                  <span className="font-[var(--font-display)] text-7xl sm:text-8xl text-primary">#{player.num}</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 pb-6 sm:pb-8 md:pb-10">
              <p className="uppercase tracking-[0.2em] text-white/60 text-xs sm:text-sm mb-2">Titan Force FC</p>
              <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white mb-4">
                {player.full_name.split(" ")[0]}
              </h1>
              <div className={`flex flex-wrap gap-3 mb-6 text-xs sm:text-sm text-white/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="text-primary font-bold">#{player.num}</span>
                <span>{player.position}</span>
                <span>Bangladesh</span>
              </div>
              <PlayerRating playerId={player.num.toString()} playerName={player.full_name} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {stats.map((item, index) => {
          const IconComp = item.icon
          return (
            <StatCard key={index} title={item.title} value={item.value} icon={<IconComp className="w-5 h-5" />} trend={index < 3 ? "up" : "neutral"} percentage={index < 3 ? 12 + index * 5 : undefined} isBn={isBn} />
          )
        })}
      </section>

      {/* TABS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-12 sm:pb-16 md:pb-20">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-secondary pb-4">
          {[
            { id: "overview", label: isBn ? "সংক্ষিপ্তি" : "Overview", icon: Target },
            { id: "stats", label: isBn ? "পরিসংখ্যান" : "Statistics", icon: BarChart3 },
            { id: "skills", label: isBn ? "দক্ষতা" : "Skills", icon: TrendingUp },
            { id: "achievements", label: isBn ? "অর্জন" : "Achievements", icon: Trophy },
          ].map(tab => {
            const TabIcon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary/50 text-foreground/80 hover:bg-secondary"}`}>
                <TabIcon className="w-4 h-4" />
                <span className={isBn ? "font-[var(--font-bengali)]" : ""}>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className={`text-lg sm:text-xl font-bold mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "বিবরণ" : "Details"}</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Full Name", player.full_name],
                  ["Position", player.position],
                  ["Age", player.age?.toString() || "N/A"],
                  ["Jersey", player.num.toString()],
                  ["Status", player.status || "Active"],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between border-b border-secondary/30 pb-2">
                    <span className="text-foreground/60">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className={`text-lg sm:text-2xl font-bold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "জীবনী" : "Biography"}</h3>
                <p className="text-foreground/80">{player.bio || "No bio available."}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className={`text-lg sm:text-xl font-bold mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "ম্যাচ" : "Match Stats"}</h3>
              <div className="space-y-4">
                {[
                  { label: "Appearances", value: player.appearances || 0, max: 38 },
                  { label: "Goals", value: player.goals || 0, max: 20 },
                  { label: "Assists", value: player.assists || 0, max: 15 },
                ].map((stat, idx) => (
                  <SkillBar key={idx} label={stat.label} value={stat.value} max={stat.max} color={idx % 2 === 0 ? "primary" : "accent"} />
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className={`text-lg sm:text-xl font-bold mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "রক্ষণ" : "Defense"}</h3>
              <div className="space-y-4">
                {[
                  { label: "Tackles", value: player.tackles || 0, max: 50 },
                  { label: "Interceptions", value: player.interceptions || 0, max: 30 },
                  { label: "Yellow Cards", value: player.yellow_cards || 0, max: 10 },
                ].map((stat, idx) => (
                  <SkillBar key={idx} label={stat.label} value={stat.value} max={stat.max} color="primary" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className={`text-lg sm:text-xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "দক্ষতা" : "Skills"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { skill: "Pace", value: player.pace || 0 },
                { skill: "Shooting", value: player.shooting || 0 },
                { skill: "Passing", value: player.passing || 0 },
                { skill: "Dribbling", value: player.dribbling || 0 },
                { skill: "Defending", value: player.defending || 0 },
                { skill: "Physical", value: player.physical || 0 },
              ].map((skill, idx) => (
                <SkillBar key={idx} label={skill.skill} value={skill.value} max={100} color={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "accent" : "success"} size="lg" />
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === "achievements" && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className={`text-lg sm:text-xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "পুরস্কার" : "Awards"}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { trophy: "Tournament Champ", year: "2026", icon: "🏆" },
                { trophy: "Top Scorer", year: "2025", icon: "⭐" },
                { trophy: "Best Defender", year: "2024", icon: "🛡️" },
                { trophy: "Player of Month", year: "2026", icon: "👑" },
              ].map((award, idx) => (
                <div key={idx} className="glass-card rounded-lg p-3 md:p-4 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl mb-2">{award.icon}</div>
                  <h4 className="font-bold text-xs md:text-sm">{award.trophy}</h4>
                  <p className="text-foreground/50 text-xs mt-1">{award.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Analytics */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-12">
        <TrainingChart />
      </div>
    </div>
  )
}
