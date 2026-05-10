"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Home, LogOut, Save, X, Loader2, Building2 } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

export default function PartnerProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    phone: "",
    address: "",
    bio: "",
    logoUrl: "",
  })

  useEffect(() => {
    if (!user || user.role !== "partner") {
      router.push("/login")
      return
    }
    // Initialize form data from localStorage
    const savedProfile = localStorage.getItem(`partnerProfile_${user.id}`)
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.setItem(`partnerProfile_${user?.id}`, JSON.stringify(formData))
      setSuccessMessage(isBn ? "প্রোফাইল সফলভাবে আপডেট হয়েছে!" : "Profile updated successfully!")
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "partner") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-primary bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-primary ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "প্রোফাইল" : "Profile"}
            </h1>
            <p className={`text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার কোম্পানির তথ্য পরিচালনা করুন" : "Manage your company information"}
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

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/20 border-2 border-green-500 text-green-400 flex items-center gap-2">
            <Save className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <div className="bg-card border-2 border-secondary rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8 border-b-2 border-secondary">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Logo */}
              {isEditing ? (
                <PhotoUpload
                  currentPhoto={formData.logoUrl}
                  currentFilePath=""
                  onPhotoUpload={(data) => setFormData(prev => ({ ...prev, logoUrl: data.signedUrl }))}
                  onPhotoDelete={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                  isLoading={isSubmitting}
                />
              ) : (
                <div className="w-32 h-32 rounded-xl border-4 border-primary overflow-hidden bg-primary/10 flex items-center justify-center">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary" />
                  )}
                </div>
              )}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground">{formData.companyName || user.name}</h2>
                <p className="text-foreground/60">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold capitalize">
                  {isBn ? "অংশীদার" : "Partner"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Name (Read-only) */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "যোগাযোগের নাম" : "Contact Name"}
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-3 rounded-xl bg-secondary/30 border-2 border-secondary text-foreground disabled:opacity-60"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেইল" : "Email"}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-3 rounded-xl bg-secondary/30 border-2 border-secondary text-foreground disabled:opacity-60"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "কোম্পানির নাম" : "Company Name"}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isBn ? "কোম্পানির নাম" : "Your company name"}
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing 
                      ? "bg-background border-secondary focus:border-primary focus:outline-none" 
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                />
              </div>

              {/* Website */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ওয়েবসাইট" : "Website"}
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://example.com"
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing 
                      ? "bg-background border-secondary focus:border-primary focus:outline-none" 
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ফোন নম্বর" : "Phone"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+880 XXXX XXXX"
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing 
                      ? "bg-background border-secondary focus:border-primary focus:outline-none" 
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                />
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ঠিকানা" : "Address"}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isBn ? "অফিসের ঠিকানা" : "Office address"}
                  className={`w-full p-3 rounded-xl border-2 text-foreground transition ${
                    isEditing 
                      ? "bg-background border-secondary focus:border-primary focus:outline-none" 
                      : "bg-secondary/30 border-secondary opacity-60"
                  }`}
                />
              </div>
            </div>

            {/* Company Bio */}
            <div className="mt-6">
              <label className={`block text-sm font-semibold text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কোম্পানির বিবরণ" : "Company Description"}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={isBn ? "আপনার কোম্পানি সম্পর্কে লিখুন..." : "Describe your company..."}
                rows={4}
                className={`w-full p-3 rounded-xl border-2 text-foreground transition resize-none ${
                  isEditing 
                    ? "bg-background border-secondary focus:border-primary focus:outline-none" 
                    : "bg-secondary/30 border-secondary opacity-60"
                }`}
              />
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition disabled:opacity-50"
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
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition"
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
