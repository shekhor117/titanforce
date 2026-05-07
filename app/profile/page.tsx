"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, User, Mail, Calendar, Shield, LogOut, Settings, Camera, Upload, CheckCircle, Loader2, ChevronRight, Phone, MapPin, Activity } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { user, profile, isLoading, logout, refreshProfile } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate upload (in production, this would upload to storage)
    setIsUploading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
      // Refresh profile after upload
      if (refreshProfile) {
        await refreshProfile()
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
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

  const displayAvatar = previewUrl || user.avatar || profile?.avatar_url

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

  const getRoleIcon = (role: string | null | undefined) => {
    switch (role) {
      case "player":
        return <Activity className="w-3 h-3" />
      case "partner":
        return <Shield className="w-3 h-3" />
      case "fan":
        return <User className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return { color: "bg-green-500/20 text-green-400 border border-green-500/30", label: isBn ? "অনুমোদিত" : "Approved", icon: <CheckCircle className="w-3 h-3" /> }
      case "pending":
        return { color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30", label: isBn ? "অপেক্ষমান" : "Pending", icon: <Loader2 className="w-3 h-3 animate-spin" /> }
      case "rejected":
        return { color: "bg-red-500/20 text-red-400 border border-red-500/30", label: isBn ? "প্রত্যাখ্যাত" : "Rejected", icon: null }
      default:
        return { color: "bg-muted text-muted-foreground", label: isBn ? "অজানা" : "Unknown", icon: null }
    }
  }

  const statusBadge = getStatusBadge(profile?.status)
  const userRole = profile?.role || user.role

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{isBn ? "ফিরে যান" : "Back"}</span>
          </button>
          
          <h1 className={`text-lg font-bold text-foreground font-[family-name:var(--font-display)] tracking-wide ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "প্রোফাইল" : "MY PROFILE"}
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

      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Profile Header Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Banner with gradient */}
            <div className="h-28 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-5" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
            </div>
            
            {/* Avatar & Basic Info */}
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 flex justify-center sm:justify-start">
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-4 border-card shadow-xl">
                    <AvatarImage 
                      src={displayAvatar} 
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload Button Overlay */}
                  <button 
                    onClick={handlePhotoClick}
                    disabled={isUploading}
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : uploadSuccess ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {/* Camera Badge */}
                  <button 
                    onClick={handlePhotoClick}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg border-2 border-card disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="text-center sm:text-left">
                  <h2 className={`text-2xl font-bold text-foreground font-[family-name:var(--font-display)] tracking-wide ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {user.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeColor(userRole)}`}>
                    {getRoleIcon(userRole)}
                    {userRole || "User"}
                  </span>
                  {profile?.status && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats (for players) */}
          {userRole === "player" && user.playerProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3"
            >
              {user.playerProfile.position && (
                <div className="bg-card rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">{user.playerProfile.position}</p>
                  <p className="text-xs text-muted-foreground mt-1">{isBn ? "পজিশন" : "Position"}</p>
                </div>
              )}
              {user.playerProfile.jersey && (
                <div className="bg-card rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-foreground font-[family-name:var(--font-display)]">#{user.playerProfile.jersey}</p>
                  <p className="text-xs text-muted-foreground mt-1">{isBn ? "জার্সি" : "Jersey"}</p>
                </div>
              )}
              {user.playerProfile.experience && (
                <div className="bg-card rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-foreground font-[family-name:var(--font-display)]">{user.playerProfile.experience}</p>
                  <p className="text-xs text-muted-foreground mt-1">{isBn ? "অভিজ্ঞতা" : "Experience"}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl border border-border p-5"
          >
            <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অ্যাকাউন্ট তথ্য" : "Account Information"}
            </h3>
            
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল" : "Email Address"}
                  </p>
                  <p className="text-foreground font-medium truncate">{user.email}</p>
                </div>
              </div>

              {/* Phone (if available) */}
              {user.playerProfile?.phone && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "ফোন" : "Phone Number"}
                    </p>
                    <p className="text-foreground font-medium">{user.playerProfile.phone}</p>
                  </div>
                </div>
              )}

              {/* Address (if available) */}
              {user.playerProfile?.address && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "ঠিকানা" : "Address"}
                    </p>
                    <p className="text-foreground font-medium">{user.playerProfile.address}</p>
                  </div>
                </div>
              )}

              {/* User ID */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-muted-foreground mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইউজার আইডি" : "Member ID"}
                  </p>
                  <p className="text-foreground font-medium font-mono text-sm truncate">{user.id}</p>
                </div>
              </div>

              {/* Member Since */}
              {profile?.created_at && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
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
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Edit Profile (Players) */}
            {userRole === "player" && (
              <button
                onClick={() => router.push("/dashboard/player/profile")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className={`font-medium text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "প্রোফাইল সম্পাদনা" : "Edit Player Profile"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isBn ? "আপনার তথ্য আপডেট করুন" : "Update your information"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}

            {/* Dashboard */}
            <button
              onClick={() => {
                if (userRole === "player") router.push("/dashboard/player")
                else if (userRole === "partner") router.push("/dashboard/partner")
                else router.push("/dashboard/fan")
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <span className={`font-medium text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ড্যাশবোর্ড" : "Go to Dashboard"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isBn ? "আপনার কার্যকলাপ দেখুন" : "View your activity"}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Upload Photo Button */}
            <button
              onClick={handlePhotoClick}
              disabled={isUploading}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="text-left">
                  <span className={`font-medium text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isUploading ? (isBn ? "আপলোড হচ্ছে..." : "Uploading...") : (isBn ? "ছবি পরিবর্তন করুন" : "Change Profile Photo")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isBn ? "JPG, PNG সমর্থিত" : "JPG, PNG supported"}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center group-hover:bg-destructive/30 transition-colors">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <span className={`font-medium text-destructive block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isLoggingOut ? (isBn ? "লগআউট হচ্ছে..." : "Logging out...") : (isBn ? "লগআউট" : "Log Out")}
                  </span>
                  <span className="text-xs text-destructive/70">
                    {isBn ? "আপনার অ্যাকাউন্ট থেকে বের হন" : "Sign out of your account"}
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
