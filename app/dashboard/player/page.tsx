"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home, Edit, User } from "lucide-react"
import { ProfileCompletion } from "@/components/dashboard/profile-completion"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { PersonalizedRecommendations } from "@/components/dashboard/personalized-recommendations"

export default function PlayerDashboard() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const profileFields = [
    { name: "bio", completed: true, label: isBn ? "জীবনী" : "Bio" },
    { name: "photo", completed: true, label: isBn ? "ছবি" : "Photo" },
    { name: "stats", completed: false, label: isBn ? "পরিসংখ্যান" : "Statistics" },
    { name: "achievements", completed: false, label: isBn ? "সাফল্য" : "Achievements" },
    { name: "contact", completed: true, label: isBn ? "যোগাযোগ" : "Contact Info" },
  ]

  const metrics = [
    { id: "1", label: isBn ? "খেলা" : "Matches", value: 12, unit: isBn ? "খেলা" : "matches", change: 8, changeType: "increase" as const },
    { id: "2", label: isBn ? "গোল" : "Goals", value: 8, change: 12, changeType: "increase" as const },
    { id: "3", label: isBn ? "সহায়তা" : "Assists", value: 5, change: 3, changeType: "increase" as const },
    { id: "4", label: isBn ? "রেটিং" : "Rating", value: "8.5/10", change: 5, changeType: "increase" as const },
  ]

  const activities = [
    { id: "1", type: "match" as const, title: isBn ? "টাইটান শক্তি বনাম শহর এফসি" : "TitanForce vs City FC", description: isBn ? "আপনি ম্যাচে 2 গোল এবং 1 সহায়তা করেছেন" : "You scored 2 goals and 1 assist in the match", timestamp: "2 hours ago" },
    { id: "2", type: "goal" as const, title: isBn ? "শীর্ষ 5 স্কোরার" : "Top 5 Scorer", description: isBn ? "আপনি এই মাসের শীর্ষ স্কোরার তালিকায় প্রবেশ করেছেন" : "You made it to the top scorers list for this month", timestamp: "5 hours ago" },
    { id: "3", type: "achievement" as const, title: isBn ? "ম্যাচ মাইলস্টোন" : "Match Milestone", description: isBn ? "আপনার 10 ম্যাচে পৌঁছেছেন!" : "You've reached 10 matches!", timestamp: "1 day ago" },
  ]

  const upcomingEvents = [
    { id: "1", title: isBn ? "টাইটান শক্তি প্রশিক্ষণ" : "TitanForce Training", date: "May 8", time: "3:00 PM", type: "training" as const, status: "upcoming" as const },
    { id: "2", title: isBn ? "চূড়ান্ত লিগ ম্যাচ" : "Final League Match", date: "May 10", time: "5:00 PM", type: "match" as const, status: "upcoming" as const },
    { id: "3", title: isBn ? "দলীয় কৌশল সেশন" : "Team Strategy Session", date: "May 9", time: "4:00 PM", type: "event" as const, status: "upcoming" as const },
  ]

  const recommendations = [
    { id: "1", title: isBn ? "ফিটনেস প্রশিক্ষণ উন্নত করুন" : "Improve Fitness Training", description: isBn ? "আপনার সহনশীলতা বাড়ানোর জন্য সাপ্তাহিক কার্ডিও সেশন যোগ করুন" : "Add weekly cardio sessions to boost your endurance", action: isBn ? "দেখুন" : "View", priority: "high" as const },
    { id: "2", title: isBn ? "নতুন খেলোয়াড়দের সাথে সংযোগ স্থাপন করুন" : "Connect with New Players", description: isBn ? "দলের নতুন সদস্যদের সাথে বন্ধুত্ব তৈরি করুন এবং আপনার নেটওয়ার্ক প্রসারিত করুন" : "Build connections with team newcomers and expand your network", action: isBn ? "অন্বেষণ করুন" : "Explore", priority: "medium" as const },
    { id: "3", title: isBn ? "স্পন্সরশিপ সুযোগ" : "Sponsorship Opportunity", description: isBn ? "আপনার পারফরম্যান্স অনুযায়ী বিপণনকারীদের কাছ থেকে নতুন অফার আছে" : "You have new offers from marketers matching your performance", action: isBn ? "অফার দেখুন" : "View Offers", priority: "medium" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className={`text-2xl md:text-3xl font-[var(--font-display)] tracking-wider text-primary truncate ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "খেলোয়াড় ড্যাশবোর্ড" : "Player Dashboard"}
            </h1>
            <p className={`text-xs md:text-sm text-foreground/60 mt-1 hidden sm:block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার পরিসংখ্যান এবং প্রোফাইল পরিচালনা করুন" : "Manage your stats and profile"}
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link
              href="/dashboard/player/profile"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Profile"
            >
              <User className="w-4 md:w-5 h-4 md:h-5" />
            </Link>
            <Link
              href="/"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Home"
            >
              <Home className="w-4 md:w-5 h-4 md:h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Logout"
            >
              <LogOut className="w-4 md:w-5 h-4 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <h2 className={`text-xl md:text-2xl font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "স্বাগতম, " : "Welcome back, "} {user?.name}!
        </h2>

        {/* Top Section - Key Metrics */}
        <div className="mb-8">
          <PerformanceMetrics metrics={metrics} language={language as "en" | "bn"} />
        </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/player/profile"
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
          {isBn ? "স্��াগতম, " : "Welcome back, "} {user?.name}!
        </h2>

        {/* Top Section - Key Metrics */}
        <div className="mb-8">
          <PerformanceMetrics metrics={metrics} language={language as "en" | "bn"} />
        </div>

        {/* Main Grid - Profile, Activity, Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Left Column - Profile & Recommendations */}
          <div className="space-y-6 md:space-y-8">
            <ProfileCompletion fields={profileFields} language={language as "en" | "bn"} />
            <PersonalizedRecommendations recommendations={recommendations} language={language as "en" | "bn"} />
          </div>

          {/* Middle Column - Activity Feed */}
          <div>
            <ActivityFeed items={activities} language={language as "en" | "bn"} />
          </div>

          {/* Right Column - Upcoming Events */}
          <div>
            <UpcomingEvents events={upcomingEvents} language={language as "en" | "bn"} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Link href="/dashboard/player/profile" className="p-3 md:p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
            <Edit className="w-4 md:w-5 h-4 md:h-5" />
            {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
          </Link>
          <Link href="/dashboard/player/stats" className="p-3 md:p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
            {isBn ? "বিস্তারিত পরিসংখ্যান" : "View Detailed Stats"}
          </Link>
        </div>
      </div>
    </div>
  )
}
