"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, Send, CheckCircle2, User, MessageSquare, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, useDataStore } from "@/lib/data-store"

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  // Get settings from data store
  const settings = useDataStore(dataStore.getSettings, "settings")

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
    
    setIsSubmitting(true)
    try {
      // Save to localStorage
      const existingMessages = JSON.parse(localStorage.getItem("titanforce_messages") || "[]")
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone,
        subject: isBn ? "ওয়েবসাইট থেকে বার্তা" : "Message from Website",
        message,
        timestamp: new Date().toISOString(),
        status: "unread",
      }
      existingMessages.push(newMessage)
      localStorage.setItem("titanforce_messages", JSON.stringify(existingMessages))
      
      setShowSuccess(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
      formRef.current?.reset()
      setTimeout(() => setShowSuccess(false), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className={`text-sm font-medium text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Get In Touch"}
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl tracking-wide mb-4 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {t.contact.title}
          </h2>
          <p className={`text-foreground/60 max-w-xl mx-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn 
              ? "প্রশ্ন আছে? আমরা সাহায্য করতে এখানে আছি। নিচের ফর্মটি পূরণ করুন এবং আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
              : "Have questions? We're here to help. Fill out the form below and we'll get back to you soon."
            }
          </p>
        </div>

        {/* Form Section */}
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
            <div className="rounded-2xl border-2 border-card bg-card/50 backdrop-blur-sm p-8">
              {showSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className={`text-2xl font-bold text-foreground mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}
                  </h3>
                  <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.contact.success}
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="relative">
                      <label
                        htmlFor="c-name"
                        className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                      >
                        {t.contact.name} *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "name" ? "text-primary" : "text-foreground/30"}`} />
                        <input
                          id="c-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-background/50 text-foreground placeholder:text-foreground/30 focus:outline-none transition-all ${
                            focusedField === "name" ? "border-primary bg-background" : "border-border/50"
                          } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                          placeholder={t.contact.namePlaceholder}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label
                        htmlFor="c-email"
                        className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                      >
                        {isBn ? "ইমেল" : "Email"} *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "email" ? "text-primary" : "text-foreground/30"}`} />
                        <input
                          id="c-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-background/50 text-foreground placeholder:text-foreground/30 focus:outline-none transition-all ${
                            focusedField === "email" ? "border-primary bg-background" : "border-border/50"
                          } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                          placeholder={isBn ? "আপনার ইমেল" : "your@email.com"}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label
                      htmlFor="c-phone"
                      className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                    >
                      {isBn ? "ফোন নম্বর" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "phone" ? "text-primary" : "text-foreground/30"}`} />
                      <input
                        id="c-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-background/50 text-foreground placeholder:text-foreground/30 focus:outline-none transition-all ${
                          focusedField === "phone" ? "border-primary bg-background" : "border-border/50"
                        } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                        placeholder={isBn ? "+৮৮০ ১২৩৪ ৫৬৭৮৯০" : "+880 1234 567890"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label
                      htmlFor="c-msg"
                      className={`text-xs uppercase tracking-wider font-semibold text-foreground/70 block mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                    >
                      {t.contact.message} *
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-4 w-5 h-5 transition-colors ${focusedField === "message" ? "text-primary" : "text-foreground/30"}`} />
                      <textarea
                        id="c-msg"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-background/50 text-foreground placeholder:text-foreground/30 focus:outline-none transition-all resize-none ${
                          focusedField === "message" ? "border-primary bg-background" : "border-border/50"
                        } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                        placeholder={t.contact.messagePlaceholder}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 font-bold text-sm uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {isBn ? "পাঠাচ্ছে..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        {t.contact.send}
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <p className={`text-xs text-center text-foreground/40 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn 
                      ? "এই ফর্ম জমা দিয়ে, আপনি আমাদের গোপনীয়তা নীতিতে সম্মত হচ্ছেন।"
                      : "By submitting this form, you agree to our privacy policy."
                    }
                  </p>
                </form>
              )}
            </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-8 text-center">
              <p className={`text-sm text-foreground/60 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {t.contact.followUs}
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border/50 text-foreground/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
