"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home, User, ArrowLeft } from "lucide-react"
import { ProfileCompletion } from "@/components/dashboard/profile-completion"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { Dashboard3DWrapper } from "@/components/dashboard-3d-wrapper"
import { PersonalizedRecommendations } from "@/components/dashboard/personalized-recommendations"

export default function PartnerDashboard() {
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
    
    if (!user || user.role !== "partner") {
      router.push("/login")
    }
  }, [isClient, user, isLoading, router])

  if (isLoading || !user || user.role !== "partner") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const profileFields = [
    { name: "company_name", completed: true, label: isBn ? "কোম্পানির নাম" : "Company Name" },
    { name: "website", completed: true, label: isBn ? "ওয়েবসাইট" : "Website" },
    { name: "logo", completed: false, label: isBn ? "লোগো" : "Logo" },
    { name: "contact_info", completed: true, label: isBn ? "যোগাযোগ তথ্য" : "Contact Info" },
  ]

  const metrics = [
    { id: "1", label: isBn ? "সক্রিয় ক্যাম্পেইন" : "Active Campaigns", value: 12, change: 5, changeType: "increase" as const },
    { id: "2", label: isBn ? "মোট ইম্প্রেশন" : "Total Impressions", value: "8.5K", change: 18, changeType: "increase" as const },
    { id: "3", label: isBn ? "এনগেজমেন্ট হার" : "Engagement Rate", value: "4.8%", change: 12, changeType: "increase" as const },
    { id: "4", label: isBn ? "রূপান্তর" : "Conversions", value: 342, change: 28, changeType: "increase" as const },
  ]

  const activities = [
    { id: "1", type: "achievement" as const, title: isBn ? "ক্যাম্পেইন চালু হয়েছে" : "Campaign Launched", description: isBn ? "আপনার নতুন 'গ্রীষ্মকালীন প্রচার' ক্যাম্পেইন সফলভাবে চালু হয়েছে" : "Your new 'Summer Campaign' has been successfully launched", timestamp: "2 hours ago" },
    { id: "2", type: "milestone" as const, title: isBn ? "১০K ইম্প্রেশন মাইলস্টোন" : "10K Impressions", description: isBn ? "আপনার ক্যাম্পেইনগুলি ১০,০০০ ইম্প্রেশনে পৌঁছেছে" : "Your campaigns have reached 10,000 impressions", timestamp: "1 day ago" },
    { id: "3", type: "goal" as const, title: isBn ? "এনগেজমেন্ট লক্ষ্য অর্জিত" : "Engagement Target Met", description: isBn ? "আপনি এই মাসের এনগেজমেন্ট লক্ষ্য অতিক্রম করেছেন" : "You've exceeded this month's engagement target", timestamp: "3 days ago" },
  ]

  const upcomingEvents = [
    { id: "1", title: isBn ? "স্পন্সরশিপ পর্যালোচনা মিটিং" : "Sponsorship Review", date: "May 9", time: "10:00 AM", type: "event" as const, status: "upcoming" as const },
    { id: "2", title: isBn ? "ত্রৈমাসিক রিপোর্ট জমা দেওয়ার সময়সীমা" : "Q2 Report Deadline", date: "May 31", time: "5:00 PM", type: "deadline" as const, status: "upcoming" as const },
    { id: "3", title: isBn ? "নতুন ক্যাম্পেইন পরিকল্পনা সেশন" : "Campaign Planning Session", date: "May 15", time: "2:00 PM", type: "event" as const, status: "upcoming" as const },
  ]

  const recommendations = [
    { id: "1", title: isBn ? "প্রিমিয়াম স্পন্সরশিপ প্যাকেজ" : "Premium Sponsorship Upgrade", description: isBn ? "এক্সক্লুসিভ সুবিধা এবং বর্ধিত দৃশ্যমানতার জন্য আপগ্রেড করুন" : "Upgrade to access exclusive benefits and increased visibility", action: isBn ? "আপগ্রেড করুন" : "Upgrade", priority: "high" as const },
    { id: "2", title: isBn ? "ভিডিও বিজ্ঞাপন পরীক্ষা করুন" : "Try Video Advertising", description: isBn ? "আরও বেশি এনগেজমেন্টের জন্য ভিডিও ক্যাম্পেইনে সুইচ করুন" : "Switch to video campaigns for higher engagement rates", action: isBn ? "শিখুন" : "Learn More", priority: "medium" as const },
    { id: "3", title: isBn ? "পারফরম্যান্স বিশ্লেষণ" : "Performance Analytics", description: isBn ? "উন্নত বিশ্লেষণ সরঞ্জাম দিয়ে আপনার আরওআই অপ্টিমাইজ করুন" : "Optimize your ROI with advanced analytics tools", action: isBn ? "অ্যাক্সেস করুন" : "Access", priority: "medium" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "অংশীদার ড্যাশবোর্ড" : "Partner Dashboard"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "স্পন্সরশিপ এবং বিপণন সুযোগ" : "Sponsorship & marketing opportunities"}
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
              href="/dashboard/partner/profile"
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

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className={`text-2xl font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "স্বাগতম, " : "Welcome back, "} {user?.name}!
        </h2>

        {/* Top Section - Key Metrics */}
        <div className="mb-8">
          <PerformanceMetrics metrics={metrics} language={language as "en" | "bn"} title={isBn ? "ক্যাম্পেইন পারফরম্যান্স" : "Campaign Performance"} />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Profile & Recommendations */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCompletion fields={profileFields} language={language as "en" | "bn"} />
            <PersonalizedRecommendations recommendations={recommendations} language={language as "en" | "bn"} />
          </div>

          {/* Middle Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed items={activities} language={language as "en" | "bn"} />
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="lg:col-span-1">
            <UpcomingEvents events={upcomingEvents} language={language as "en" | "bn"} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/partner/sponsorships" className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-center font-semibold">
            {isBn ? "স্পন্সরশিপ পরিচালনা করুন" : "Manage Sponsorships"}
          </Link>
          <Link href="/dashboard/partner/reports" className="p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition text-center font-semibold">
            {isBn ? "বিস্তারিত প্রতিবেদন" : "View Analytics"}
          </Link>
        </div>
      </div>
    </div>
  )
}
