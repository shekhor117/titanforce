"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { sendPasswordReset } from "@/lib/auth-utils"

export function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"

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
      await sendPasswordReset(email)
      setSuccess(true)
      setEmail("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset email"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-black to-primary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h2 className={`text-2xl font-bold text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ইমেল পাঠানো হয়েছে!" : "Email Sent!"}
            </h2>
            <p className={`text-foreground/70 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn
                ? "আপনার ইনবক্সে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেল পরীক্ষা করুন।"
                : "We've sent a password reset link to your inbox. Please check your email."}
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {isBn ? "লগইন পেজে ফিরুন" : "Back to Login"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-black to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-primary mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অ্যাডমিন" : "ADMIN"}
            </h1>
            <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "পাসওয়ার্ড রিসেট করুন" : "Reset Password"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ইমেল" : "Email Address"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className={`p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {isLoading ? (isBn ? "পাঠাচ্ছে..." : "Sending...") : (isBn ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link")}
            </button>
          </form>

          {/* Links */}
          <div className={`mt-6 text-center text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <button
              onClick={() => router.push("/admin/login")}
              className="text-primary hover:underline"
              type="button"
            >
              {isBn ? "লগইন করুন" : "Back to Login"}
            </button>
            <span className="mx-2">•</span>
            <button
              onClick={() => router.push("/admin/signup")}
              className="text-primary hover:underline"
              type="button"
            >
              {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
