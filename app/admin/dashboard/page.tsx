"use client"

import { useLanguage } from "@/lib/language-context"
import { useDataStore } from "@/lib/use-data-store"
import Link from "next/link"
import { 
  Users, Trophy, Handshake, Newspaper, Image, Settings, ArrowRight, 
  TrendingUp, Calendar, Mail, Activity, BarChart3, Clock, Bell, Zap,
  Heart, Target, AlertCircle, Layers, BarChart4, Frown, Edit, ShoppingBag, Package, Boxes, TrendingDown
} from "lucide-react"
import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  // Get data from hooks with real-time sync
  const { players = [], matches = [], partners = [], newsItems = [], mediaItems = [] } = useDataStore()
  
  // Get local storage data
  const [fans, setFans] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  
  useEffect(() => {
    // Load from local storage
    const storedFans = localStorage.getItem("fans")
    const storedContacts = localStorage.getItem("contacts")
    
    if (storedFans) setFans(JSON.parse(storedFans))
    if (storedContacts) setContacts(JSON.parse(storedContacts))
  }, [])

  // Calculate stats
  const stats = [
    { 
      label: isBn ? "খেলোয়াড়" : "Players", 
      value: players.length.toString(), 
      icon: <Users className="w-6 h-6" />, 
      href: "/admin/players",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      subtext: `${players.filter((p: any) => p.status === "active").length} ${isBn ? "সক্রিয়" : "active"}`
    },
    { 
      label: isBn ? "ম্যাচ" : "Matches", 
      value: matches.length.toString(), 
      icon: <Trophy className="w-6 h-6" />, 
      href: "/admin/matches",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      subtext: `${matches.filter((m: any) => m.status === "upcoming").length} ${isBn ? "আসন্ন" : "upcoming"}`
    },
    { 
      label: isBn ? "অনুরাগী" : "Fans", 
      value: fans.length.toString(), 
      icon: <Heart className="w-6 h-6" />, 
      href: "/admin/fans",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      subtext: `${fans.filter((f: any) => f.membershipType === "vip").length} VIP`
    },
    { 
      label: isBn ? "অংশীদার" : "Partners", 
      value: partners.length.toString(), 
      icon: <Handshake className="w-6 h-6" />, 
      href: "/admin/partners",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      subtext: `${partners.filter((p: any) => p.status === "active").length} ${isBn ? "সক্রিয়" : "active"}`
    },
  ]

  const additionalStats = [
    {
      label: isBn ? "সংবাদ" : "News",
      value: newsItems.length.toString(),
      icon: <Newspaper className="w-5 h-5" />,
      href: "/admin/news",
      color: "text-orange-400",
      subtext: `${newsItems.filter((n: any) => n.status === "published").length} ${isBn ? "প্রকাশিত" : "published"}`
    },
    {
      label: isBn ? "মিডিয়া" : "Media",
      value: mediaItems.length.toString(),
      icon: <Image className="w-6 h-6" />,
      href: "/admin/media",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      subtext: `${mediaItems.filter((m: any) => m.type === "photo").length} ${isBn ? "ছবি" : "photos"}`
    },
    {
      label: isBn ? "যোগাযোগ" : "Contact",
      value: contacts.length.toString(),
      icon: <Mail className="w-6 h-6" />,
      href: "/admin/contacts",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      subtext: `${contacts.filter((c: any) => c.status === "unread").length} ${isBn ? "অপঠিত" : "unread"}`
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{isBn ? "ড্যাশবোর্ড" : "Dashboard"}</h1>
          <p className="text-foreground/60 mt-2">{isBn ? "আপনার ক্লাবের সামগ্রিক পরিসংখ্যান" : "Overall statistics of your club"}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href}>
            <div className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg bg-foreground/5`}>
                  {stat.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/60 transition-colors" />
              </div>
              <h3 className="text-foreground/70 text-sm font-medium mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-foreground/60">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Stats */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">{isBn ? "অন্যান্য" : "Other"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalStats.map((stat, idx) => (
            <Link key={idx} href={stat.href}>
              <div className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg bg-foreground/5`}>
                    {stat.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/60 transition-colors" />
                </div>
                <h3 className="text-foreground/70 text-sm font-medium mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-foreground/60">{stat.subtext}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">{isBn ? "দ্রুত লিঙ্ক" : "Quick Links"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/players" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <span className="text-sm text-foreground">{isBn ? "খেলোয়াড়" : "Players"}</span>
          </Link>
          <Link href="/admin/matches" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <span className="text-sm text-foreground">{isBn ? "ম্যাচ" : "Matches"}</span>
          </Link>
          <Link href="/admin/gallery" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center">
            <Image className="w-6 h-6 mx-auto mb-2 text-pink-400" />
            <span className="text-sm text-foreground">{isBn ? "গ্যালারি" : "Gallery"}</span>
          </Link>
          <Link href="/admin/store/products" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center">
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <span className="text-sm text-foreground">{isBn ? "স্টোর" : "Store"}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
