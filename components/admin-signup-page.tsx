"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { validatePassword, getPasswordStrengthColor } from "@/lib/auth-utils"
import { signUpWithEmail } from "@/lib/auth-utils"

export function AdminSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const passwordValidation = validatePassword(password)
  const passwordsMatch = password === confirmPassword
  const isFormValid = 
    email && 
    password && 
    confirmPassword && 
    fullName && 
    passwordValidation.isValid && 
    passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError(isBn ? "সমস্ত ক্ষেত্র পূরণ করুন" : "Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isBn ? "বৈধ ইমেল ঠিকানা প্রবেশ করুন" : "Please enter a valid email address")
      return
    }

    if (!passwordValidation.isValid) {
      setError(
        isBn 
          ? "পাসওয়ার্ড সমস্ত প্রয়োজনীয়তা পূরণ করে না" 
          : "Password does not meet requirements"
      )
      return
    }

    if (password !== confirmPassword) {
      setError(isBn ? "পাসওয়ার্ড মেলে না" : "Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const { requiresVerification: needsVerification } = await signUpWithEmail(
        email,
        password,
        fullName
      )
      setRequiresVerification(needsVerification)
      setSuccess(true)
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setFullName("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed"
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
              {isBn ? "সাইন আপ সফল!" : "Signup Successful!"}
            </h2>
            <p className={`text-foreground/70 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {requiresVerification
                ? isBn
                  ? "আপনার অ্যাকাউন্ট সক্রিয় করতে আপনার ইমেল যাচাই করুন।"
                  : "Please verify your email to activate your account."
                : isBn
                ? "আপনার অ্যাকাউন্ট তৈরি করা হয়েছে।"
                : "Your account has been created."}
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {isBn ? "লগইন করুন" : "Go to Login"}
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
              {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create New Account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পূর্ণ নাম" : "Full Name"}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  setError("")
                }}
                placeholder={isBn ? "আপনার নাম" : "Your name"}
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ইমেল" : "Email"}
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

            {/* Password */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isLoading}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-card overflow-hidden">
                    <div
                      className={`h-full transition-all ${getPasswordStrengthColor(passwordValidation.strength)}`}
                      style={{
                        width:
                          passwordValidation.strength === "weak"
                            ? "33%"
                            : passwordValidation.strength === "medium"
                            ? "66%"
                            : "100%",
                      }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {passwordValidation.strength === "weak"
                      ? isBn
                        ? "দুর্বল পাসওয়ার্ড"
                        : "Weak password"
                      : passwordValidation.strength === "medium"
                      ? isBn
                        ? "মাঝারি শক্তিশালী"
                        : "Medium strength"
                      : isBn
                      ? "শক্তিশালী পাসওয়ার্ড"
                      : "Strong password"}
                  </p>

                  {/* Password Requirements */}
                  {passwordValidation.errors.length > 0 && (
                    <div className="mt-2 text-xs text-foreground/70 space-y-1">
                      {passwordValidation.errors.map((error, i) => (
                        <p key={i} className="text-red-400">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition"
                disabled={isLoading}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1">
                  {isBn ? "পাসওয়ার্ড মেলে না" : "Passwords do not match"}
                </p>
              )}
            </div>

            {error && (
              <div className={`p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {isLoading ? (isBn ? "তৈরি করছে..." : "Creating...") : (isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account")}
            </button>
          </form>

          {/* Links */}
          <div className={`mt-6 text-center text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
            <button
              onClick={() => router.push("/admin/login")}
              className="text-primary hover:underline"
              type="button"
            >
              {isBn ? "লগইন করুন" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
