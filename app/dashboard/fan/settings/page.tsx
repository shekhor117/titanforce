"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Home, LogOut, Save, X, Loader2, Bell, Lock, Eye, EyeOff } from "lucide-react"

export default function FanSettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const isBn = language === "bn"
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    theme: "dark",
    language: language,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!user || user.role !== "fan") {
      router.push("/login")
      return
    }
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(`fanSettings_${user.id}`)
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Validate password change if provided
      if (settings.newPassword) {
        if (settings.newPassword !== settings.confirmPassword) {
          alert(isBn ? "পাসওয়ার্ড মিলে না" : "Passwords do not match")
          setIsSubmitting(false)
          return
        }
        if (settings.newPassword.length < 8) {
          alert(isBn ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" : "Password must be at least 8 characters")
          setIsSubmitting(false)
          return
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      const { currentPassword, newPassword, confirmPassword, ...settingsToSave } = settings
      localStorage.setItem(`fanSettings_${user?.id}`, JSON.stringify(settingsToSave))

      if (settings.language !== language) {
        setLanguage(settings.language as "en" | "bn")
      }

      setSuccessMessage(isBn ? "সেটিংস সফলভাবে আপডেট হয়েছে!" : "Settings updated successfully!")
      setIsEditing(false)
      setShowPasswordFields(false)
      setSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "fan") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "সেটিংস" : "Settings"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন" : "Manage your account settings"}
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
              href="/"
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title={isBn ? "হোম" : "Home"}
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              title={isBn ? "লগআউট" : "Logout"}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/20 border-2 border-green-500 text-green-400 flex items-center gap-2">
            <Save className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-card border-2 border-secondary rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-8 py-6 border-b-2 border-secondary">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className={`text-xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "বিজ্ঞপ্তি" : "Notifications"}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {/* Email Notifications */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-2 border-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল বিজ্ঞপ্তি" : "Email Notifications"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান" : "Receive email updates about important news"}
                  </p>
                </div>
              </label>

              {/* Push Notifications */}
              <label className="flex items-center gap-3 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-2 border-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "পুশ বিজ্ঞপ্তি" : "Push Notifications"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "রিয়েল-টাইম আপডেট পান" : "Get real-time updates"}
                  </p>
                </div>
              </label>

              {/* Marketing Emails */}
              <label className="flex items-center gap-3 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  name="marketingEmails"
                  checked={settings.marketingEmails}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-2 border-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বিপণন ইমেইল" : "Marketing Emails"}
                  </p>
                  <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অফার এবং প্রচার সম্পর্কে জানুন" : "Learn about offers and promotions"}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-card border-2 border-secondary rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-8 py-6 border-b-2 border-secondary">
              <h2 className={`text-xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পছন্দ" : "Preferences"}
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Language */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ভাষা" : "Language"}
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing
                      ? "bg-background border-secondary focus:outline-none"
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "থিম" : "Theme"}
                </label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing
                      ? "bg-background border-secondary focus:outline-none"
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                >
                  <option value="dark">{isBn ? "অন্ধকার" : "Dark"}</option>
                  <option value="light">{isBn ? "হালকা" : "Light"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card border-2 border-secondary rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-8 py-6 border-b-2 border-secondary">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className={`text-xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নিরাপত্তা" : "Security"}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {!showPasswordFields ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(true)}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-xl border-2 font-semibold transition ${
                    isEditing
                      ? "border-primary text-primary hover:bg-primary/10"
                      : "border-secondary text-foreground/60 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
                </button>
              ) : (
                <>
                  {/* Current Password */}
                  <div>
                    <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={settings.currentPassword}
                      onChange={handleInputChange}
                      placeholder={isBn ? "বর্তমান পাসওয়ার্ড" : "Current password"}
                      className="w-full p-3 rounded-xl border-2 bg-background border-secondary focus:outline-none text-foreground"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "নতুন পাসওয়ার্ড" : "New Password"}
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      placeholder={isBn ? "নতুন পাসওয়ার্ড" : "New password"}
                      className="w-full p-3 rounded-xl border-2 bg-background border-secondary focus:outline-none text-foreground"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm password"}
                      className="w-full p-3 rounded-xl border-2 bg-background border-secondary focus:outline-none text-foreground"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordFields(false)
                      setSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
                    }}
                    className="w-full p-3 rounded-xl border-2 border-secondary text-foreground/60 hover:bg-secondary/50 font-semibold transition"
                  >
                    {isBn ? "বাতিল করুন" : "Cancel"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neo-btn neo-btn-primary flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary/10 rounded-xl font-semibold transition"
                >
                  <X className="w-5 h-5" />
                  {isBn ? "বাতিল করুন" : "Cancel"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="neo-btn px-primary py-primary bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition"
              >
                {isBn ? "সেটিংস সম্পাদনা করুন" : "Edit Settings"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
