"use client"

import { useState, useEffect, useRef } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Activity, TrendingUp, Dumbbell, Heart, Zap, Timer } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface TrainingSession {
  date: string
  fitness: number
  stamina: number
  speed: number
  strength: number
  technique: number
  intensity: number
}

interface PlayerTraining {
  id: number
  name: string
  number: number
  sessions: TrainingSession[]
  attributes: {
    pace: number
    shooting: number
    passing: number
    dribbling: number
    defending: number
    physical: number
  }
}

const trainingData: TrainingSession[] = [
  { date: "Mon", fitness: 75, stamina: 70, speed: 80, strength: 72, technique: 78, intensity: 85 },
  { date: "Tue", fitness: 78, stamina: 73, speed: 82, strength: 74, technique: 79, intensity: 90 },
  { date: "Wed", fitness: 80, stamina: 76, speed: 81, strength: 76, technique: 82, intensity: 75 },
  { date: "Thu", fitness: 82, stamina: 79, speed: 83, strength: 78, technique: 83, intensity: 88 },
  { date: "Fri", fitness: 85, stamina: 82, speed: 85, strength: 80, technique: 85, intensity: 92 },
  { date: "Sat", fitness: 83, stamina: 80, speed: 84, strength: 79, technique: 84, intensity: 70 },
  { date: "Sun", fitness: 80, stamina: 78, speed: 82, strength: 77, technique: 82, intensity: 50 },
]

const playerAttributes = [
  { subject: "Pace", A: 85, fullMark: 100 },
  { subject: "Shooting", A: 78, fullMark: 100 },
  { subject: "Passing", A: 82, fullMark: 100 },
  { subject: "Dribbling", A: 80, fullMark: 100 },
  { subject: "Defending", A: 65, fullMark: 100 },
  { subject: "Physical", A: 75, fullMark: 100 },
]

const weeklyProgress = [
  { week: "W1", performance: 72 },
  { week: "W2", performance: 75 },
  { week: "W3", performance: 74 },
  { week: "W4", performance: 78 },
  { week: "W5", performance: 82 },
  { week: "W6", performance: 85 },
]

export function TrainingChart() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<"fitness" | "stamina" | "speed" | "strength">("fitness")

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

  const metrics = [
    { key: "fitness", label: isBn ? "ফিটনেস" : "Fitness", icon: Heart, color: "#dc2626" },
    { key: "stamina", label: isBn ? "স্ট্যামিনা" : "Stamina", icon: Activity, color: "#22c55e" },
    { key: "speed", label: isBn ? "গতি" : "Speed", icon: Zap, color: "#3b82f6" },
    { key: "strength", label: isBn ? "শক্তি" : "Strength", icon: Dumbbell, color: "#fbbf24" },
  ]

  const currentMetric = metrics.find(m => m.key === selectedMetric)!

  // Stats summary
  const avgFitness = Math.round(trainingData.reduce((a, b) => a + b.fitness, 0) / trainingData.length)
  const avgIntensity = Math.round(trainingData.reduce((a, b) => a + b.intensity, 0) / trainingData.length)
  const peakPerformance = Math.max(...trainingData.map(d => d[selectedMetric]))

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "বিশ্লেষণ" : "ANALYTICS"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "প্রশিক্ষণ পারফরম্যান্স" : "TRAINING PERFORMANCE"}
          </h2>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="p-4 rounded-xl bg-card border-2 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "গড় ফিটনেস" : "Avg Fitness"}
              </span>
            </div>
            <div className="font-[var(--font-display)] text-3xl text-foreground">{avgFitness}%</div>
          </div>
          <div className="p-4 rounded-xl bg-card border-2 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "গড় তীব্রতা" : "Avg Intensity"}
              </span>
            </div>
            <div className="font-[var(--font-display)] text-3xl text-foreground">{avgIntensity}%</div>
          </div>
          <div className="p-4 rounded-xl bg-card border-2 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "শীর্ষ পারফরম্যান্স" : "Peak Performance"}
              </span>
            </div>
            <div className="font-[var(--font-display)] text-3xl text-foreground">{peakPerformance}%</div>
          </div>
          <div className="p-4 rounded-xl bg-card border-2 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-yellow-400" />
              <span className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সেশন" : "Sessions"}
              </span>
            </div>
            <div className="font-[var(--font-display)] text-3xl text-foreground">{trainingData.length}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Training Chart */}
          <div className={`p-6 rounded-xl bg-card border-2 border-secondary transition-all duration-600 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সাপ্তাহিক প্রশিক্ষণ" : "Weekly Training"}
              </h3>
              <div className="flex gap-2">
                {metrics.map(metric => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key as typeof selectedMetric)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                      selectedMetric === metric.key
                        ? "text-primary-foreground"
                        : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
                    } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                    style={{ backgroundColor: selectedMetric === metric.key ? metric.color : undefined }}
                  >
                    <metric.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{metric.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trainingData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={currentMetric.color}
                    strokeWidth={2}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Player Attributes Radar */}
          <div className={`p-6 rounded-xl bg-card border-2 border-secondary transition-all duration-600 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "টিম গড় বৈশিষ্ট্য" : "Team Avg Attributes"}
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={playerAttributes}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                  <Radar
                    name="Attributes"
                    dataKey="A"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className={`p-6 rounded-xl bg-card border-2 border-secondary transition-all duration-600 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সাপ্তাহিক অগ্রগতি" : "Weekly Progress"}
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis domain={[60, 100]} stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Bar dataKey="performance" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Training Intensity */}
          <div className={`p-6 rounded-xl bg-card border-2 border-secondary transition-all duration-600 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "প্রশিক্ষণ তীব্রতা" : "Training Intensity"}
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ fill: "#fbbf24", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
