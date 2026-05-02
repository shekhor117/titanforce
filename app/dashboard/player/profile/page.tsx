"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PlayerProfileEditPage() {
  const router = useRouter()
  const { user, updatePlayerProfile, isLoading } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    phone: user?.playerProfile?.phone || "",
    age: user?.playerProfile?.age || "",
    position: user?.playerProfile?.position || "",
    jersey: user?.playerProfile?.jersey || "",
    height: user?.playerProfile?.height || "",
    weight: user?.playerProfile?.weight || "",
    foot: user?.playerProfile?.foot || "",
    address: user?.playerProfile?.address || "",
    experience: user?.playerProfile?.experience || "",
  })

  useEffect(() => {
    if (!user || user.role !== "player") {
      router.push("/login")
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updatePlayerProfile(formData)
      setSuccessMessage(isBn ? "প্রোফাইল সফলভাবে আপডেট হয়েছে!" : "Profile updated successfully!")
      setTimeout(() => {
        setSuccessMessage("")
        router.push("/dashboard/player")
      }, 2000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "player") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard/player" className="inline-flex items-center gap-2 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ফিরে যান" : "Back"}
            </span>
          </Link>
          
          <h1 className={`text-5xl md:text-6xl font-black tracking-wider text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
            {isBn ? "প্রোফাইল সম্পাদনা করুন" : "EDIT PROFILE"}
          </h1>
          <p className={`text-lg text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আপনার খেলোয়াড় তথ্য আপডেট করুন" : "Update your player information"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 rounded bg-green-500/20 border-2 border-green-500 text-green-400">
            {successMessage}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border-2 border-secondary p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ফোন নম্বর" : "Phone"}
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={isBn ? "ফোন নম্বর" : "+880 XXXX XXXX"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Age */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বয়স" : "Age"}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder={isBn ? "বয়স" : "Age"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Position */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থান" : "Position"}
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
              >
                <option value="">{isBn ? "অবস্থান নির্বাচন করুন" : "Select position"}</option>
                <option value="goalkeeper">{isBn ? "গোলকিপার" : "Goalkeeper"}</option>
                <option value="defender">{isBn ? "ডিফেন্ডার" : "Defender"}</option>
                <option value="midfielder">{isBn ? "মিডফিল্ডার" : "Midfielder"}</option>
                <option value="forward">{isBn ? "ফরোয়ার্ড" : "Forward"}</option>
              </select>
            </div>

            {/* Jersey */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "জার্সি নম্বর" : "Jersey Number"}
              </label>
              <input
                type="number"
                name="jersey"
                value={formData.jersey}
                onChange={handleInputChange}
                placeholder={isBn ? "জার্সি নম্বর" : "Jersey number"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Height */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "উচ্চতা (সেমি)" : "Height (cm)"}
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder={isBn ? "উচ্চতা" : "Height"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Weight */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ওজন (কেজি)" : "Weight (kg)"}
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder={isBn ? "ওজন" : "Weight"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Foot */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "প্রধান পা" : "Preferred Foot"}
              </label>
              <select
                name="foot"
                value={formData.foot}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
              >
                <option value="">{isBn ? "পা নির্বাচন করুন" : "Select foot"}</option>
                <option value="left">{isBn ? "বাম" : "Left"}</option>
                <option value="right">{isBn ? "ডান" : "Right"}</option>
                <option value="both">{isBn ? "উভয়" : "Both"}</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অভিজ্ঞতা (বছর)" : "Experience (years)"}
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder={isBn ? "অভিজ্ঞতা" : "Years"}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ঠিকানা" : "Address"}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={isBn ? "আপনার ঠিকানা" : "Your address"}
                rows={3}
                className="w-full px-4 py-3 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-8 py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving...") : (isBn ? "সংরক্ষণ করুন" : "Save Changes")}
            </button>
            <Link
              href="/dashboard/player"
              className="px-8 py-3 font-bold text-sm uppercase tracking-wider rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300"
            >
              {isBn ? "বাতিল করুন" : "Cancel"}
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
