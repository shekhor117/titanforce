"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Facebook, Instagram, Youtube, Twitter, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getDataService } from "@/lib/data-service"

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  // Default social links
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/titanforce", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/titanforce", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@titanforce", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/titanforce", label: "Twitter" },
  ]

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
    
    // Validate form
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(isBn ? "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন" : "Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(isBn ? "অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা লিখুন" : "Please enter a valid email address")
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Save using DataService which connects to Supabase
      const dataService = getDataService()
      await dataService.createContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || undefined,
        subject: isBn ? "ওয়েবসাইট থেকে বার্তা" : "Message from Website",
        message: message.trim(),
        status: "unread",
      })
      
      setShowSuccess(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
      setError(null)
      formRef.current?.reset()
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      
      setError(isBn 
        ? `বার্তা পাঠাতে ত্রুটি হয়েছে: ${errorMessage}` 
        : `Error submitting message: ${errorMessage}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4 relative overflow-hidden bg-white/20 backdrop-blur-lg dark:bg-black/20">
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
            <div className="neo-panel">
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
                  {/* Error Message Display */}
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className={`text-sm text-red-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {error}
                      </p>
                    </div>
                  )}
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
                        <input
                          id="c-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className={`neo-input w-full px-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
                        <input
                          id="c-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          className={`neo-input w-full px-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
                      <input
                        id="c-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        className={`neo-input w-full px-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
                      <textarea
                        id="c-msg"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className={`neo-input w-full px-4 resize-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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
                    className={`neo-btn neo-btn-primary w-full flex items-center justify-center gap-3 group disabled:opacity-50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
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


        </div>
      </div>
    </section>
  )
}
