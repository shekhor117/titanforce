"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Heart,
  Lock,
} from "lucide-react"
import { mockGetSession, mockUpdateUserProfile } from "@/lib/mock-auth"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    dateOfBirth: "",
    bio: "",
    about: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    
    if (user) {
      const session = mockGetSession()
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: session?.phone || "",
        address: session?.address || "",
        website: session?.website || "",
        dateOfBirth: session?.dateOfBirth || "",
        bio: session?.bio || "",
        about: session?.about || "",
      })
    }
  }, [user, isLoading, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Update user profile using mock auth
      mockUpdateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        about: formData.about,
      })

      setSuccessMessage(
        isBn ? "প্রোফাইল সফলভাবে আপডেট হয়েছে!" : "Profile updated successfully!"
      )
      setIsEditing(false)

      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile"
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-secondary bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{isBn ? "ফিরে যান" : "Back"}</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {isBn ? "সেটিংস" : "Settings"}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-lg overflow-hidden">
              <nav className="flex flex-col">
                {[
                  { id: "profile", label: isBn ? "প্রোফাইল" : "Profile", icon: User },
                  { id: "security", label: isBn ? "নিরাপত্তা" : "Security", icon: Shield },
                  { id: "preferences", label: isBn ? "পছন্দসমূহ" : "Preferences", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 flex items-center gap-3 transition-colors border-l-4 ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border-primary"
                          : "text-foreground/60 hover:text-foreground border-transparent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Settings Panel */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-lg p-6 md:p-8"
            >
              {/* Messages */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      {isBn ? "আপনার প্রোফাইল" : "Your Profile"}
                    </h2>

                    {!isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Read-only fields */}
                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "নাম" : "Full Name"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground">
                              {formData.name}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "ইমেইল" : "Email"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary" />
                              {formData.email}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "ফোন" : "Phone"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              {formData.phone || "Not set"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "ঠিকানা" : "Address"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {formData.address || "Not set"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "ওয়েবসাইট" : "Website"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" />
                              {formData.website || "Not set"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">
                              {isBn ? "জন্মতারিখ" : "Date of Birth"}
                            </label>
                            <div className="p-3 bg-background rounded-lg text-foreground">
                              {formData.dateOfBirth || "Not set"}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground/60 mb-2">
                            {isBn ? "বায়ো" : "Bio"}
                          </label>
                          <div className="p-3 bg-background rounded-lg text-foreground min-h-24">
                            {formData.bio || "Not set"}
                          </div>
                        </div>

                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full md:w-auto px-6 py-2 bg-primary text-foreground font-medium rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          {isBn ? "সম্পাদনা করুন" : "Edit Profile"}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {isBn ? "নাম" : "Full Name"}
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {isBn ? "ফোন" : "Phone"}
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+880 171 1234567"
                              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {isBn ? "ঠিকানা" : "Address"}
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="City, Country"
                              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {isBn ? "ওয়েবসাইট" : "Website"}
                            </label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://example.com"
                              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {isBn ? "জন্মতারিখ" : "Date of Birth"}
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {isBn ? "বায়ো" : "Bio"}
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-2 bg-primary text-foreground font-medium rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isBn ? "সংরক্ষণ করছে..." : "Saving..."}
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                {isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            {isBn ? "বাতিল করুন" : "Cancel"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {isBn ? "নিরাপত্তা সেটিংস" : "Security Settings"}
                  </h2>

                  <div className="bg-background rounded-lg p-6 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
                        </h3>
                        <p className="text-foreground/60 text-sm mb-4">
                          {isBn ? "আপনার অ্যাকাউন্টের নিরাপত্তার জন্য নিয়মিত আপনার পাসওয়ার্ড পরিবর্তন করুন।"
                            : "Regularly update your password to keep your account secure."}
                        </p>
                        <button className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium">
                          {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-6 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {isBn ? "দুই-ফ্যাক্টর প্রমাণীকরণ" : "Two-Factor Authentication"}
                        </h3>
                        <p className="text-foreground/60 text-sm mb-4">
                          {isBn ? "আপনার অ্যাকাউন্টে একটি অতিরিক্ত নিরাপত্তা স্তর যোগ করুন।"
                            : "Add an extra layer of security to your account."}
                        </p>
                        <button className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium">
                          {isBn ? "সক্ষম করুন" : "Enable"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {isBn ? "আপনার পছন্দসমূহ" : "Your Preferences"}
                  </h2>

                  <div className="bg-background rounded-lg p-6 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {isBn ? "ইমেইল নোটিফিকেশন" : "Email Notifications"}
                          </h3>
                          <p className="text-foreground/60 text-sm">
                            {isBn ? "গুরুত্বপূর্ণ আপডেট সম্পর্কে ইমেইল পান" : "Get emails about important updates"}
                          </p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-6 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {isBn ? "প্রাইভেসি" : "Privacy Settings"}
                          </h3>
                          <p className="text-foreground/60 text-sm">
                            {isBn ? "আপনার প্রোফাইল সবার কাছে দৃশ্যমান করুন" : "Make your profile visible to everyone"}
                          </p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
