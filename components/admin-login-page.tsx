"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useLanguage } from "@/lib/language-context"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")
  const { login, error: contextError, admin, isInitialized } = useAdmin()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(true)

  useEffect(() => {
    // Only auto-redirect if we have a valid admin and this is not a logout scenario
    if (isInitialized && admin && shouldAutoRedirect) {
      router.push("/admin/dashboard")
    }
  }, [admin, isInitialized, shouldAutoRedirect, router])

  // Disable auto-redirect when user submits login form
  const handleFormFocus = () => {
    setShouldAutoRedirect(false)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError(isBn ? "সমস্ত ক্ষেত্র পূরণ করুন" : "Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError(isBn ? "বৈধ ইমেল ঠিকানা প্রবেশ করুন" : "Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      router.push("/admin/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : (isBn ? "লগইন ব্যর্থ হয়েছে" : "Login failed")
      setLocalError(message)
      setIsSubmitting(false)
    }
  }

  const displayError = contextError || localError

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{isBn ? "পিছনে" : "Back"}</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Titan Force Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-primary mb-2">
              {isBn ? "অ্যাডমিন" : "ADMIN"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isBn ? "টাইটান ফোর্স নিয়ন্ত্রণ প্যানেল" : "Titan Force Control Panel"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                {isBn ? "ইমেল" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setLocalError("")
                }}
                placeholder="admin@titanforce.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setLocalError("")
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? (isBn ? "পাসওয়ার্ড লুকান" : "Hide password") : (isBn ? "পাসওয়ার্ড দেখান" : "Show password")}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? (isBn ? "লগইন করছে..." : "Logging in...") : (isBn ? "লগইন করুন" : "Login")}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-3">
            <Link
              href="/admin/forgot-password"
              className="block text-primary hover:underline"
            >
              {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
            </Link>
            <p>
              {isBn ? "নতুন ব্যবহারকারী?" : "New user?"}{" "}
              <Link
                href="/admin/signup"
                className="text-primary hover:underline"
              >
                {isBn ? "সাইন আপ করুন" : "Sign up"}
              </Link>
            </p>
          </div>

          {/* Demo Mode Info */}
          <div className="mt-6 p-3 rounded-xl bg-secondary/20 border border-secondary/30 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">{isBn ? "ডেমো মোড:" : "Demo Mode:"}</p>
            <p>{isBn ? "যেকোনো ই���েল এবং পাসওয়ার্ড ব্যবহার করুন (ন্যূনতম ৬ অক্ষর)" : "Use any email and password (minimum 6 characters)"}</p>
          </div>

          {/* User Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isBn ? "ব্যবহারকারী লগইন খুঁজছেন?" : "Looking for user login?"}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {isBn ? "এখানে ক্লিক করুন" : "Click here"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
