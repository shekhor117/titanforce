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
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    fullName: "",
    phone: "",
    age: "",
    position: "",
    jersey: "",
    height: "",
    weight: "",
    foot: "",
    address: "",
    experience: "",
    company: "",
    ownerName: "",
    country: "",
    website: "",
    sponsorshipType: "",
    budget: "",
    currency: "BDT",
    message: "",
    gender: "",
    state: "",
    city: "",
    favoritePlayer: "",
    favoriteClub: "",
    favoriteLeague: "",
    supportType: "",
    notification: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  
  const { login, signup } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === "bn"

  // Load states for fan registration
  const handleCountryChange = async (country: string) => {
    setFormData(prev => ({ ...prev, country, state: "", city: "" }))
    setStates([])
    setCities([])

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      })
      const data = await res.json()
      if (data?.data?.states) {
        setStates(data.data.states.map((s: { name: string }) => s.name))
      }
    } catch (err) {
      console.error("Error loading states:", err)
    }
  }

  // Load cities for fan registration
  const handleStateChange = async (state: string) => {
    setFormData(prev => ({ ...prev, state, city: "" }))
    setCities([])

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: formData.country, state }),
      })
      const data = await res.json()
      if (data?.data) {
        setCities(data.data)
      }
    } catch (err) {
      console.error("Error loading cities:", err)
    }
  }

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
                  setFormData({ name: "", email: "", password: "", fullName: "", phone: "", age: "", position: "", jersey: "", height: "", weight: "", foot: "", address: "", experience: "", company: "", ownerName: "", country: "", website: "", sponsorshipType: "", budget: "", currency: "BDT", message: "", gender: "", state: "", city: "", favoritePlayer: "", favoriteClub: "", favoriteLeague: "", supportType: "", notification: "", confirmPassword: "" })
                  setStates([])
                  setCities([])
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
              {!isLoginMode && selectedRole === "player" ? (
                /* Player Registration Form */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পূর্ণ নাম" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার পূর্ণ নাম" : "Full name"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ফোন নম্বর" : "Phone"}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার ফোন" : "+880 XXXX XXXX"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "বয়স" : "Age"}
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার বয়স" : "Age"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পজিশন" : "Position"}
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                        required
                      >
                        <option value="">{isBn ? "পজিশন নির্বাচন করুন" : "Select Position"}</option>
                        <option>GK</option>
                        <option>CB</option>
                        <option>RB</option>
                        <option>LB</option>
                        <option>CDM</option>
                        <option>CM</option>
                        <option>CAM</option>
                        <option>LW</option>
                        <option>RW</option>
                        <option>ST</option>
                      </select>
                    </div>

                    {/* Jersey */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "জার্সি নম্বর" : "Jersey Number"}
                      </label>
                      <input
                        type="number"
                        name="jersey"
                        value={formData.jersey}
                        onChange={handleInputChange}
                        placeholder={isBn ? "জার্সি নম্বর" : "Jersey number"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "উচ্চতা" : "Height"}
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder={isBn ? "উচ্চতা (e.g. 5'9)" : "Height (e.g. 5'9)"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ওজন" : "Weight (kg)"}
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder={isBn ? "ওজন (kg)" : "Weight (kg)"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Preferred Foot */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "প্রিয় পা" : "Preferred Foot"}
                      </label>
                      <select
                        name="foot"
                        value={formData.foot}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                      >
                        <option value="">{isBn ? "পা নির্বাচন করুন" : "Select foot"}</option>
                        <option>Right</option>
                        <option>Left</option>
                        <option>Both</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "অভিজ্ঞতা" : "Experience"}
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder={isBn ? "ফুটবল অভিজ্ঞতা" : "Years of football experience"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ঠিকানা" : "Address"}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার ঠিকানা" : "Your address"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
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
                  </div>
                </>
              ) : !isLoginMode && selectedRole === "partner" ? (
                /* Partner Registration Form */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "কোম্পানির নাম" : "Company Name"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={isBn ? "কোম্পানির নাম" : "Company name"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Owner/CEO Name */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "মালিক / সিইও" : "Owner / CEO"}
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder={isBn ? "মালিকের নাম" : "Owner name"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ফোন নম্বর" : "Phone"}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isBn ? "ফোন নম্বর" : "+880 XXXX XXXX"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "দেশ" : "Country"}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder={isBn ? "দেশ" : "Country"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ওয়েবসাইট" : "Website (optional)"}
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder={isBn ? "ওয়েবসাইট" : "https://example.com"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Sponsorship Type */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "স্পন্সরশিপ ধরন" : "Sponsorship Type"}
                      </label>
                      <select
                        name="sponsorshipType"
                        value={formData.sponsorshipType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                        required
                      >
                        <option value="">{isBn ? "ধরন নির্বাচন করুন" : "Select type"}</option>
                        <option value="kit">{isBn ? "কিট স্পন্সর" : "Kit Sponsor"}</option>
                        <option value="main">{isBn ? "প্রধান স্পন্সর" : "Main Sponsor"}</option>
                        <option value="event">{isBn ? "ইভেন্ট স্পন্সর" : "Event Sponsor"}</option>
                        <option value="digital">{isBn ? "ডিজিটাল স্পন্সর" : "Digital Sponsor"}</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "বাজেট" : "Budget"}
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder={isBn ? "বাজেট পরি��াণ" : "Budget amount"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Currency */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "মুদ্রা" : "Currency"}
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পাসওয়ার্ড" : "Password"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={isBn ? "পাসওয়ার্ড" : "••••••••"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "বার্তা" : "Partnership Proposal"}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder={isBn ? "আপনার প্রস্তাব সম্পর্কে বলুন" : "Tell us about your partnership proposal"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </>
              ) : !isLoginMode && selectedRole === "fan" ? (
                /* Fan Registration Form */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পূর্ণ নাম" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার পূর্ণ নাম" : "Your full name"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পাসওয়ার্ড" : "Password"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={isBn ? "পাসওয়ার্ড" : "••••••••"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "••••••••"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ফোন নম্বর" : "Phone"}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isBn ? "ফোন নম্বর" : "+880 XXXX XXXX"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "বয়স" : "Age"}
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder={isBn ? "বয়স" : "Age"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "লিঙ্গ" : "Gender"}
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                      >
                        <option value="">{isBn ? "লিঙ্গ নির্বাচন করুন" : "Select gender"}</option>
                        <option value="male">{isBn ? "পুরুষ" : "Male"}</option>
                        <option value="female">{isBn ? "মহিলা" : "Female"}</option>
                        <option value="other">{isBn ? "অন্যান্য" : "Other"}</option>
                      </select>
                    </div>

                    {/* Country */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "দেশ" : "Country"}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        placeholder={isBn ? "দেশ" : "Country"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "অঞ্চল" : "State"}
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        disabled={!states.length}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition disabled:opacity-50"
                      >
                        <option value="">{isBn ? "অঞ্চল নির্বাচন করুন" : "Select state"}</option>
                        {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "শহর" : "City"}
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!cities.length}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition disabled:opacity-50"
                      >
                        <option value="">{isBn ? "শহর নির্বাচন করুন" : "Select city"}</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "ঠিকানা" : "Full Address"}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={isBn ? "আপনার সম্পূর্ণ ঠিকানা" : "Your full address"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Favorite Player */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "প্রিয় খেলোয়াড়" : "Favorite Player"}
                      </label>
                      <input
                        type="text"
                        name="favoritePlayer"
                        value={formData.favoritePlayer}
                        onChange={handleInputChange}
                        placeholder={isBn ? "প্রিয় খেলোয়াড়" : "Favorite player"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Favorite Club */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "প্রিয় ক্লাব" : "Favorite Club"}
                      </label>
                      <input
                        type="text"
                        name="favoriteClub"
                        value={formData.favoriteClub}
                        onChange={handleInputChange}
                        placeholder={isBn ? "প্রিয় ক্লাব" : "Favorite club"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Favorite League */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "প্রিয় লিগ" : "Favorite League"}
                      </label>
                      <input
                        type="text"
                        name="favoriteLeague"
                        value={formData.favoriteLeague}
                        onChange={handleInputChange}
                        placeholder={isBn ? "প্রিয় লিগ" : "Favorite league"}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    {/* Support Type */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "সমর্থন প্রকার" : "Support Type"}
                      </label>
                      <select
                        name="supportType"
                        value={formData.supportType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                      >
                        <option value="">{isBn ? "প্রকার নির্বাচন করুন" : "Select type"}</option>
                        <option value="casual">{isBn ? "ক্যাজুয়াল ফ্যান" : "Casual Fan"}</option>
                        <option value="loyal">{isBn ? "অনুগত ফ্যান" : "Loyal Fan"}</option>
                        <option value="ultra">{isBn ? "আল্ট্রা ফ্যান" : "Ultra Fan"}</option>
                      </select>
                    </div>

                    {/* Notifications */}
                    <div>
                      <label className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "বিজ্ঞপ্তি" : "Notifications"}
                      </label>
                      <select
                        name="notification"
                        value={formData.notification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:outline-none focus:border-primary transition"
                      >
                        <option value="">{isBn ? "বিজ্ঞপ্তি নির্বাচন করুন" : "Select notifications"}</option>
                        <option value="all">{isBn ? "সব আপডেট" : "All Updates"}</option>
                        <option value="matches">{isBn ? "শুধু ম্যাচ" : "Match Only"}</option>
                        <option value="none">{isBn ? "কোনো না" : "None"}</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : !isLoginMode ? (
                /* Other roles signup form */
                <>
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
                </>
              ) : (
                /* Login form */
                <>
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
                </>
              )}

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
                  setFormData({ name: "", email: "", password: "", fullName: "", phone: "", age: "", position: "", jersey: "", height: "", weight: "", foot: "", address: "", experience: "", company: "", ownerName: "", country: "", website: "", sponsorshipType: "", budget: "", currency: "BDT", message: "", gender: "", state: "", city: "", favoritePlayer: "", favoriteClub: "", favoriteLeague: "", supportType: "", notification: "", confirmPassword: "" })
                  setStates([])
                  setCities([])
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
