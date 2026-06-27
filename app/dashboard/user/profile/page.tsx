"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export default function UserProfile() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [isClient, setIsClient] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
    avatar_url: ""
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || isLoading) return
    
    if (!user) {
      router.push("/login")
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: "",
        phone: "",
        location: "",
        avatar_url: user.avatar || ""
      })
    }
  }, [isClient, user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Here you would typically make an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("[v0] Profile updated:", formData)
    } finally {
      setIsSaving(false)
    }
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
              {isBn ? "আমার প্রোফাইল" : "My Profile"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "প্রোফাইল ছবি" : "Profile Picture"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white border-2 border-primary">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition font-medium"
              >
                {isBn ? "ছবি আপলোড করুন" : "Upload Photo"}
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ব্যক্তিগত তথ্য" : "Personal Information"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নাম" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none transition text-foreground"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেইল" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none text-foreground opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ফোন নম্বর" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={isBn ? "+88..." : "+1..."}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none transition text-foreground"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অবস্থান" : "Location"}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={isBn ? "শহর, দেশ" : "City, Country"}
                  className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none transition text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-6 rounded-lg bg-card/50 border-2 border-secondary">
            <h2 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "জীবনী" : "Bio"}
            </h2>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder={isBn ? "নিজের সম্পর্কে বলুন..." : "Tell us about yourself..."}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background border-2 border-secondary outline-none transition text-foreground"
            />
            <p className="text-xs text-foreground/50 mt-2">
              {isBn ? "সর্বাধিক ৫০০ অক্ষর" : "Maximum 500 characters"}
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}
                </>
              )}
            </button>
            <Link
              href="/dashboard/user"
              className="px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition font-semibold"
            >
              {isBn ? "বাতিল করুন" : "Cancel"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
