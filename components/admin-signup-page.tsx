"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { validatePassword, getPasswordStrengthColor } from "@/lib/auth-utils"
import { signUpWithEmail } from "@/lib/auth-utils"
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function AdminSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
      const message = err instanceof Error ? err.message : (isBn ? "সাইন আপ ব্যর্থ হয়েছে" : "Signup failed")
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <Link
          href="/admin/login"
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
              {isBn ? "সাইন আপ সফল!" : "Signup Successful!"}
            </h2>
            <p className="text-muted-foreground mb-6">
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
              className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              {isBn ? "লগইন করুন" : "Go to Login"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Link
        href="/admin/login"
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
              {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create New Account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
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
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
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
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
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
                  <p className="text-xs mt-1 text-muted-foreground">
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
                    <div className="mt-2 text-xs space-y-1">
                      {passwordValidation.errors.map((error, i) => (
                        <p key={i} className="text-destructive">
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
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive mt-1">
                  {isBn ? "পাসওয়ার্ড মেলে না" : "Passwords do not match"}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full py-3 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? (isBn ? "তৈরি করছে..." : "Creating...") : (isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account")}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isBn ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
            <Link
              href="/admin/login"
              className="text-primary hover:underline"
            >
              {isBn ? "লগইন করুন" : "Login"}
            </Link>
          </div>

          {/* User Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isBn ? "ব্যবহারকারী অ্যাকাউন্ট খুঁজছেন?" : "Looking for user account?"}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {isBn ? "এখানে সাইন আপ করুন" : "Sign up here"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
