"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home, ArrowLeft } from "lucide-react"
import { ProfileCompletion } from "@/components/dashboard/profile-completion"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { PersonalizedRecommendations } from "@/components/dashboard/personalized-recommendations"

export default function FanDashboard() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  const profileFields = [
    { name: "username", completed: true, label: isBn ? "ব্যবহারকারী নাম" : "Username" },
    { name: "bio", completed: false, label: isBn ? "জীবনী" : "Bio" },
    { name: "favorite_team", completed: true, label: isBn ? "প্রিয় দল" : "Favorite Team" },
    { name: "profile_picture", completed: false, label: isBn ? "প্রোফাইল ছবি" : "Profile Picture" },
  ]

  const metrics = [
    { id: "1", label: isBn ? "সম্প্রদায় স্তর" : "Community Level", value: "Gold", change: 15, changeType: "increase" as const },
    { id: "2", label: isBn ? "অনুসরণকারী" : "Followers", value: 1245, change: 8, changeType: "increase" as const },
    { id: "3", label: isBn ? "মন্তব্য" : "Comments", value: 385, change: 22, changeType: "increase" as const },
    { id: "4", label: isBn ? "পয়েন্ট" : "Points", value: "2,450", change: 12, changeType: "increase" as const },
  ]

  const activities = [
    { id: "1", type: "comment" as const, title: isBn ? "নতুন ম্যাচ মন্তব্য" : "Match Commentary", description: isBn ? "আপনার 'দুর্দান্ত পারফরম্যান্স!' মন্তব্য 50+ লাইক পেয়েছে" : "Your comment 'Great performance!' got 50+ likes", timestamp: "3 hours ago" },
    { id: "2", type: "achievement" as const, title: isBn ? "অনুগত অনুরাগী ব্যাজ" : "Loyal Fan Badge", description: isBn ? "আপনি একটি অনুগত অনুরাগী ব্যাজ উপার্জন করেছেন" : "You earned a Loyal Fan Badge for consistent engagement", timestamp: "1 day ago" },
    { id: "3", type: "milestone" as const, title: isBn ? "সম্প্রদায় স্তর আপগ্রেড" : "Community Level Up", description: isBn ? "আপনি সিলভার থেকে গোল্ড স্তরে আপগ্রেড হয়েছেন" : "You've upgraded from Silver to Gold level", timestamp: "2 days ago" },
  ]

  const upcomingEvents = [
    { id: "1", title: isBn ? "সাপ্তাহিক দল ভোট" : "Weekly Team Vote", date: "May 8", time: "6:00 PM", type: "event" as const, status: "today" as const },
    { id: "2", title: isBn ? "শীর্ষ খেলোয়াড় প্রতিযোগিতা" : "Top Player Contest", date: "May 10", time: "8:00 PM", type: "event" as const, status: "upcoming" as const },
    { id: "3", title: isBn ? "সম্প্রদায় চ্যালেঞ্জ" : "Community Challenge", date: "May 12", time: "7:00 PM", type: "event" as const, status: "upcoming" as const },
  ]

  const recommendations = [
    { id: "1", title: isBn ? "গোল্ড সদস্যপদ সুবিধা" : "Gold Membership Perks", description: isBn ? "এক্সক্লুসিভ সামগ্রী এবং প্রাথমিক অ্যাক্সেস আনলক করুন" : "Unlock exclusive content and early access to new features", action: isBn ? "আবিষ্কার করুন" : "Discover", priority: "high" as const },
    { id: "2", title: isBn ? "খেলোয়াড় সাক্ষাৎকার অংশ নিন" : "Join Player Interview", description: isBn ? "আপনার প্রিয় খেলোয়াড়ের সাথে একটি লাইভ সেশনে অংশ নিন" : "Participate in a live Q&A with your favorite players", action: isBn ? "অংশ নিন" : "Join", priority: "medium" as const },
    { id: "3", title: isBn ? "আপনার বন্ধুদের আমন্ত্রণ জানান" : "Invite Friends", description: isBn ? "বন্ধুদের আমন্ত্রণ জানান এবং উভয়ে পুরস্কার জিতুন" : "Invite friends and earn rewards for both of you", action: isBn ? "ভাগ করুন" : "Share", priority: "low" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "সমর্থক ড্যাশবোর্ড" : "Fan Dashboard"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সম্প্রদায়ে যোগ দিন এবং খেলা সমর্থন করুন" : "Join the community and support matches"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
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
          <PerformanceMetrics metrics={metrics} language={language as "en" | "bn"} title={isBn ? "আপনার সম্প্রদায় পরিসংখ্যান" : "Your Community Stats"} />
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
          <Link href="/dashboard/fan/favorites" className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-center font-semibold">
            {isBn ? "প্রিয় খেলোয়াড়" : "My Favorites"}
          </Link>
          <Link href="/dashboard/fan/community" className="p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition text-center font-semibold">
            {isBn ? "সম্প্রদায় গিল্ড" : "Community Guild"}
          </Link>
        </div>
      </div>
    </div>
  )
}
