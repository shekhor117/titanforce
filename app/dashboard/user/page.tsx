"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home, User, ArrowLeft, Users, Zap, Award, Calendar, FileText, TrendingUp, MessageSquare, Trophy } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || isLoading) return
    
    if (!user) {
      router.push("/login")
    }
  }, [isClient, user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = [
    {
      icon: Users,
      label: isBn ? "সম্প্রদায় সদস্য" : "Community Member",
      value: "Active",
      color: "text-blue-500"
    },
    {
      icon: Award,
      label: isBn ? "অ্যাক্সেস স্তর" : "Access Level",
      value: isBn ? "সাধারণ ব্যবহারকারী" : "Standard User",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      label: isBn ? "বৈশিষ্ট্য অ্যাক্সেস" : "Features Available",
      value: "10+",
      color: "text-yellow-500"
    },
    {
      icon: Calendar,
      label: isBn ? "যোগদান তারিখ" : "Joined",
      value: new Date().toLocaleDateString(),
      color: "text-green-500"
    },
  ]

  const quickLinks = [
    {
      title: isBn ? "আসন্ন ম্যাচ" : "Upcoming Matches",
      description: isBn ? "পরবর্তী ম্যাচের সময়সূচী দেখুন" : "Check next match schedule",
      href: "/matches",
      icon: Calendar,
      color: "from-red-600 to-red-500"
    },
    {
      title: isBn ? "দলের খেলোয়াড়" : "Team Squad",
      description: isBn ? "সমস্ত খেলোয়াড় এবং পরিসংখ্যান" : "View all players & stats",
      href: "/squad",
      icon: Users,
      color: "from-blue-600 to-blue-500"
    },
    {
      title: isBn ? "সম্প্রদায় ফোরাম" : "Community Forum",
      description: isBn ? "ফ্যান এবং খেলোয়াড়দের সাথে আলোচনা করুন" : "Discuss with fans & players",
      href: "/users",
      icon: Users,
      color: "from-gold-500 to-yellow-500"
    },
    {
      title: isBn ? "খবর ও আপডেট" : "News & Updates",
      description: isBn ? "সর্বশেষ দল সংবাদ পান" : "Get latest team news",
      href: "/news",
      icon: FileText,
      color: "from-purple-600 to-purple-500"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "ব্যবহারকারী ড্যাশবোর্ড" : "User Dashboard"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার সম্প্রদায় কেন্দ্র" : "Your Community Hub"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title={isBn ? "পিছনে" : "Back"}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link
              href="/dashboard/user/profile"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className={`text-2xl font-semibold text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "স্বাগতম, " : "Welcome back, "} {user?.name}!
          </h2>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "TitanForce সম্প্রদায়ের অংশ হওয়ার জন্য ধন্যবাদ।" : "Thank you for being part of the TitanForce community."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-secondary bg-card/50 hover:border-primary transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xl font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "দ্রুত লিঙ্ক" : "Quick Links"}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`group p-6 rounded-lg bg-gradient-to-br ${link.color} text-white hover:shadow-lg hover:scale-105 transition transform`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 opacity-80" />
                  </div>
                  <h4 className={`text-lg font-semibold mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {link.title}
                  </h4>
                  <p className={`text-sm opacity-90 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {link.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Featured News Section */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সর্বশেষ খবর" : "Latest News"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Featured News Item */}
            <div className="group p-6 rounded-lg border-2 border-secondary bg-card/50 hover:border-primary transition">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-primary font-semibold">{isBn ? "ক্রীড়া" : "SPORTS"}</span>
                  <h4 className={`text-lg font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "টিটান ফোর্স নতুন স্ট্যাডিয়াম উদ্বোধন করল" : "Titan Force Opens New Stadium"}
                  </h4>
                  <p className={`text-sm text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "আজকের দুপুরে নতুন সুবিধা সম্প্রদায়ের জন্য খোলা হয়েছে।" : "New facilities opened today for the community."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Highlight */}
            <div className="group p-6 rounded-lg border-2 border-secondary bg-card/50 hover:border-primary transition">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-primary font-semibold">{isBn ? "পরিসংখ্যান" : "STATISTICS"}</span>
                  <h4 className={`text-lg font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "মৌসুমে ১৫ জয় অর্জন করা হয়েছে" : "15 Wins Recorded This Season"}
                  </h4>
                  <p className={`text-sm text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "দল এই মৌসুমে দুর্দান্ত কর্মক্ষমতা প্রদর্শন করছে।" : "Team performing excellently this season."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আসন্ন ইভেন্ট" : "Upcoming Events"}
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-2 border-secondary bg-card/50 flex items-center gap-4 hover:border-primary transition">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "পরবর্তী ম্যাচ: TF vs রাজ ক্লাব" : "Next Match: TF vs Raj Club"}
                </h4>
                <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "২৫ জুন, সন্ধ্যা ৬:০০ PM" : "June 25, 6:00 PM"}
                </p>
              </div>
              <Link 
                href="/matches"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm font-semibold"
              >
                {isBn ? "বিস্তারিত" : "Details"}
              </Link>
            </div>

            <div className="p-4 rounded-lg border-2 border-secondary bg-card/50 flex items-center gap-4 hover:border-primary transition">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "সম্প্রদায় মিটআপ" : "Community Meetup"}
                </h4>
                <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "প্রশিক্ষণ কেন্দ্রে - ২৭ জুন" : "Training Center - June 27"}
                </p>
              </div>
              <Link 
                href="/users"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm font-semibold"
              >
                {isBn ? "যোগ দিন" : "Join"}
              </Link>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
          <h3 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অ্যাকাউন্ট তথ্য" : "Account Information"}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-secondary">
              <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নাম" : "Name"}
              </span>
              <span className="text-foreground font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-secondary">
              <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ইমেইল" : "Email"}
              </span>
              <span className="text-foreground font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ভূমিকা" : "Role"}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
