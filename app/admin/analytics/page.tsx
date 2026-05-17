"use client"

import { useLanguage } from "@/lib/language-context"
import { dataStore } from "@/lib/data-store"
import { useState, useEffect } from "react"
import { 
  BarChart3, TrendingUp, Users, Trophy, Newspaper, Image, 
  Handshake, Mail, Activity, Calendar, Clock, ArrowUp, ArrowDown, 
  Heart, Zap, Save, RefreshCw, Edit
} from "lucide-react"

interface TrainingSession {
  date: string
  fitness: number
  stamina: number
  speed: number
  strength: number
  technique: number
  intensity: number
}

interface PlayerAnalytics {
  playerId: number
  playerName: string
  sessions: TrainingSession[]
  avgFitness: number
  avgIntensity: number
  peakPerformance: number
}

export default function AdminAnalyticsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [isClient, setIsClient] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [fans, setFans] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [activityLog, setActivityLog] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    setPlayers(Array.isArray(dataStore.getPlayers()) ? dataStore.getPlayers() : [])
    setMatches(Array.isArray(dataStore.getMatches()) ? dataStore.getMatches() : [])
    setFans(Array.isArray(dataStore.getFans()) ? dataStore.getFans() : [])
    setPartners(Array.isArray(dataStore.getPartners()) ? dataStore.getPartners() : [])
    setNews(Array.isArray(dataStore.getNews()) ? dataStore.getNews() : [])
    setMedia(Array.isArray(dataStore.getMedia()) ? dataStore.getMedia() : [])
    setContacts(Array.isArray(dataStore.getContacts()) ? dataStore.getContacts() : [])
    setActivityLog(Array.isArray(dataStore.getActivityLog()) ? dataStore.getActivityLog() : [])
  }, [])

  // Player Analytics State
  const [playerAnalytics, setPlayerAnalytics] = useState<PlayerAnalytics[]>([
    {
      playerId: 1,
      playerName: "Shuronjit",
      sessions: [
        { date: "Mon", fitness: 75, stamina: 70, speed: 80, strength: 72, technique: 78, intensity: 85 },
        { date: "Tue", fitness: 78, stamina: 73, speed: 82, strength: 74, technique: 79, intensity: 90 },
        { date: "Wed", fitness: 80, stamina: 76, speed: 81, strength: 76, technique: 82, intensity: 75 },
        { date: "Thu", fitness: 82, stamina: 79, speed: 83, strength: 78, technique: 83, intensity: 88 },
        { date: "Fri", fitness: 85, stamina: 82, speed: 85, strength: 80, technique: 85, intensity: 92 },
        { date: "Sat", fitness: 83, stamina: 80, speed: 84, strength: 79, technique: 84, intensity: 70 },
        { date: "Sun", fitness: 80, stamina: 78, speed: 82, strength: 77, technique: 82, intensity: 50 },
      ],
      avgFitness: 80,
      avgIntensity: 79,
      peakPerformance: 85,
    },
  ])

  const [selectedPlayerAnalytics, setSelectedPlayerAnalytics] = useState<PlayerAnalytics | null>(playerAnalytics[0])
  const [hasChanges, setHasChanges] = useState(false)

  // Calculate statistics
  const playerStats = {
    total: Array.isArray(players) ? players.length : 0,
    active: Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "active").length : 0,
    injured: Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "injured").length : 0,
    suspended: Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "suspended").length : 0,
    goalkeepers: Array.isArray(players) ? players.filter(p => p.category === "GK").length : 0,
    defenders: Array.isArray(players) ? players.filter(p => p.category === "DEF").length : 0,
    midfielders: Array.isArray(players) ? players.filter(p => p.category === "MID").length : 0,
    forwards: Array.isArray(players) ? players.filter(p => p.category === "FWD").length : 0,
    totalGoals: Array.isArray(players) ? players.reduce((sum, p) => sum + (p.goals || 0), 0) : 0,
    totalAssists: Array.isArray(players) ? players.reduce((sum, p) => sum + (p.assists || 0), 0) : 0,
  }

  const matchStats = {
    total: Array.isArray(matches) ? matches.length : 0,
    upcoming: Array.isArray(matches) ? matches.filter(m => m.status?.toLowerCase() === "upcoming").length : 0,
    completed: Array.isArray(matches) ? matches.filter(m => m.status?.toLowerCase() === "completed").length : 0,
    live: Array.isArray(matches) ? matches.filter(m => m.status?.toLowerCase() === "live").length : 0,
    wins: Array.isArray(matches) ? matches.filter(m => m.result === "W").length : 0,
    losses: Array.isArray(matches) ? matches.filter(m => m.result === "L").length : 0,
    draws: Array.isArray(matches) ? matches.filter(m => m.result === "D").length : 0,
  }

  const fanStats = {
    total: Array.isArray(fans) ? fans.length : 0,
    regular: Array.isArray(fans) ? fans.filter(f => f.membershipType === "regular").length : 0,
    premium: Array.isArray(fans) ? fans.filter(f => f.membershipType === "premium").length : 0,
    vip: Array.isArray(fans) ? fans.filter(f => f.membershipType === "vip").length : 0,
    active: Array.isArray(fans) ? fans.filter(f => f.status?.toLowerCase() === "active").length : 0,
  }

  const partnerStats = {
    total: Array.isArray(partners) ? partners.length : 0,
    active: Array.isArray(partners) ? partners.filter(p => p.status?.toLowerCase() === "active").length : 0,
    title: Array.isArray(partners) ? partners.filter(p => p.type === "title").length : 0,
    main: Array.isArray(partners) ? partners.filter(p => p.type === "main").length : 0,
    official: Array.isArray(partners) ? partners.filter(p => p.type === "official").length : 0,
    media: Array.isArray(partners) ? partners.filter(p => p.type === "media").length : 0,
  }

  const newsStats = {
    total: Array.isArray(news) ? news.length : 0,
    published: Array.isArray(news) ? news.filter(n => n.status === "published").length : 0,
    draft: Array.isArray(news) ? news.filter(n => n.status === "draft").length : 0,
    featured: Array.isArray(news) ? news.filter(n => n.featured).length : 0,
  }

  const contactStats = {
    total: Array.isArray(contacts) ? contacts.length : 0,
    unread: Array.isArray(contacts) ? contacts.filter(c => c.status === "unread").length : 0,
    read: Array.isArray(contacts) ? contacts.filter(c => c.status === "read").length : 0,
    replied: Array.isArray(contacts) ? contacts.filter(c => c.status === "replied").length : 0,
  }

  // Recent activity stats
  const recentActivity = Array.isArray(activityLog) ? activityLog.slice(0, 10) : []
  const todayActivity = Array.isArray(activityLog) ? activityLog.filter(log => {
    const today = new Date().toDateString()
    return new Date(log.timestamp).toDateString() === today
  }).length : 0

  // Win rate calculation
  const winRate = matchStats.completed > 0 
    ? Math.round((matchStats.wins / matchStats.completed) * 100) 
    : 0

  // Analytics Functions
  const handleUpdateSession = (sessionIndex: number, field: keyof TrainingSession, value: number | string) => {
    if (!selectedPlayerAnalytics) return
    const updated = [...playerAnalytics]
    const playerIdx = updated.findIndex(p => p.playerId === selectedPlayerAnalytics.playerId)
    if (playerIdx >= 0) {
      const newValue = typeof value === 'string' ? value : value
      updated[playerIdx].sessions[sessionIndex] = {
        ...updated[playerIdx].sessions[sessionIndex],
        [field]: newValue,
      } as TrainingSession
      setPlayerAnalytics(updated)
      setSelectedPlayerAnalytics(updated[playerIdx])
      setHasChanges(true)
    }
  }

  const calculateAverages = () => {
    if (!selectedPlayerAnalytics) return
    const updated = [...playerAnalytics]
    const playerIdx = updated.findIndex(p => p.playerId === selectedPlayerAnalytics.playerId)
    if (playerIdx >= 0) {
      const sessions = updated[playerIdx].sessions
      const avgFitness = Math.round(sessions.reduce((a, b) => a + b.fitness, 0) / sessions.length)
      const avgIntensity = Math.round(sessions.reduce((a, b) => a + b.intensity, 0) / sessions.length)
      const peakPerformance = Math.max(...sessions.map(d => d.fitness))
      
      updated[playerIdx].avgFitness = avgFitness
      updated[playerIdx].avgIntensity = avgIntensity
      updated[playerIdx].peakPerformance = peakPerformance
      
      setPlayerAnalytics(updated)
      setSelectedPlayerAnalytics(updated[playerIdx])
      setHasChanges(true)
    }
  }

  const handleSaveAnalytics = () => {
    localStorage.setItem("playerAnalytics", JSON.stringify(playerAnalytics))
    setHasChanges(false)
    alert(isBn ? "বিশ্লেষণ সফলভাবে সংরক্ষিত হয়েছে!" : "Analytics saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "বিশ্লেষণ" : "Analytics"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "টাইটান ফোর্স পারফরম্যান্স এবং পরিসংখ্যান" : "Titan Force performance and statistics"}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border-2 border-blue-500/30 bg-blue-500/10 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-3xl font-bold text-blue-400">{playerStats.total}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "খেলোয়াড়" : "Players"}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-3xl font-bold text-yellow-400">{matchStats.total}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ম্যাচ" : "Matches"}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-green-400">{fanStats.total}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অনুরাগী" : "Fans"}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-3">
            <Handshake className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-3xl font-bold text-purple-400">{partnerStats.total}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অংশীদার" : "Partners"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Squad Breakdown */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "স্কোয়াড বিশ্লেষণ" : "Squad Analysis"}
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Position Breakdown */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-400">{playerStats.goalkeepers}</div>
                <div className="text-xs text-foreground/60">GK</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{playerStats.defenders}</div>
                <div className="text-xs text-foreground/60">DEF</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{playerStats.midfielders}</div>
                <div className="text-xs text-foreground/60">MID</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{playerStats.forwards}</div>
                <div className="text-xs text-foreground/60">FWD</div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="p-4 rounded-lg bg-secondary/20">
              <h3 className={`text-sm font-semibold mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "খেলোয়াড় অবস্থা" : "Player Status"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm">{playerStats.active} {isBn ? "সক্রিয়" : "Active"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">{playerStats.injured} {isBn ? "আহত" : "Injured"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm">{playerStats.suspended} {isBn ? "স্থগিত" : "Suspended"}</span>
                </div>
              </div>
            </div>

            {/* Goals & Assists */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
                <div className="text-3xl font-bold text-primary">{playerStats.totalGoals}</div>
                <div className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "মোট গোল" : "Total Goals"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
                <div className="text-3xl font-bold text-cyan-400">{playerStats.totalAssists}</div>
                <div className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "মোট অ্যাসিস্ট" : "Total Assists"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ম্যাচ পরিসংখ্যান" : "Match Statistics"}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Win Rate */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-primary/20 border border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-primary">{winRate}%</div>
                  <div className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "জয়ের হার" : "Win Rate"}
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </div>

            {/* Match Results */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{matchStats.wins}</div>
                <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "জয়" : "Wins"}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-400">{matchStats.draws}</div>
                <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ড্র" : "Draws"}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{matchStats.losses}</div>
                <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "হার" : "Losses"}
                </div>
              </div>
            </div>

            {/* Match Status */}
            <div className="p-4 rounded-lg bg-secondary/20">
              <h3 className={`text-sm font-semibold mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ম্যাচ অবস্থা" : "Match Status"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{matchStats.upcoming} {isBn ? "আসন্ন" : "Upcoming"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-sm">{matchStats.live} {isBn ? "লাইভ" : "Live"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{matchStats.completed} {isBn ? "সম্পন্ন" : "Completed"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fan Membership */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-green-400" />
            <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ফ্যান সদস্যতা" : "Fan Membership"}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-secondary/20">
              <span className="text-sm">Regular</span>
              <span className="font-bold text-gray-400">{fanStats.regular}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/30">
              <span className="text-sm">Premium</span>
              <span className="font-bold text-blue-400">{fanStats.premium}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
              <span className="text-sm">VIP</span>
              <span className="font-bold text-yellow-400">{fanStats.vip}</span>
            </div>
          </div>
        </div>

        {/* Partner Types */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Handshake className="w-5 h-5 text-purple-400" />
            <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অংশীদার প্রকার" : "Partner Types"}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
              <span className="text-sm">{isBn ? "টাইটেল" : "Title"}</span>
              <span className="font-bold text-yellow-400">{partnerStats.title}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/30">
              <span className="text-sm">{isBn ? "মেইন" : "Main"}</span>
              <span className="font-bold text-blue-400">{partnerStats.main}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-green-500/10 border border-green-500/30">
              <span className="text-sm">{isBn ? "অফিশিয়াল" : "Official"}</span>
              <span className="font-bold text-green-400">{partnerStats.official}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-purple-500/10 border border-purple-500/30">
              <span className="text-sm">{isBn ? "মিডিয়া" : "Media"}</span>
              <span className="font-bold text-purple-400">{partnerStats.media}</span>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-5 h-5 text-orange-400" />
            <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "কন্টেন্ট পরিসংখ্যান" : "Content Stats"}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-secondary/20">
              <span className="text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                {isBn ? "সংবাদ" : "News"}
              </span>
              <span className="font-bold text-orange-400">{newsStats.total}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/20">
              <span className="text-sm flex items-center gap-2">
                <Image className="w-4 h-4" />
                {isBn ? "মিডিয়া" : "Media"}
              </span>
              <span className="font-bold text-pink-400">{media.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/20">
              <span className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {isBn ? "বার্তা" : "Messages"}
              </span>
              <span className="font-bold text-cyan-400">{contactStats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Player Training Analytics Editor */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড় প্রশিক্ষণ বিশ্লেষণ" : "Player Training Analytics"}
            </h2>
          </div>
          <button
            onClick={handleSaveAnalytics}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {hasChanges ? (isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes") : (isBn ? "কোন পরিবর্তন নেই" : "No Changes")}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Player List */}
          <div className="rounded-lg border-2 border-secondary bg-card p-4">
            <h3 className={`text-sm font-semibold mb-3 text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড়রা" : "Players"}
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {playerAnalytics.map((player) => (
                <button
                  key={player.playerId}
                  onClick={() => setSelectedPlayerAnalytics(player)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedPlayerAnalytics?.playerId === player.playerId
                      ? "border-primary bg-primary/10"
                      : "border-secondary hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-foreground text-sm">{player.playerName}</div>
                  <div className="text-xs text-foreground/60">ID: {player.playerId}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Analytics Editor */}
          {selectedPlayerAnalytics && (
            <div className="lg:col-span-3 rounded-lg border-2 border-secondary bg-card p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/20 border-2 border-secondary">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-xs text-foreground/60">{isBn ? "গড় ফিটনেস" : "Avg Fitness"}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{selectedPlayerAnalytics.avgFitness}%</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20 border-2 border-secondary">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-foreground/60">{isBn ? "গড় তীব্রতা" : "Avg Intensity"}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{selectedPlayerAnalytics.avgIntensity}%</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20 border-2 border-secondary">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-foreground/60">{isBn ? "শীর্ষ পারফরম্যান্স" : "Peak"}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{selectedPlayerAnalytics.peakPerformance}%</div>
                </div>
              </div>

              {/* Session Data Editor */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সাপ্তাহিক প্রশিক্ষণ সেশন" : "Weekly Training Sessions"}
                  </h3>
                  <button
                    onClick={calculateAverages}
                    className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition"
                  >
                    {isBn ? "গণনা করুন" : "Calculate Avg"}
                  </button>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {selectedPlayerAnalytics.sessions.map((session, idx) => (
                    <div key={idx} className="p-3 rounded-lg border-2 border-secondary bg-secondary/5">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-foreground/60 block mb-1">{isBn ? "দিন" : "Day"}</label>
                          <input
                            type="text"
                            value={session.date}
                            onChange={(e) => handleUpdateSession(idx, "date", e.target.value)}
                            className="w-full px-2 py-1 bg-background border-2 border-secondary rounded text-xs"
                            placeholder="Mon"
                          />
                        </div>
                        <div>
                          <label className="text-foreground/60 block mb-1">{isBn ? "ফিটনেস" : "Fitness"}</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={session.fitness}
                            onChange={(e) => handleUpdateSession(idx, "fitness", parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background border-2 border-secondary rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-foreground/60 block mb-1">{isBn ? "তীব্রতা" : "Intensity"}</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={session.intensity}
                            onChange={(e) => handleUpdateSession(idx, "intensity", parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background border-2 border-secondary rounded text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
