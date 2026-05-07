"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, User, Mail, Calendar, Shield, LogOut, Settings, Camera } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, isLoading, logout } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-muted-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userInitials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const getRoleBadgeColor = (role: string | null | undefined) => {
    switch (role) {
      case "player":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "partner":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "fan":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30"
    }
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return { color: "bg-green-500/20 text-green-400", label: isBn ? "অনুমোদিত" : "Approved" }
      case "pending":
        return { color: "bg-yellow-500/20 text-yellow-400", label: isBn ? "অপেক্ষমান" : "Pending" }
      case "rejected":
        return { color: "bg-red-500/20 text-red-400", label: isBn ? "প্রত্যাখ্যাত" : "Rejected" }
      default:
        return { color: "bg-muted text-muted-foreground", label: isBn ? "অজানা" : "Unknown" }
    }
  }

  const statusBadge = getStatusBadge(profile?.status)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{isBn ? "ফিরে যান" : "Back"}</span>
          </button>
          
          <h1 className={`text-lg font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "প্রোফাইল" : "Profile"}
          </h1>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Header Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
              <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat opacity-10" />
            </div>
            
            {/* Avatar & Basic Info */}
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">
                      {userInitials}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name & Role */}
              <div className="flex flex-col gap-2">
                <h2 className={`text-2xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeColor(profile?.role || user.role)}`}>
                    <Shield className="w-3 h-3" />
                    {profile?.role || user.role || "User"}
                  </span>
                  {profile?.status && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className={`text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অ্যাকাউন্ট তথ্য" : "Account Information"}
            </h3>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল" : "Email"}
                  </p>
                  <p className="text-foreground font-medium truncate">{user.email}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইউজার আইডি" : "User ID"}
                  </p>
                  <p className="text-foreground font-medium font-mono text-sm truncate">{user.id}</p>
                </div>
              </div>

              {/* Member Since */}
              {profile?.created_at && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "সদস্যপদ শুরু" : "Member Since"}
                    </p>
                    <p className="text-foreground font-medium">
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Edit Profile (Players) */}
            {(profile?.role === "player" || user.role === "player") && (
              <button
                onClick={() => router.push("/dashboard/player/profile")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "প্রোফাইল সম্পাদনা" : "Edit Player Profile"}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </button>
            )}

            {/* Dashboard */}
            <button
              onClick={() => {
                const role = profile?.role || user.role
                if (role === "player") router.push("/dashboard/player")
                else if (role === "partner") router.push("/dashboard/partner")
                else router.push("/dashboard/fan")
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className={`font-medium text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ড্যাশবোর্ড" : "Go to Dashboard"}
                </span>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <span className={`font-medium text-destructive ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isLoggingOut ? (isBn ? "লগআউট হচ্ছে..." : "Logging out...") : (isBn ? "লগআউট" : "Log Out")}
                </span>
              </div>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
