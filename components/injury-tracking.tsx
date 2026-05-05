"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, CheckCircle, Clock, Calendar, User, Stethoscope, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type InjuryStatus = "active" | "recovering" | "recovered"

interface Injury {
  id: number
  playerId: number
  playerName: string
  playerNumber: number
  injury: string
  bodyPart: string
  status: InjuryStatus
  dateInjured: string
  expectedReturn: string
  progressPercent: number
  notes?: string
}

const injuries: Injury[] = [
  {
    id: 1,
    playerId: 4,
    playerName: "Akash",
    playerNumber: 5,
    injury: "Hamstring Strain",
    bodyPart: "Left Leg",
    status: "recovering",
    dateInjured: "2025-04-20",
    expectedReturn: "2025-05-10",
    progressPercent: 70,
    notes: "Light training resumed"
  },
  {
    id: 2,
    playerId: 6,
    playerName: "Shuvo",
    playerNumber: 7,
    injury: "Ankle Sprain",
    bodyPart: "Right Ankle",
    status: "active",
    dateInjured: "2025-04-28",
    expectedReturn: "2025-05-15",
    progressPercent: 25,
    notes: "Rest and ice treatment"
  },
  {
    id: 3,
    playerId: 2,
    playerName: "Srijon",
    playerNumber: 3,
    injury: "Muscle Fatigue",
    bodyPart: "Quadriceps",
    status: "recovered",
    dateInjured: "2025-04-10",
    expectedReturn: "2025-04-20",
    progressPercent: 100,
    notes: "Fully fit for selection"
  },
]

export function InjuryTracking() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState<InjuryStatus | "all">("all")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const filteredInjuries = injuries.filter(
    i => filterStatus === "all" || i.status === filterStatus
  )

  const getStatusConfig = (status: InjuryStatus) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/50",
          icon: AlertTriangle,
          label: isBn ? "সক্রিয়" : "Active"
        }
      case "recovering":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/50",
          icon: Clock,
          label: isBn ? "সুস্থ হচ্ছে" : "Recovering"
        }
      case "recovered":
        return {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/50",
          icon: CheckCircle,
          label: isBn ? "সুস্থ" : "Recovered"
        }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  const getDaysUntil = (dateStr: string) => {
    const today = new Date()
    const target = new Date(dateStr)
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  // Stats
  const activeCount = injuries.filter(i => i.status === "active").length
  const recoveringCount = injuries.filter(i => i.status === "recovering").length
  const recoveredCount = injuries.filter(i => i.status === "recovered").length

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "স্বাস্থ্য" : "HEALTH"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "ইনজুরি ট্র্যাকিং" : "INJURY TRACKING"}
          </h2>
        </div>

        {/* Stats Overview */}
        <div className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-3xl text-red-400">{activeCount}</div>
            <div className={`text-xs text-red-400/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সক্রিয় ইনজুরি" : "Active Injuries"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-3xl text-yellow-400">{recoveringCount}</div>
            <div className={`text-xs text-yellow-400/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সুস্থ হচ্ছে" : "Recovering"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-3xl text-green-400">{recoveredCount}</div>
            <div className={`text-xs text-green-400/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সুস্থ" : "Recovered"}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={`flex justify-center gap-2 mb-6 transition-all duration-600 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {(["all", "active", "recovering", "recovered"] as const).map(status => {
            const config = status !== "all" ? getStatusConfig(status) : null
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-full border-2 transition ${
                  filterStatus === status
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-secondary bg-transparent text-foreground hover:border-primary/50"
                } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {status === "all" ? (isBn ? "সব" : "All") : config?.label}
              </button>
            )
          })}
        </div>

        {/* Injury Cards */}
        <div className={`space-y-4 transition-all duration-600 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {filteredInjuries.map((injury, index) => {
            const statusConfig = getStatusConfig(injury.status)
            const StatusIcon = statusConfig.icon
            const daysUntil = getDaysUntil(injury.expectedReturn)

            return (
              <div
                key={injury.id}
                className={`p-5 rounded-xl bg-card border-2 ${statusConfig.border} hover:border-primary/50 transition`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Player Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-full ${statusConfig.bg} flex items-center justify-center`}>
                      <span className={`font-[var(--font-display)] text-2xl ${statusConfig.text}`}>
                        {injury.playerNumber}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{injury.playerName}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Injury Details */}
                  <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-foreground font-medium">{injury.injury}</div>
                        <div className="text-foreground/60 text-xs">{injury.bodyPart}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <div className={`text-foreground/60 text-xs ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                          {isBn ? "ইনজুরি তারিখ" : "Injured"}
                        </div>
                        <div className="text-foreground font-medium">{formatDate(injury.dateInjured)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recovery Progress */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পুনরুদ্ধার অগ্রগতি" : "Recovery Progress"}
                      </span>
                      <span className={`text-sm font-bold ${statusConfig.text}`}>{injury.progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          injury.status === "recovered" ? "bg-green-500" :
                          injury.status === "recovering" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${injury.progressPercent}%` }}
                      />
                    </div>
                    {injury.status !== "recovered" && (
                      <div className={`flex items-center gap-1 mt-2 text-xs ${statusConfig.text}`}>
                        <TrendingUp className="w-3 h-3" />
                        <span className={isBn ? "font-[var(--font-bengali)]" : ""}>
                          {daysUntil > 0 
                            ? (isBn ? `${daysUntil} দিন বাকি` : `${daysUntil} days to return`)
                            : (isBn ? "শীঘ্রই ফিরবে" : "Return imminent")
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {injury.notes && (
                  <div className={`mt-4 pt-4 border-t border-secondary/50 text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    <span className="text-foreground/50">{isBn ? "নোট:" : "Notes:"}</span> {injury.notes}
                  </div>
                )}
              </div>
            )
          })}

          {filteredInjuries.length === 0 && (
            <div className={`text-center py-12 text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>{isBn ? "এই বিভাগে কোন ইনজুরি নেই" : "No injuries in this category"}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
