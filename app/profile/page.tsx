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
  Settings,
  Save,
  X,
  CheckCircle,
  LogOut,
  Loader2,
  Edit,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const { user, isLoading, logout, profile, updatePlayerProfile } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"

  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    website: "",
    dateOfBirth: "",
    position: "",
    jersey: "",
    experience: "",
    foot: "",
    height: "",
    weight: "",
  })

  useEffect(() => {
    if (!isClient || isLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    // Use real profile data from Supabase
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      dateOfBirth: profile?.dateOfBirth || "",
      position: profile?.position || "",
      jersey: profile?.jersey || "",
      experience: profile?.experience || "",
      foot: profile?.foot || "",
      height: profile?.height || "",
      weight: profile?.weight || "",
    })
  }, [isClient, user, profile, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          website: formData.website,
          dateOfBirth: formData.dateOfBirth,
          position: formData.position,
          jersey: formData.jersey,
          experience: formData.experience,
          foot: formData.foot,
          height: formData.height,
          weight: formData.weight,
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage(isBn ? "প্রোফাইল আপডেট হয়েছে" : "Profile updated successfully")
      await updatePlayerProfile({
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        website: formData.website,
        dateOfBirth: formData.dateOfBirth,
        position: formData.position,
        jersey: formData.jersey,
        experience: formData.experience,
        foot: formData.foot,
        height: formData.height,
        weight: formData.weight,
      })
      
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
    } finally {
      setIsSubmitting(false)
      setIsEditing(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
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

  const userInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

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
              {isBn ? "আমার প্রোফাইল" : "My Profile"}
            </h1>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="w-32 h-32 border-4 border-primary flex-shrink-0">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {formData.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="neo-btn neo-btn-primary px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium neo-input/30">
                      {user.role || "user"}
                    </div>
                    {formData.position && (
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                        {formData.position}
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="neo-btn neo-btn-primary neo-btn neo-btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {isBn ? "সম্পাদনা" : "Edit"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/60">
                  <Mail className="w-4 h-4 text-primary" />
                  {formData.email}
                </div>
                {formData.phone && (
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Phone className="w-4 h-4 text-primary" />
                    {formData.phone}
                  </div>
                )}
                {formData.address && (
                  <div className="flex items-center gap-2 text-foreground/60">
                    <MapPin className="w-4 h-4 text-primary" />
                    {formData.address}
                  </div>
                )}
              </div>

              {formData.bio && (
                <p className="mt-4 text-foreground/80">{formData.bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary rounded-lg p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Your Profile"}
            </h3>

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
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
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
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
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
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
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
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
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
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "অবস্থান" : "Position"}
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Forward"
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "জার্সি" : "Jersey Number"}
                  </label>
                  <input
                    type="text"
                    name="jersey"
                    value={formData.jersey}
                    onChange={handleInputChange}
                    placeholder="e.g., 7"
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "অভিজ্ঞতা" : "Experience"}
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5+ years"
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "উচ্চতা" : "Height"}
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder={'5\'10"'}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "ওজন" : "Weight"}
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="75kg"
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "পা" : "Preferred Foot"}
                  </label>
                  <select
                    name="foot"
                    value={formData.foot}
                    onChange={handleInputChange}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
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
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neo-btn neo-btn-primary neo-btn neo-btn-primary flex-1 px-4 py-2 bg-primary text-foreground font-medium rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isBn ? "সংরক্ষণ করছে..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="neo-btn neo-soft neo-btn neo-soft px-4 py-2 bg-secondary text-foreground font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Profile Details */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary rounded-lg p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              {isBn ? "বিস্তারিত তথ্য" : "Detailed Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.experience && (
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">{isBn ? "অভিজ্ঞতা" : "Experience"}</p>
                  <p className="text-lg font-semibold text-foreground">{formData.experience}</p>
                </div>
              )}
              {formData.height && (
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">{isBn ? "উচ্চতা" : "Height"}</p>
                  <p className="text-lg font-semibold text-foreground">{formData.height}</p>
                </div>
              )}
              {formData.weight && (
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">{isBn ? "ওজন" : "Weight"}</p>
                  <p className="text-lg font-semibold text-foreground">{formData.weight}</p>
                </div>
              )}
              {formData.foot && (
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">{isBn ? "পা" : "Preferred Foot"}</p>
                  <p className="text-lg font-semibold text-foreground">{formData.foot}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="neo-btn flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isBn ? "লগ আউট হচ্ছে..." : "Logging out..."}
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                {isBn ? "লগ আউট করুন" : "Logout"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
