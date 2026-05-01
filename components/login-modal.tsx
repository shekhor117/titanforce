"use client"

import { useState } from "react"
import { X, User, Users, Handshake } from "lucide-react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"role-select" | "login" | "signup">("role-select")
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, signup } = useAuth()
  const { language, t } = useLanguage()
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
      onClose()
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

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-card border-2 border-primary rounded-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "role-select" && (
          <div>
            <h2 className={`text-2xl font-[var(--font-display)] tracking-wider mb-2 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isBn ? "আপনি কে?" : "Who are you?"}
            </h2>
            <p className={`text-sm text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
                      <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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

        {(step === "login" || step === "signup") && selectedRole && (
          <div>
            <h2 className={`text-2xl font-[var(--font-display)] tracking-wider mb-2 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : ""}`}>
              {isLoginMode ? (isBn ? "লগইন করুন" : "Login") : (isBn ? "সাইন আপ করুন" : "Sign Up")}
            </h2>
            <p className={`text-sm text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {roles.find(r => r.id === selectedRole)?.label}
            </p>

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

              <button
                type="button"
                onClick={() => {
                  setStep("role-select")
                  setSelectedRole(null)
                  setFormData({ name: "", email: "", password: "" })
                }}
                className={`w-full text-xs text-foreground/60 hover:text-foreground transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "ভূমিকা পরিবর্তন করুন" : "Change role"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
