"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"
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
    <footer className="border-t-2 border-primary py-10 px-4 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt={`${settings.siteName} Logo`}
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
        <p className="font-[var(--font-display)] text-2xl tracking-wider mb-2 text-primary text-center">
          {settings.siteName.toUpperCase()}
        </p>
        <p className="text-sm text-foreground/60 text-center mb-4">
          {settings.tagline}
        </p>
        
        {/* Social Media Icons */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-6">
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
        )}

        <p className={`text-sm text-foreground/50 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          &copy; {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
