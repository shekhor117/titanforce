"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { useLanguage } from "@/lib/language-context"

export function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const { login, error: contextError } = useAdmin()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
      const message = err instanceof Error ? err.message : "Login failed"
      setLocalError(message)
      setIsSubmitting(false)
    }
  }

  const displayError = contextError || localError

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
              {isBn ? "টাইটান ফোর্স নিয়ন্ত্রণ প্যানেল" : "Titan Force Control Panel"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setLocalError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isSubmitting}
                required
              />
            </div>

            {displayError && (
              <div className={`p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {isSubmitting ? (isBn ? "লগইন করছে..." : "Logging in...") : (isBn ? "লগইন করুন" : "Login")}
            </button>
          </form>

          {/* Links */}
          <div className={`mt-6 text-center text-xs text-foreground/70 space-y-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <button
              onClick={() => router.push("/admin/forgot-password")}
              className="block w-full text-primary hover:underline"
              type="button"
            >
              {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
            </button>
            <p>
              {isBn ? "নতুন ব্যবহারকারী?" : "New user?"}{" "}
              <button
                onClick={() => router.push("/admin/signup")}
                className="text-primary hover:underline"
                type="button"
              >
                {isBn ? "সাইন আপ করুন" : "Sign up"}
              </button>
            </p>
          </div>

          {/* Demo Mode Info */}
          <div className={`mt-6 p-3 rounded bg-secondary/30 border border-secondary text-xs text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <p className="font-semibold mb-1">{isBn ? "ডেমো মোড:" : "Demo Mode:"}</p>
            <p>{isBn ? "যেকোনো ইমেল এবং পাসওয়ার্ড ব্যবহার করুন (ন্যূনতম ৬ অক্ষর)" : "Use any email and password (minimum 6 characters)"}</p>
            <p className="mt-2 text-xs opacity-70">{isBn ? "Supabase সক্ষম থাকলে আপনার নিবন্ধিত অ্যাকাউন্ট ব্যবহার করুন।" : "Use your registered account if Supabase is enabled."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
