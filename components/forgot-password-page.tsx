"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { language } = useLanguage()
  const isBn = language === "bn"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!email.trim()) {
      setMessage(isBn ? "ইমেল প্রবেশ করুন" : "Please enter your email")
      setIsLoading(false)
      return
    }

    try {
      // Placeholder - would send password reset email
      setMessage(isBn ? "পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে" : "Password reset link sent to your email")
      setTimeout(() => router.push("/admin/login"), 2000)
    } catch (error) {
      setMessage(isBn ? "ত্রুটি ঘটেছে" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{isBn ? "পিছনে" : "Back"}</span>
      </button>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-primary mb-2">
            {isBn ? "পাসওয়ার্ড রিসেট" : "RESET PASSWORD"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isBn ? "আপনার ইমেল প্রবেশ করুন" : "Enter your email address"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
              {isBn ? "ইমেল" : "Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@titanforce.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
              disabled={isLoading}
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm ${message.includes("sent") ? "bg-green-500/10 text-green-700" : "bg-destructive/10 text-destructive"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? (isBn ? "পাঠানো হচ্ছে..." : "Sending...") : (isBn ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isBn ? "মনে আছে?" : "Remember your password?"}{" "}
            <Link href="/admin/login" className="text-primary hover:underline">
              {isBn ? "লগইন করুন" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
