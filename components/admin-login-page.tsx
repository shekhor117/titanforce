"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { useLanguage } from "@/lib/language-context"

export function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useAdmin()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/admin/dashboard")
    } catch {
      // Error is handled by context
    } finally {
      setIsLoading(false)
    }
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@titanforce.com"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                required
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
              {isLoading ? (isBn ? "লগইন করছে..." : "Logging in...") : (isBn ? "লগইন করুন" : "Login")}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className={`mt-6 p-3 rounded bg-secondary/30 border border-secondary text-xs text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <p className="font-semibold mb-1">{isBn ? "ডেমো শংসাপত্র:" : "Demo Credentials:"}</p>
            <p>Email: admin@titanforce.com</p>
            <p>Password: admin123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
