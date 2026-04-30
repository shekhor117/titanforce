"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/TitanForceMulikandi", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    formRef.current?.reset()
    setTimeout(() => setShowSuccess(false), 3000)
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
              className={`w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground focus:outline-none focus:border-primary transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              placeholder={t.contact.namePlaceholder}
              required
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
              className={`w-full px-4 py-3 rounded border-2 border-card bg-transparent text-foreground focus:outline-none focus:border-primary transition resize-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              placeholder={t.contact.messagePlaceholder}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {t.contact.send}
          </button>
        </form>
        {showSuccess && (
          <p className={`mt-4 text-sm font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            &#10003; {t.contact.success}
          </p>
        )}

        {/* Contact Info & Social Links */}
        <div className="mt-10 pt-8 border-t border-card">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-foreground/70">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">Mulikandi, Zakiganj, Sylhet, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">+880 9697377938</span>
            </div>
            <a
              href="mailto:titanforcemulikandi@gmail.com"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm">titanforcemulikandi@gmail.com</span>
            </a>
          </div>

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
        </div>
      </div>
    </section>
  )
}
