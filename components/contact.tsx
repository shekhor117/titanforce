"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { dataStore, useDataStore } from "@/lib/data-store"
import Link from "next/link"

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { language, t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const isBn = language === "bn"

  // Get settings from data store
  const settings = useDataStore(dataStore.getSettings, "settings")

  // Pre-fill user info if authenticated
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const socialLinks = [
    { icon: Facebook, href: settings.socialLinks.facebook || "#", label: "Facebook" },
    { icon: Instagram, href: settings.socialLinks.instagram || "#", label: "Instagram" },
    { icon: Youtube, href: settings.socialLinks.youtube || "#", label: "YouTube" },
    { icon: Twitter, href: settings.socialLinks.twitter || "#", label: "Twitter" },
  ].filter(link => link.href && link.href !== "#")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      return
    }

    setIsSubmitting(true)
    try {
      // Save to localStorage for now (Phase 2: add API endpoint for database)
      const existingMessages = JSON.parse(localStorage.getItem("titanforce_messages") || "[]")
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        status: "unread",
      }
      existingMessages.push(newMessage)
      localStorage.setItem("titanforce_messages", JSON.stringify(existingMessages))
      
      setShowSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
      formRef.current?.reset()
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-16 px-4">
      <div
        className={`max-w-lg mx-auto text-center transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className={`text-4xl tracking-wide mb-6 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
          {t.contact.title}
        </h2>

        {/* Auth Required Message */}
        {!authLoading && !user ? (
          <div className="bg-card border-2 border-primary rounded-lg p-8 mb-8">
            <div className="mb-6">
              <p className={`text-foreground/80 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বার্তা পাঠাতে আপনাকে অবশ্যই লগইন করতে হবে।" : "You must be logged in to send a message."}
              </p>
              <p className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "আপনার অ্যাকাউন্ট তৈরি করুন অথবা লগইন করুন এবং আমাদের সাথে যোগাযোগ করুন।" : "Create an account or login to get in touch with us."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/login"
                className={`flex-1 px-6 py-3 rounded font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition flex items-center justify-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "লগইন করুন" : "Login"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/sign-up"
                className={`flex-1 px-6 py-3 rounded font-semibold uppercase tracking-wider border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "সাইন আপ করুন" : "Sign Up"}
              </Link>
            </div>
          </div>
        ) : null}

        {/* Contact Form (Only shown when authenticated) */}
        {!authLoading && user && (
          <>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="c-name"
                  className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {t.contact.name}
                </label>
                <input
                  id="c-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground focus:outline-none focus:border-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  placeholder={t.contact.namePlaceholder}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="c-email"
                  className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "ইমেল" : "Email"}
                </label>
                <input
                  id="c-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground focus:outline-none focus:border-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  placeholder={isBn ? "আপনার ইমেল" : "your@email.com"}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="c-msg"
                  className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {t.contact.message}
                </label>
                <textarea
                  id="c-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground focus:outline-none focus:border-primary transition resize-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  placeholder={t.contact.messagePlaceholder}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isSubmitting ? (isBn ? "পাঠাচ্ছে..." : "Sending...") : t.contact.send}
              </button>
            </form>
            {showSuccess && (
              <p className={`mt-4 text-sm font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                &#10003; {t.contact.success}
              </p>
            )}
          </>
        )}

        {/* Loading State */}
        {authLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-primary border-transparent border-t-primary rounded-full" />
            </div>
          </div>
        )}

        {/* Contact Info & Social Links */}
        <div className="mt-10 pt-8 border-t border-card">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-foreground/70">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">{settings.address}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">{settings.contactPhone}</span>
            </div>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm">{settings.contactEmail}</span>
            </a>
          </div>

          {socialLinks.length > 0 && (
            <>
              <p className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {t.contact.followUs}
              </p>
              <div className="flex justify-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary/50 text-foreground/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
