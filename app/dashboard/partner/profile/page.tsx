"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Home, LogOut } from "lucide-react"

export default function PartnerProfilePage() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    setCanGoBack(window.history.length > 1)
  }, [])

  const handleBack = () => {
    if (canGoBack) {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "প্রোফাইল" : "Profile"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার প্রোফাইল তথ্য পরিচালনা করুন" : "Manage your profile information"}
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
              href="/dashboard/partner"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title="Dashboard"
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

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-card border-2 border-secondary rounded-xl p-8">
          <h2 className={`text-2xl font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আপনার তথ্য" : "Your Information"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নাম" : "Name"}
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ইমেইল" : "Email"}
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground disabled:opacity-60"
              />
            </div>

            {/* Role */}
            <div>
              <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ভূমিকা" : "Role"}
              </label>
              <input
                type="text"
                value={user?.role || ""}
                disabled
                className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground disabled:opacity-60 capitalize"
              />
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition">
              {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
