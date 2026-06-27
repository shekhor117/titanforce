"use client"

import { useLanguage } from "@/lib/language-context"
import StoreDataService from "@/lib/store-data-service"
import GalleryDataService from "@/lib/gallery-data-service"
import TrophyDataService from "@/lib/trophy-data-service"
import PlayerDataService from "@/lib/player-data-service"
import Link from "next/link"
import { 
  Users, Trophy, Handshake, Newspaper, Image, Cog, ArrowRight, 
  TrendingUp, Calendar, Mail, Activity, BarChart3, Clock, Bell, Zap,
  Heart, Target, AlertCircle, Layers, BarChart4, Frown, Edit, ShoppingBag, Package, Boxes, TrendingDown
} from "lucide-react"
import { useState, useEffect } from "react"
import { PlayerStatsDashboard } from "@/components/player-stats-dashboard"
import { useDataStore } from "@/lib/use-data-store"

export default function AdminDashboard() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  // Get data from the hook
  const { players, matches, partners, newsItems, mediaItems, loading, error } = useDataStore()
  
  // Get local storage data
  const [fans, setFans] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [activityLog, setActivityLog] = useState<any[]>([])
  const [playerStats, setPlayerStats] = useState({ total: 0, active: 0, injured: 0, suspended: 0, byCategory: { GK: 0, DEF: 0, MID: 0, FWD: 0 } })
  const [galleryStats, setGalleryStats] = useState({ total: 0, featured: 0, byType: {} })
  const [trophyStats, setTrophyStats] = useState({ total: 0, featured: 0, byCategory: {} })
  const [storeProducts, setStoreProducts] = useState<any[]>([])
  const [storeOrders, setStoreOrders] = useState<any[]>([])
  
  useEffect(() => {
    // Load player stats from Supabase
    const loadData = async () => {
      try {
        const stats = await PlayerDataService.getPlayerStats()
        setPlayerStats(stats)
      } catch (err) {
      }
    }
    loadData()
  }, [])
  
  useEffect(() => {
    // Load gallery stats
    const loadGalleryStats = async () => {
      try {
        const stats = await GalleryDataService.getGalleryStats()
        setGalleryStats(stats)
      } catch (err) {
      }
    }
    loadGalleryStats()
  }, [])

  useEffect(() => {
    // Load trophy stats
    const loadTrophyStats = async () => {
      try {
        const stats = await TrophyDataService.getTrophyStats()
        setTrophyStats(stats)
      } catch (err) {
      }
    }
    loadTrophyStats()
  }, [])

  useEffect(() => {
    // Load store products and orders
    const loadStoreData = async () => {
      try {
        const products = await StoreDataService.getProducts()
        const orders = await StoreDataService.getOrders()
        setStoreProducts(products)
        setStoreOrders(orders)
      } catch (err) {
      }
    }
    loadStoreData()
  }, [])
  
  useEffect(() => {
    // Import dataStore to get local storage data
    const loadLocalData = async () => {
      const { dataStore } = await import("@/lib/data-store")
      setFans(Array.isArray(dataStore.getFans()) ? dataStore.getFans() : [])
      setContacts(Array.isArray(dataStore.getContacts()) ? dataStore.getContacts() : [])
      setActivityLog(Array.isArray(dataStore.getActivityLog()) ? dataStore.getActivityLog() : [])
    }
    loadLocalData()
  }, [])

  // Safely convert to arrays
  const playerList = Array.isArray(players) ? players : []
  const matchList = Array.isArray(matches) ? matches : []
  const fanList = Array.isArray(fans) ? fans : []
  const partnerList = Array.isArray(partners) ? partners : []
  const newsList = Array.isArray(newsItems) ? newsItems : []
  const mediaList = Array.isArray(mediaItems) ? mediaItems : []
  const contactList = Array.isArray(contacts) ? contacts : []
  const activityList = Array.isArray(activityLog) ? activityLog : []

  // State for player editing (kept but not used in current version)
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null)
  const [editingPlayer, setEditingPlayer] = useState(false)

  // Calculate stats
  const stats = [
    { 
      label: isBn ? "খেলোয়াড়" : "Players", 
      value: playerStats.total.toString(), 
      icon: <Users className="w-6 h-6" />, 
      href: "/admin/players",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      subtext: `${playerStats.active} ${isBn ? "সক্রিয়" : "active"}`
    },
    { 
      label: isBn ? "ম্যাচ" : "Matches", 
      value: matchList.length.toString(), 
      icon: <Trophy className="w-6 h-6" />, 
      href: "/admin/matches",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      subtext: `${matchList.filter((m: any) => m.status === "upcoming").length} ${isBn ? "আসন্ন" : "upcoming"}`
    },
    { 
      label: isBn ? "অনুরাগী" : "Fans", 
      value: fanList.length.toString(), 
      icon: <Users className="w-6 h-6" />, 
      href: "/admin/fans",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      subtext: `${fanList.filter((f: any) => f.membershipType === "vip").length} VIP`
    },
    { 
      label: isBn ? "অংশীদার" : "Partners", 
      value: partnerList.length.toString(), 
      icon: <Handshake className="w-6 h-6" />, 
      href: "/admin/partners",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      subtext: `${partnerList.filter((p: any) => p.status === "active").length} ${isBn ? "সক্রিয়" : "active"}`
    },
  ]

  const additionalStats = [
    {
      label: isBn ? "সংবাদ" : "News",
      value: newsList.length.toString(),
      icon: <Newspaper className="w-5 h-5" />,
      href: "/admin/news",
      color: "text-orange-400",
      subtext: `${newsList.filter((n: any) => n.status === "published").length} ${isBn ? "প্রকাশিত" : "published"}`
    },
    {
      label: isBn ? "মিডিয়া" : "Media",
      value: mediaList.length.toString(),
      icon: <Image className="w-6 h-6" />,
      href: "/admin/media",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      subtext: `${mediaList.filter((m: any) => m.type === "photo").length} ${isBn ? "ছবি" : "photos"}`
    },
    {
      label: isBn ? "যোগাযোগ" : "Contact",
      value: contactList.length.toString(),
      icon: <Mail className="w-6 h-6" />,
      href: "/admin/contacts",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      subtext: `${contactList.filter((c: any) => c.status === "unread").length} ${isBn ? "অপঠিত" : "unread"}`
    },
    {
      label: isBn ? "গ্যালারি" : "Gallery",
      value: galleryStats.total.toString(),
      icon: <Image className="w-6 h-6" />,
      href: "/admin/gallery",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
      subtext: `${galleryStats.featured} ${isBn ? "বৈশিষ্ট্য" : "featured"}`
    },
    {
      label: isBn ? "ট্রফি" : "Trophies",
      value: trophyStats.total.toString(),
      icon: <Trophy className="w-6 h-6" />,
      href: "/admin/trophies",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      subtext: `${trophyStats.featured} ${isBn ? "বৈশিষ্ট্য" : "featured"}`
    },
  ]

  // Build store stats from state
  const storeStats = [
    {
      label: isBn ? "পণ্য" : "Products",
      value: storeProducts.length.toString(),
      icon: <ShoppingBag className="w-6 h-6" />,
      href: "/admin/store/products",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      subtext: `${storeProducts.filter((p: any) => (p as any).inStock !== false).length} ${isBn ? "স্টকে" : "in stock"}`
    },
    {
      label: isBn ? "অর্ডার" : "Orders",
      value: storeOrders.length.toString(),
      icon: <Package className="w-6 h-6" />,
      href: "/admin/store/orders",
      color: "text-lime-400",
      bgColor: "bg-lime-500/10",
      borderColor: "border-lime-500/30",
      subtext: `${storeOrders.filter((o: any) => o.status === "pending").length} ${isBn ? "অপেক্ষমান" : "pending"}`
    },
    {
      label: isBn ? "ইনভেন্টরি" : "Inventory",
      value: storeProducts.reduce((sum: number, p: any) => sum + (p.totalStock || 0), 0).toString(),
      icon: <Boxes className="w-6 h-6" />,
      href: "/admin/store/inventory",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      subtext: `${storeProducts.filter((p: any) => (p.totalStock || 0) < 10).length} ${isBn ? "কম স্টক" : "low stock"}`
    },
    {
      label: isBn ? "বিক্রয়" : "Sales",
      value: `৳${storeOrders.reduce((sum: any, o: any) => sum + (o.total || 0), 0)}`,
      icon: <TrendingUp className="w-6 h-6" />,
      href: "/admin/store/analytics",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      subtext: `${storeOrders.filter((o: any) => o.status === "delivered").length} ${isBn ? "সম্পন্ন" : "completed"}`
    },
  ]


  const quickActions = [
    { 
      label: isBn ? "খেলোয়াড় যোগ করুন" : "Add Player", 
      description: isBn ? "নতুন খেলোয়াড় তৈরি করুন" : "Create a new player profile",
      href: "/admin/players", 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      label: isBn ? "ম্যাচ যোগ করুন" : "Add Match", 
      description: isBn ? "নতুন ম্যাচ সময়সূচী করুন" : "Schedule a new match",
      href: "/admin/matches", 
      icon: <Trophy className="w-5 h-5" /> 
    },
    { 
      label: isBn ? "সংবাদ যোগ করুন" : "Add News", 
      description: isBn ? "নতুন সংবাদ প্রকাশ করুন" : "Publish a news article",
      href: "/admin/news", 
      icon: <Newspaper className="w-5 h-5" /> 
    },
    { 
      label: isBn ? "মিডিয়া আপলোড" : "Upload Media", 
      description: isBn ? "ছবি এবং ভিডিও আপলোড করুন" : "Upload photos and videos",
      href: "/admin/media", 
      icon: <Image className="w-5 h-5" /> 
    },
    { 
      label: isBn ? "সিস্টেম কন্ট্রোল" : "System Control", 
      description: isBn ? "ব্যাকআপ, এক্সপোর্ট এবং ইম্পোর্ট" : "Backup, export and import data",
      href: "/admin/system", 
      icon: <Cog className="w-5 h-5" /> 
    },
  ]

  const advancedTools = [
    { 
      label: isBn ? "প্রশিক্ষণ বিশ্লেষণ" : "Training Analytics", 
      description: isBn ? "খেলোয়াড় প্রশিক্ষণ পারফরম্যান্স সম্পাদনা করুন" : "Edit player training performance data",
      href: "/admin/analytics", 
      icon: <Activity className="w-5 h-5" />,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    { 
      label: isBn ? "ম্যাচ অফ দ্য ম্যাচ" : "Man of the Match", 
      description: isBn ? "ম্যাচ রেটিং এবং ভোটিং পরিচালনা করুন" : "Manage match ratings and voting",
      href: "/admin/motm", 
      icon: <Trophy className="w-5 h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    { 
      label: isBn ? "লাইনআপ বিল্ডার" : "Lineup Builder", 
      description: isBn ? "দল গঠন এবং ট্যাকটিক্স সেট করুন" : "Build team formations and tactics",
      href: "/admin/lineup", 
      icon: <Layers className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    { 
      label: isBn ? "খেলোয়াড় র‍্যাঙ্কিং" : "Player Rankings", 
      description: isBn ? "খেলোয়াড় র‍্যাঙ্কিং এবং রেটিং সম্পাদনা করুন" : "Edit player rankings and ratings",
      href: "/admin/rankings", 
      icon: <BarChart4 className="w-5 h-5" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    { 
      label: isBn ? "আঘাত ট্র্যাকিং" : "Injury Tracking", 
      description: isBn ? "খেলোয়াড় আঘাত এবং পুনরুদ্ধার পরিচালনা করুন" : "Manage player injuries and recovery",
      href: "/admin/injuries", 
      icon: <Heart className="w-5 h-5" />,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    },
    { 
      label: isBn ? "বৈশিষ্ট্য পরিচালনা" : "Feature Management", 
      description: isBn ? "প্ল্যাটফর্ম বৈশিষ্ট্যগুলি সক্ষম/নিষ্ক্রিয় করুন" : "Enable or disable platform features",
      href: "/admin/features", 
      icon: <Zap className="w-5 h-5" />,
      color: "text-yellow-300",
      bgColor: "bg-yellow-500/10"
    },
    { 
      label: isBn ? "বিশ্লেষণ ড্যাশবোর্ড" : "Analytics Dashboard", 
      description: isBn ? "বিস্তারিত পারফরম্যান্স মেট্রিক্স দেখুন" : "View detailed performance metrics",
      href: "/admin/analytics", 
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    { 
      label: isBn ? "ব্যবহারকারী ব্যবস্থাপনা" : "User Management", 
      description: isBn ? "সমস্ত ব্যবহারকারী অ্যাকাউন্ট পরিচালনা করুন" : "Manage all user accounts",
      href: "/admin/users", 
      icon: <Users className="w-5 h-5" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    { 
      label: isBn ? "সিস্টেম সেটিংস" : "System Settings", 
      description: isBn ? "উন্নত সিস্টেম কনফিগারেশন" : "Advanced system configuration",
      href: "/admin/system", 
      icon: <Cog className="w-5 h-5" />,
      color: "text-green-300",
      bgColor: "bg-green-500/10"
    },
    { 
      label: isBn ? "সেটিংস এবং কনফিগ" : "Settings & Config", 
      description: isBn ? "অ্যাপ্লিকেশন সেটিংস কনফিগার করুন" : "Configure application settings",
      href: "/admin/settings", 
      icon: <Cog className="w-5 h-5" />,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    },
  ]

  // Format activity time
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return isBn ? "এইমাত্র" : "Just now"
    if (minutes < 60) return `${minutes} ${isBn ? "মিনিট আ��ে" : "min ago"}`
    if (hours < 24) return `${hours} ${isBn ? "ঘন্টা আগে" : "hr ago"}`
    return `${days} ${isBn ? "দিন আগে" : "days ago"}`
  }

  // Get action color
  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      create: "bg-green-500/30 text-green-300",
      update: "bg-blue-500/30 text-blue-300",
      delete: "bg-red-500/30 text-red-300",
      login: "bg-cyan-500/30 text-cyan-300",
      export: "bg-yellow-500/30 text-yellow-300",
      import: "bg-purple-500/30 text-purple-300",
    }
    return colors[action] || "bg-secondary text-foreground/60"
  }

  return (
    <div className="space-y-8">
      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          <p>{isBn ? "ডেটা লোড করতে ত্রুটি: " : "Error loading data: "}{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-2xl sm:text-3xl md:text-4xl tracking-wider text-foreground mb-1 sm:mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
          </h1>
          <p className={`text-xs sm:text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ট্রাইটান ফোর্স ম্যানেজমেন্ট সিস্টেম" : "Titan Force Management System"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {contactList.filter((c: any) => c.status === "unread").length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {contactList.filter((c: any) => c.status === "unread").length}
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform min-h-[140px] sm:min-h-[160px] flex flex-col justify-between`}
          >
            <div className={`${stat.color} mb-2 sm:mb-3`}>{stat.icon}</div>
            <div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-[var(--font-display)] ${stat.color}`}>{stat.value}</div>
              <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 sm:mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {stat.label}
              </div>
              {stat.subtext && (
                <div className="text-xs text-foreground/40 mt-1 line-clamp-1">
                  {stat.subtext}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>



      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {additionalStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-secondary bg-card/50 transition"
          >
            <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {stat.label} - {stat.subtext}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/30" />
          </Link>
        ))}
      </div>

      {/* Store Management Section */}
      {storeStats.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "স্টোর ম্যানেজমেন্ট" : "Store Management"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeStats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className={`rounded-xl p-6 border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                <div className={`text-3xl font-[var(--font-display)] ${stat.color}`}>{stat.value}</div>
                <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {stat.label}
                </div>
                {stat.subtext && (
                  <div className="text-xs text-foreground/40 mt-1">
                    {stat.subtext}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "দ্রুত কার্যক্রম" : "Quick Actions"}
          </h2>
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-primary/10 border border-transparent transition group"
              >
                <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {action.label}
                  </div>
                  <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {action.description}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-primary transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সাম্প্রতিক কার্যকলাপ" : "Recent Activity"}
            </h2>
            <Link 
              href="/admin/system"
              className="text-sm text-primary hover:underline"
            >
              {isBn ? "সব দেখুন" : "View all"}
            </Link>
          </div>
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {activityList.length > 0 ? (
              activityList.slice(0, 8).map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getActionColor(log.action)}`}>
                    {log.action}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{log.description}</p>
                    <p className="text-xs text-foreground/50 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatActivityTime(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-foreground/50">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
                  {isBn ? "কোনো কার্যকলাপ নেই" : "No recent activity"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Player Edit Section */}
      <div className="rounded-xl border-2 border-blue-500/30 bg-blue-500/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড় দ্রুত সম্পাদনা" : "Quick Player Edit"}
            </h2>
          </div>
          <Link 
            href="/admin/players"
            className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
          >
            {isBn ? "সব দেখুন" : "View all"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Players List */}
          <div className="md:col-span-1 rounded-lg border-2 border-secondary bg-card p-4">
            <h3 className={`text-sm font-semibold mb-3 text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "দল" : "Squad"}
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {playerList.slice(0, 10).map((player: any) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`w-full text-left p-2 rounded-lg border-2 transition ${
                    selectedPlayer?.id === player.id
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-secondary hover:border-blue-400/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs">
                      {player.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground truncate">{player.name}</div>
                      <div className="text-xs text-foreground/60">{player.pos}</div>
                    </div>
                  </div>
                </button>
              ))}
              {playerList.length > 10 && (
                <Link 
                  href="/admin/players"
                  className="w-full text-center text-xs text-primary hover:underline py-2"
                >
                  {isBn ? "আরও দেখুন" : "View more"}
                </Link>
              )}
            </div>
          </div>

          {/* Player Details */}
          {selectedPlayer ? (
            <div className="md:col-span-2 rounded-lg border-2 border-secondary bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedPlayer.fullName}
                </h3>
                <Link
                  href={`/admin/players`}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition text-sm"
                >
                  <Edit className="w-4 h-4" />
                  {isBn ? "সম্পাদনা করুন" : "Edit"}
                </Link>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "অবস্থান" : "Position"}</div>
                  <div className="text-sm font-semibold text-foreground">{selectedPlayer.pos}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "বয়স" : "Age"}</div>
                  <div className="text-sm font-semibold text-foreground">{selectedPlayer.age}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "লক্ষ্য" : "Goals"}</div>
                  <div className="text-sm font-semibold text-green-400">{selectedPlayer.goals}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "সহায়তা" : "Assists"}</div>
                  <div className="text-sm font-semibold text-blue-400">{selectedPlayer.assists}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "অবস্থা" : "Status"}</div>
                  <div className={`text-sm font-semibold ${
                    selectedPlayer.status === "active" ? "text-green-400" :
                    selectedPlayer.status === "injured" ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {selectedPlayer.status.charAt(0).toUpperCase() + selectedPlayer.status.slice(1)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60">{isBn ? "সিজন" : "Season"}</div>
                  <div className="text-sm font-semibold text-foreground">{selectedPlayer.seasonYear || "2024-2025"}</div>
                </div>
              </div>

              {/* Bio */}
              {selectedPlayer.bio && (
                <div className="p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-foreground/60 mb-1">{isBn ? "জীবনী" : "Bio"}</div>
                  <p className="text-sm text-foreground line-clamp-3">{selectedPlayer.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="md:col-span-2 rounded-lg border-2 border-secondary bg-card p-8 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-foreground/30" />
                <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "একজন খেলোয়াড় নির্বাচন করুন" : "Select a player to view details"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Tools Section */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-primary" />
          <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "উন্নত সরঞ্জাম" : "Advanced Tools"}
          </h2>
        </div>
        <p className={`text-foreground/60 text-sm mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "প্ল্যাটফর্মের উন্নত বৈশিষ্ট্য এবং কনফিগার���শন পরিচালনা করুন" : "Manage advanced features and configurations for the platform"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advancedTools.map((tool) => (
            <Link
              key={tool.label}
              href={tool.href}
              className={`group p-4 rounded-lg border-2 border-secondary ${tool.bgColor} hover:scale-105 transition-all`}
            >
              <div className={`${tool.color} mb-3 p-2 rounded-lg bg-secondary/30 inline-block group-hover:bg-primary/20 transition`}>
                {tool.icon}
              </div>
              <h3 className={`font-semibold text-foreground text-sm mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {tool.label}
              </h3>
              <p className={`text-xs text-foreground/60 line-clamp-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {tool.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition">
                {isBn ? "অ্যাক্সেস করুন" : "Access"}
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Player Data Integration Section */}
      <div className="space-y-6 border-t-2 border-secondary pt-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "খেলোয়াড় বিশ্লেষণ" : "Player Analytics"}
          </h2>
        </div>

        {/* Player Stats Dashboard with error boundary */}
        <div>
          {playerList && playerList.length > 0 ? (
            <PlayerStatsDashboard players={playerList} />
          ) : (
            <div className="rounded-lg border-2 border-secondary bg-card/50 p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-foreground/60">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{isBn ? "খেলোয়াড় ডেটা লোড হচ্ছে..." : "Loading player data..."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="rounded-xl border-2 border-primary/50 bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সিস্টেম ওভারভিউ" : "System Overview"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-2xl font-bold text-primary">{playerList?.length || 0}</div>
          </div>
          <div className="flex-1 flex flex-col items-start">
            <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মোট খেলোয়াড়" : "Total Players"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-card/50 bg-card/30/50 hover:bg-card/50 transition-all group">
        <div className="flex items-start justify-between">
          <Trophy className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-bold text-yellow-400">{matchList?.length || 0}</div>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট ম্যাচ" : "Total Matches"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-card/50 bg-card/30/50 hover:bg-card/50 transition-all group">
        <div className="flex items-start justify-between">
          <Users className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-bold text-green-400">{fanList?.length || 0}</div>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট অনুরাগী" : "Total Fans"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-card/50 bg-card/30/50 hover:bg-card/50 transition-all group">
        <div className="flex items-start justify-between">
          <Handshake className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-bold text-purple-400">{partnerList?.length || 0}</div>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট অংশীদার" : "Total Partners"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-card/50 bg-card/30/50 hover:bg-card/50 transition-all group">
        <div className="flex items-start justify-between">
          <Newspaper className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-bold text-orange-400">{newsList?.length || 0}</div>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট সংবাদ" : "Total News"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-card/50 bg-card/30/50 hover:bg-card/50 transition-all group">
        <div className="flex items-start justify-between">
          <Image className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-bold text-pink-400">{mediaList?.length || 0}</div>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <p className={`text-xs uppercase tracking-widest text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মোট মিডিয়া" : "Total Media"}
          </p>
        </div>
      </div>
    </div>
  )
}
