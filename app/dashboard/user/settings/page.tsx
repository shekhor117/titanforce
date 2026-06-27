"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { ArrowLeft, Toggle2, Bell, Lock, Eye, LogOut } from "lucide-react"
import { PageEntrance } from '@/components/page-entrance'

export default function UserSettings() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const { language, setLanguage } = useLanguage()
  const isBn = language === "bn"
  const [isClient, setIsClient] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    darkMode: true,
    twoFactorAuth: false,
    profileVisibility: "public" as "public" | "private" | "friends"
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || isLoading) return
    
    if (!user) {
      router.push("/login")
    }
  }, [isClient, user, isLoading, router])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key]
    }))
  }

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard/user"
            className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
            title={isBn ? "পিছনে" : "Back"}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-2xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "সেটিংস" : "Settings"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Notifications */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <Bell className="w-5 h-5 text-primary" />
              {isBn ? "বিজ্ঞপ্তি" : "Notifications"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-secondary">
                <div>
                  <p className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল বিজ্ঞপ্তি" : "Email Notifications"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "গুরুত্বপূর্ণ আপডেট সম্পর্কে ইমেইল পান" : "Get email updates about important events"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.emailNotifications ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.emailNotifications ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-secondary">
                <div>
                  <p className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "পুশ বিজ্ঞপ্তি" : "Push Notifications"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ডিভাইসে পুশ সতর্কতা পান" : "Receive push alerts on your device"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushNotifications")}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.pushNotifications ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.pushNotifications ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "মার্কেটিং ইমেইল" : "Marketing Emails"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বিশেষ অফার এবং সংবাদ পান" : "Receive special offers and news"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("marketingEmails")}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.marketingEmails ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.marketingEmails ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <Eye className="w-5 h-5 text-primary" />
              {isBn ? "গোপনীয়তা" : "Privacy"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "প্রোফাইল দৃশ্যমানতা" : "Profile Visibility"}
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSelectChange("profileVisibility", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none transition text-foreground"
                >
                  <option value="public" className="text-foreground">
                    {isBn ? "সর্বজনীন" : "Public"}
                  </option>
                  <option value="friends" className="text-foreground">
                    {isBn ? "শুধুমাত্র বন্ধু" : "Friends Only"}
                  </option>
                  <option value="private" className="text-foreground">
                    {isBn ? "ব্যক্তিগত" : "Private"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <Lock className="w-5 h-5 text-primary" />
              {isBn ? "অ্যাকাউন্ট" : "Account"}
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 rounded-lg border-2 border-secondary text-foreground transition text-left font-medium">
                {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
              </button>
              <button className="w-full px-4 py-2 rounded-lg border-2 border-secondary text-foreground transition text-left font-medium">
                {isBn ? "দুই-ফ্যাক্টর প্রমাণীকরণ" : "Two-Factor Authentication"}
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg border-2 border-red-500/50 text-red-500 hover:bg-red-500/10 transition text-left font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isBn ? "লগআউট করুন" : "Logout"}
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ভাষা" : "Language"}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-secondary text-foreground"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  language === "bn"
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-secondary text-foreground"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
