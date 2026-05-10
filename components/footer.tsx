"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, useDataStore } from "@/lib/data-store"

export function Footer() {
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

  return (
    <footer className="border-t-2 border-primary py-12 px-4 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          {/* Logo and Site Name */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt={`${settings.siteName} Logo`}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <p className="font-[var(--font-display)] text-xl tracking-wider mb-2 text-primary text-center">
            {settings.siteName.toUpperCase()}
          </p>
          <p className="text-sm text-foreground/60 text-center mb-8">
            {settings.tagline}
          </p>

          {/* Contact Information Cards */}
          <div className="w-full grid md:grid-cols-3 gap-4 mb-8">
            {/* Email Card */}
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Mail className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেল করুন" : "Email Us"}
                </p>
                <p className="text-foreground font-semibold text-sm">{settings.contactEmail}</p>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "কল করুন" : "Call Us"}
                </p>
                <p className="text-foreground font-semibold text-sm">{settings.contactPhone}</p>
              </div>
            </a>

            {/* Address Card */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider text-foreground/50 mb-0.5 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "আমাদের অবস্থান" : "Visit Us"}
                </p>
                <p className="text-foreground font-semibold text-sm">{settings.address}</p>
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
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary/50 text-foreground/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
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
