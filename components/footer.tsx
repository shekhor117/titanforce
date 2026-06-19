"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  
  // Default footer settings
  const siteName = "Titan Force"
  const tagline = "Pride · Passion · Power"
  const contactEmail = "contact@titanforcemulikandi.com"
  const contactPhone = "+880 1800-123456"
  const address = "Mulikandi, Sylhet, Bangladesh"
  
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/titanforce", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/titanforce", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@titanforce", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/titanforce", label: "Twitter" },
  ]

  return (
    <footer className="relative border-t-2 border-primary py-12 px-4 bg-black dark:bg-black light:bg-gray-50 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 dark:opacity-40 light:opacity-30"
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20video-wLU6uw8zGiZmAIYTvXIhQQMo4xUH6b.mp4" type="video/mp4" />
      </video>

      {/* Overlay for content readability - Theme aware */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/40 light:bg-white/50 z-1"></div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo and Site Name */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logos/titanforce-logo.svg"
              alt={`${siteName} Logo`}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <p className="font-[var(--font-display)] text-xl tracking-wider mb-2 text-primary text-center">
            {siteName.toUpperCase()}
          </p>
          <p className="text-sm text-foreground/60 text-center mb-8">
            {tagline}
          </p>

          {/* Contact Information Cards */}
          <div className="w-full grid md:grid-cols-3 gap-4 mb-8">
            {/* Email Card */}
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary hover:bg-primary/10 hover-lift hover-glow transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Mail className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেল করুন" : "Email Us"}
                </p>
                <p className="text-foreground font-semibold text-sm hover-color-primary">{contactEmail}</p>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary hover:bg-primary/10 hover-lift hover-glow transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "কল করুন" : "Call Us"}
                </p>
                <p className="text-foreground font-semibold text-sm hover-color-primary">{contactPhone}</p>
              </div>
            </a>

            {/* Address Card */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary hover:bg-primary/10 hover-lift transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <MapPin className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আমাদের অবস্থান" : "Visit Us"}
                </p>
                <p className="text-foreground font-semibold text-sm">{address}</p>
              </div>
            </div>
          </div>
          
          {/* Follow Us - Social Media Icons */}
          {socialLinks.length > 0 && (
            <div className="mb-6">
              <p className={`text-sm text-foreground/60 text-center mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "আমাদের অনুসরণ করুন" : "Follow Us"}
              </p>
              <div className="flex justify-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary/50 text-foreground/70 hover:bg-primary hover:text-primary-foreground hover:border-primary hover-lift hover-accent-glow transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 hover-scale" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <p className={`text-sm text-foreground/50 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
