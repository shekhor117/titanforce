"use client"

import { useState } from "react"
import { ChevronLeft, User, Users, Handshake } from "lucide-react"
import Link from "next/link"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState<"role-select" | "login" | "signup">("role-select")
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, signup } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"

  const roles = [
    { 
      id: "player" as UserRole, 
      icon: User, 
      label: isBn ? "খেলোয়াড়" : "Player",
      description: isBn ? "আপনার পরিসংখ্যান এবং প্রোফাইল পরিচালনা করুন" : "Manage your stats and profile"
    },
    { 
      id: "fan" as UserRole, 
      icon: Users, 
      label: isBn ? "সমর্থক" : "Fan/Supporter",
      description: isBn ? "আমাদের সম্প্রদায়ে যোগ দিন এবং খেলা সমর্থন করুন" : "Join the community and support matches"
    },
    { 
      id: "partner" as UserRole, 
      icon: Handshake, 
      label: isBn ? "অংশীদার" : "Partner",
      description: isBn ? "স্পন্সরশিপ এবং বিপণন সুযোগ" : "Sponsorship & marketing opportunities"
    }
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep("login")
    setIsLoginMode(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password, selectedRole)
      } else {
        await signup(formData.name, formData.email, formData.password, selectedRole)
      }
      router.push(`/dashboard/${selectedRole}`)
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className={`text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ফিরে যান" : "Back"}
            </span>
          </Link>
          <h1 className={`text-3xl font-[var(--font-display)] tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
            {isBn ? "টাইটান ফোর্সে যোগ দিন" : "Join Titan Force"}
          </h1>
        </div>

        {/* Role Selection */}
        {step === "role-select" && (
          <div className="space-y-4 animate-fade-up">
            <p className={`text-center text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আপনার ভূমিকা নির্বাচন করুন" : "Select your role to get started"}
            </p>

            <div className="space-y-3">
              {roles.map(role => {
                const Icon = role.icon
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full p-4 rounded-lg border-2 border-secondary bg-card hover:border-primary hover:bg-secondary/30 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className={`font-semibold text-foreground text-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                          {role.label}
                        </h3>
                        <p className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Login/Signup Form */}
        {(step === "login" || step === "signup") && selectedRole && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => {
                  setStep("role-select")
                  setSelectedRole(null)
                  setFormData({ name: "", email: "", password: "" })
                }}
                className="p-2 hover:bg-secondary rounded-full transition"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <div>
                <h2 className={`text-2xl font-[var(--font-display)] tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
                  {isLoginMode ? (isBn ? "লগইন করুন" : "Login") : (isBn ? "সাইন আপ করুন" : "Sign Up")}
                </h2>
                <p className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {roles.find(r => r.id === selectedRole)?.label}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নাম" : "Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={isBn ? "আপনার নাম" : "Your name"}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                    required={!isLoginMode}
                  />
                </div>
              )}

              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেল" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isBn ? "আপনার ইমেল" : "your@email.com"}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "পাসওয়ার্ড" : "Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isBn ? "আপনার পাসওয়ার্ড" : "••••••••"}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isLoading ? (isBn ? "লোড হচ্ছে..." : "Loading...") : (isLoginMode ? (isBn ? "লগইন" : "Login") : (isBn ? "সাইন আপ" : "Sign Up"))}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  setFormData({ name: "", email: "", password: "" })
                }}
                className={`w-full text-sm text-primary hover:text-primary/80 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isLoginMode ? (isBn ? "অ্যাকাউন্ট নেই? সাইন আপ করুন" : "Don't have an account? Sign Up") : (isBn ? "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন" : "Already have an account? Login")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
