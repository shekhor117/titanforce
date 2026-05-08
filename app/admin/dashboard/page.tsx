"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { Users, Trophy, Handshake, Newspaper, Image, Settings, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const stats = [
    { 
      label: isBn ? "খেলোয়াড়" : "Players", 
      value: "0", 
      icon: <Users className="w-6 h-6" />, 
      href: "/admin/players",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    { 
      label: isBn ? "ম্যাচ" : "Matches", 
      value: "0", 
      icon: <Trophy className="w-6 h-6" />, 
      href: "/admin/matches",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    { 
      label: isBn ? "অনুরাগী" : "Fans", 
      value: "0", 
      icon: <Users className="w-6 h-6" />, 
      href: "/admin/fans",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    { 
      label: isBn ? "অংশীদার" : "Partners", 
      value: "0", 
      icon: <Handshake className="w-6 h-6" />, 
      href: "/admin/partners",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
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
      label: isBn ? "সেটিংস" : "Settings", 
      description: isBn ? "সাইট সেটিংস পরিচালনা করুন" : "Manage site settings",
      href: "/admin/settings", 
      icon: <Settings className="w-5 h-5" /> 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "টাইটান ফোর্স ম্যানেজমেন্ট সিস্টেম" : "Titan Force Management System"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-xl p-6 border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform`}
          >
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <div className={`text-3xl font-[var(--font-display)] ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "দ্রুত কার্যক্রম" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-primary/10 hover:border-primary border border-transparent transition group"
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

      {/* Getting Started */}
      <div className="rounded-xl border-2 border-primary/50 bg-primary/5 p-6">
        <h2 className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "শুরু করুন" : "Getting Started"}
        </h2>
        <div className={`text-foreground/80 space-y-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          <p>
            {isBn 
              ? "এটি আপনার টাইটান ফোর্স অ্যাডমিন প্যানেল। এখান থেকে আপনি পরিচালনা করতে পারেন:" 
              : "This is your Titan Force admin panel. From here you can manage:"}
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{isBn ? "খেলোয়াড় - দলের সদস্যদের যোগ এবং সম্পাদনা করুন" : "Players - Add and edit team members"}</li>
            <li>{isBn ? "ম্যাচ - খেলার সময়সূচী এবং ফলাফল" : "Matches - Schedule games and record results"}</li>
            <li>{isBn ? "সংবাদ - দলের আপডেট প্রকাশ করুন" : "News - Publish team updates"}</li>
            <li>{isBn ? "মিডিয়া - ছবি এবং ভিডিও আপলোড করুন" : "Media - Upload photos and videos"}</li>
            <li>{isBn ? "অংশীদার - স্পন্সর পরিচালনা করুন" : "Partners - Manage sponsors"}</li>
            <li>{isBn ? "অনুরাগী - ফ্যান বেস পরিচালনা করুন" : "Fans - Manage your fan base"}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
