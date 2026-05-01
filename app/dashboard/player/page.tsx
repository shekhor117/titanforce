"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Home } from "lucide-react"

export default function PlayerDashboard() {
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
              {isBn ? "খেলোয়াড় ড্যাশবোর্ড" : "Player Dashboard"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার পরিসংখ্যান এবং প্রোফাইল পরিচালনা করুন" : "Manage your stats and profile"}
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

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-card border-2 border-secondary rounded-xl p-8">
          <h2 className={`text-2xl font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "স্বাগতম, " : "Welcome, "} {user?.name}!
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Stats Card */}
            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">12</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ম্যাচ খেলা হয়েছে" : "Matches Played"}
              </p>
            </div>

            {/* Goals Card */}
            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">8</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "গোল করা" : "Goals Scored"}
              </p>
            </div>

            {/* Assists Card */}
            <div className="rounded-lg bg-secondary/30 p-6 border-2 border-secondary">
              <div className="text-4xl font-[var(--font-display)] text-primary mb-2">5</div>
              <p className={`text-sm text-foreground/60 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অ্যাসিস্ট" : "Assists"}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard/player/profile" className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-center font-semibold">
              {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
            </Link>
            <Link href="/dashboard/player/stats" className="p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition text-center font-semibold">
              {isBn ? "পরিসংখ্যান দেখুন" : "View Stats"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
