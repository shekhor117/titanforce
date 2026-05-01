"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home } from "lucide-react"

export default function FanDashboard() {
  const { user, logout } = useAuth()
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "সমর্থক ড্যাশবোর্ড" : "Fan Dashboard"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সম্প্রদায়ে যোগ দিন এবং খেলা সমর্থন করুন" : "Join the community and support matches"}
            </p>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-card border-2 border-secondary rounded-xl p-8">
          <h2 className={`text-2xl font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "স্বাগতম, " : "Welcome, "} {user?.name}!
          </h2>

          {/* Community Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">1,245</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সম্প্রদায় সদস্য" : "Community Members"}
              </p>
            </div>

            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">385</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "মন্তব্য" : "Comments"}
              </p>
            </div>

            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">92</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ফেভারিট খেলোয়াড়" : "Favorite Players"}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard/fan/favorites" className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-center font-semibold">
              {isBn ? "প্রিয় খেলোয়াড়" : "My Favorites"}
            </Link>
            <Link href="/dashboard/fan/comments" className="p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition text-center font-semibold">
              {isBn ? "আমার মন্তব্য" : "My Comments"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
