"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft, User, Mail, Calendar, Shield } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className={`text-sm uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ফিরে যান" : "Back"}
            </span>
          </Link>

          <h1 className={`text-5xl md:text-6xl font-black tracking-wider text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
            {isBn ? "আমার প্রোফাইল" : "MY PROFILE"}
          </h1>
          <p className={`text-lg text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আপনার অ্যাকাউন্ট তথ্য দেখুন" : "View your account information"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-lg border-2 border-secondary p-8 md:p-12">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b-2 border-secondary">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <h2 className={`text-2xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {user.name}
            </h2>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold capitalize mt-2">
              <Shield className="w-4 h-4" />
              {profile?.role || user.role || "User"}
            </span>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আইডি" : "User ID"}
                </label>
                <p className="text-foreground font-medium">{user.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেইল" : "Email"}
                </label>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
            </div>

            {profile?.created_at && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "তৈরির তারিখ" : "Created"}
                  </label>
                  <p className="text-foreground font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {profile?.status && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/60 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থা" : "Status"}
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    profile.status === "approved"
                      ? "bg-green-500/20 text-green-500"
                      : profile.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-red-500/20 text-red-500"
                  }`}>
                    {profile.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Edit Button for Players */}
          {(profile?.role === "player" || user.role === "player") && (
            <div className="mt-8 pt-8 border-t-2 border-secondary">
              <Link
                href="/dashboard/player/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                {isBn ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
