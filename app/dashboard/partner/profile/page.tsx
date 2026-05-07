"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Home, LogOut } from "lucide-react"

export default function PartnerProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [canGoBack, setCanGoBack] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    phone: "",
    address: "",
    bio: "",
  })

  useEffect(() => {
    setCanGoBack(window.history.length > 1)
    // Initialize form data from user profile or localStorage
    const savedProfile = localStorage.getItem("partnerProfile")
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    }
  }, [])

  const handleBack = () => {
    if (canGoBack) {
      window.history.back()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Save to localStorage for demo purposes
      localStorage.setItem("partnerProfile", JSON.stringify(formData))
      setSuccessMessage(isBn ? "প্রোফাইল সফলভাবে আপডেট হয়েছে!" : "Profile updated successfully!")
      setIsEditing(false)
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
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
        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 rounded bg-green-500/20 border-2 border-green-500 text-green-400">
            {successMessage}
          </div>
        )}

        <div className="bg-card border-2 border-secondary rounded-xl p-8">
          <h2 className={`text-2xl font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isEditing ? (isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile") : (isBn ? "আপনার তথ্য" : "Your Information")}
          </h2>

          <form onSubmit={handleSubmit}>
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

              {/* Company Name */}
              {isEditing && (
                <div>
                  <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "কোম্পানির নাম" : "Company Name"}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={isBn ? "কোম্পানির নাম" : "Your company name"}
                    className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              )}

              {/* Website */}
              {isEditing && (
                <div>
                  <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ওয়েবসাইট" : "Website"}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder={isBn ? "ওয়েবসাইট URL" : "https://example.com"}
                    className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              )}

              {/* Phone */}
              {isEditing && (
                <div>
                  <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ফোন নম্বর" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={isBn ? "ফোন নম্বর" : "+880 XXXX XXXX"}
                    className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              )}

              {/* Address */}
              {isEditing && (
                <div>
                  <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ঠিকানা" : "Address"}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={isBn ? "ঠিকানা" : "Your address"}
                    className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              )}
            </div>

            {/* Bio */}
            {isEditing && (
              <div className="mt-6">
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "সংস্থার বর্ণনা" : "Company Bio"}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={isBn ? "আপনার সংস্থার বর্ণনা" : "Describe your company"}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-secondary/30 border-2 border-secondary text-foreground focus:outline-none focus:border-primary transition resize-none"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {isSubmitting ? (isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving...") : (isBn ? "সংরক্ষণ করুন" : "Save Changes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold transition"
                  >
                    {isBn ? "বাতিল করুন" : "Cancel"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition"
                >
                  {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
