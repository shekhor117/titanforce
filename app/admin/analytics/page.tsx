"use client"

import { useLanguage } from "@/lib/language-context"
import { dataStore, useDataStore } from "@/lib/data-store"
import { 
  BarChart3, TrendingUp, Users, Trophy, Newspaper, Image, 
  Handshake, Mail, Activity, Calendar, Clock, ArrowUp, ArrowDown
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  // Get all data
  const players = useDataStore(dataStore.getPlayers, "players")
  const matches = useDataStore(dataStore.getMatches, "matches")
  const fans = useDataStore(dataStore.getFans, "fans")
  const partners = useDataStore(dataStore.getPartners, "partners")
  const news = useDataStore(dataStore.getNews, "news")
  const media = useDataStore(dataStore.getMedia, "media")
  const contacts = useDataStore(dataStore.getContacts, "contacts")
  const activityLog = useDataStore(dataStore.getActivityLog, "activityLog")

  // Calculate statistics
  const playerStats = {
    total: players.length,
    active: players.filter(p => p.status === "active").length,
    injured: players.filter(p => p.status === "injured").length,
    suspended: players.filter(p => p.status === "suspended").length,
    goalkeepers: players.filter(p => p.cat === "GK").length,
    defenders: players.filter(p => p.cat === "DEF").length,
    midfielders: players.filter(p => p.cat === "MID").length,
    forwards: players.filter(p => p.cat === "FWD").length,
    totalGoals: players.reduce((sum, p) => sum + p.goals, 0),
    totalAssists: players.reduce((sum, p) => sum + p.assists, 0),
  }

  const matchStats = {
    total: matches.length,
    upcoming: matches.filter(m => m.status === "upcoming").length,
    completed: matches.filter(m => m.status === "completed").length,
    live: matches.filter(m => m.status === "live").length,
    wins: matches.filter(m => m.result === "W").length,
    losses: matches.filter(m => m.result === "L").length,
    draws: matches.filter(m => m.result === "D").length,
  }

  const fanStats = {
    total: fans.length,
    regular: fans.filter(f => f.membershipType === "regular").length,
    premium: fans.filter(f => f.membershipType === "premium").length,
    vip: fans.filter(f => f.membershipType === "vip").length,
    active: fans.filter(f => f.status === "active").length,
  }

  const partnerStats = {
    total: partners.length,
    active: partners.filter(p => p.status === "active").length,
    title: partners.filter(p => p.type === "title").length,
    main: partners.filter(p => p.type === "main").length,
    official: partners.filter(p => p.type === "official").length,
    media: partners.filter(p => p.type === "media").length,
  }

  const newsStats = {
    total: news.length,
    published: news.filter(n => n.status === "published").length,
    draft: news.filter(n => n.status === "draft").length,
    featured: news.filter(n => n.featured).length,
  }

  const contactStats = {
    total: contacts.length,
    unread: contacts.filter(c => c.status === "unread").length,
    read: contacts.filter(c => c.status === "read").length,
    replied: contacts.filter(c => c.status === "replied").length,
  }

  // Recent activity stats
  const recentActivity = activityLog.slice(0, 10)
  const todayActivity = activityLog.filter(log => {
    const today = new Date().toDateString()
    return new Date(log.timestamp).toDateString() === today
  }).length

  // Win rate calculation
  const winRate = matchStats.completed > 0 
    ? Math.round((matchStats.wins / matchStats.completed) * 100) 
    : 0

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

      {/* Activity Overview */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "কার্যকলাপ সংক্ষিপ্তসার" : "Activity Summary"}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">{todayActivity} {isBn ? "আজকের কার্যকলাপ" : "today"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-xl font-bold text-green-400">
              {activityLog.filter(l => l.action === "create").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "তৈরি" : "Created"}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="text-xl font-bold text-blue-400">
              {activityLog.filter(l => l.action === "update").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "আপডেট" : "Updated"}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-xl font-bold text-red-400">
              {activityLog.filter(l => l.action === "delete").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "মুছে ফেলা" : "Deleted"}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-xl font-bold text-purple-400">
              {activityLog.filter(l => l.action === "login").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "লগইন" : "Logins"}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="text-xl font-bold text-yellow-400">
              {activityLog.filter(l => l.action === "export").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "এক্সপোর্ট" : "Exports"}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-xl font-bold text-cyan-400">
              {activityLog.filter(l => l.action === "import").length}
            </div>
            <div className="text-xs text-foreground/60">{isBn ? "ইম্পোর্ট" : "Imports"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
