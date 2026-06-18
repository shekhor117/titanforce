"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home, User, ArrowLeft, Users, Zap, Award, Calendar } from "lucide-react"

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
      title: isBn ? "খেলোয়াড় ব্রাউজ করুন" : "Browse Players",
      description: isBn ? "দলের খেলোয়াড়দের আবিষ্কার করুন" : "Discover team players",
      href: "/squad",
      icon: Users,
      color: "from-blue-600 to-blue-400"
    },
    {
      title: isBn ? "ম্যাচ দেখুন" : "Watch Matches",
      description: isBn ? "সাম্প্রতিক ম্যাচ এবং হাইলাইট" : "Recent matches & highlights",
      href: "/matches",
      icon: Award,
      color: "from-purple-600 to-purple-400"
    },
    {
      title: isBn ? "সম্প্রদায়ে যোগ দিন" : "Join Community",
      description: isBn ? "অনুরাগী এবং খেলোয়াড়দের সাথে সংযোগ করুন" : "Connect with fans & players",
      href: "/users",
      icon: Users,
      color: "from-green-600 to-green-400"
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
