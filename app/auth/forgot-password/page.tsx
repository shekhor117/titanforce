"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError(isBn ? "ইমেল ঠিকানা প্রবেশ করুন" : "Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isBn ? "বৈধ ইমেল ঠিকানা প্রবেশ করুন" : "Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      if (!supabase) {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess(true)
        setEmail("")
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
      setEmail("")
    } catch (err) {
      const message = err instanceof Error ? err.message : (isBn ? "রিসেট ইমেল পাঠাতে ব্যর্থ" : "Failed to send reset email")
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <Link
          href="/login"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{isBn ? "ফিরে যান" : "Back"}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isBn ? "ইমেল পাঠানো হয়েছে!" : "Email Sent!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isBn
                ? "আপনার ইনবক্সে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেল পরীক্ষা করুন।"
                : "We've sent a password reset link to your inbox. Please check your email."}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              {isBn ? "লগইন পেজে ফিরুন" : "Back to Login"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{isBn ? "ফিরে যান" : "Back"}</span>
      </Link>

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
              src="/logos/titanforce-logo.svg"
              alt="Titan Force Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-foreground mb-2">
              {isBn ? "পাসওয়ার্ড রিসেট" : "Reset Password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isBn ? "আপনার ইমেল ঠিকানা প্রবেশ করুন এবং আমরা আপনাকে একটি রিসেট লিঙ্ক পাঠাব" : "Enter your email address and we'll send you a reset link"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                {isBn ? "ইমেল" : "Email Address"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? (isBn ? "পাঠাচ্ছে..." : "Sending...") : (isBn ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link")}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary hover:underline"
            >
              {isBn ? "লগইন করুন" : "Back to Login"}
            </Link>
            <span className="mx-2 text-border">|</span>
            <Link
              href="/login"
              className="text-primary hover:underline"
            >
              {isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
            </Link>
          </div>

          {/* Demo Mode Info */}
          <div className="mt-6 p-3 rounded-xl bg-secondary/20 border border-secondary/30 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">{isBn ? "ডেমো মোড:" : "Demo Mode:"}</p>
            <p>{isBn ? "ডেমো মোডে, ইমেল পাঠানো সিমুলেট করা হবে।" : "In demo mode, email sending will be simulated."}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
