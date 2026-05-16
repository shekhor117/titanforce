"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

export function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { language } = useLanguage()
  const isBn = language === "bn"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(isBn ? "সমস্ত ক্ষেত্র পূরণ করুন" : "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError(isBn ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError(isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" : "Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      // Placeholder - would create admin account
      setTimeout(() => router.push("/admin-login"), 1000)
    } catch (err) {
      setError(isBn ? "সাইন আপ ব্যর্থ হয়েছে" : "Sign up failed")
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
            {isBn ? "সাইন আপ" : "SIGN UP"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isBn ? "নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি করুন" : "Create a new admin account"}
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
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              placeholder="admin@titanforce.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
              disabled={isLoading}
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
                  setError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
              {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError("")
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
              disabled={isLoading}
              required
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
            {isLoading ? (isBn ? "তৈরি করছি..." : "Creating...") : (isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isBn ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
            <Link href="/admin-login" className="text-primary hover:underline">
              {isBn ? "লগইন করুন" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
