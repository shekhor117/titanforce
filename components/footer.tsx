"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export function Footer() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <footer className="border-t-2 border-primary py-10 px-4 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Titan Force FC Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
        <p className="font-[var(--font-display)] text-2xl tracking-wider mb-4 text-primary text-center">
          TITAN FORCE FC
        </p>
        
        {/* Social Media Icons */}
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

        <p className={`text-sm text-foreground/50 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          &copy; 2025 {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
