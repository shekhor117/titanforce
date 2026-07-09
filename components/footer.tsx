"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { EntranceReveal } from "@/components/entrance-reveal"
import { dataStore } from "@/lib/data-store"

const defaultBrandDescription = "Pride of Mulikandi. Power of the Titans. Join the family and rise with us."

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [brandDescription, setBrandDescription] = useState(defaultBrandDescription)

  useEffect(() => {
    try {
      const footerContent = dataStore.getFooterContent()
      if (footerContent?.brandDescription) {
        setBrandDescription(footerContent.brandDescription)
      }
    } catch (err) {
      console.log('[v0] Failed to load footer content')
    }
  }, [])

  const clubLinks = [
    { id: "about", label: "About", href: "/about" },
    { id: "history", label: "History", href: "/about" },
    { id: "stadium", label: "Stadium", href: "/about" },
    { id: "academy", label: "Academy", href: "/about" },
  ]

  const teamsLinks = [
    { id: "fixtures", label: "Fixtures", href: "/fixtures-results" },
    { id: "players", label: "Players", href: "/team-squad" },
    { id: "results", label: "Results", href: "/fixtures-results" },
    { id: "standings", label: "Standings", href: "/fixtures-results" },
  ]

  const connectLinks = [
    { id: "contact", label: "Contact", href: "/about" },
    { id: "tickets", label: "Tickets", href: "/about" },
    { id: "shop", label: "Shop", href: "/shop" },
    { id: "newsletter", label: "Newsletter", href: "/news" },
  ]

  return (
    <EntranceReveal delay={0.3} duration={0.6} variant="fadeInUp">
      <footer className="bg-background text-foreground py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section - Mobile */}
        <div className="md:hidden mb-8 pb-8 border-b border-primary/10">
          <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/titanforce-logo.svg"
              alt="Titan Force Mulikandi Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
          <h3 className="font-bold text-lg tracking-wide mb-2 text-foreground">TITAN FORCE</h3>
          <p className="text-xs text-muted-foreground mb-1">MULIKANDI</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4">
            {brandDescription}
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">
          
          {/* Brand Section - Desktop Only */}
          <div className="hidden md:block">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logos/titanforce-logo.svg"
                alt="Titan Force Mulikandi Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
            <h3 className="font-bold text-lg tracking-wide mb-2 text-foreground">TITAN FORCE</h3>
            <p className="text-xs text-muted-foreground mb-1">MULIKANDI</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              {brandDescription}
            </p>
          </div>

          {/* Club Links */}
          <div>
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Club</h4>
            <ul className="space-y-3">
              {clubLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teams Links */}
          <div>
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Teams</h4>
            <ul className="space-y-3">
              {teamsLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Connect</h4>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <h3 className="text-foreground font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/TitanForceMulikandi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.09v-3.45a6.47 6.47 0 0 0-5.79 10.221 6.648 6.648 0 0 0 10.86-5.48v-5.6a8.552 8.552 0 0 0 3.79-1.75v-3.54z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/10 pt-6 md:pt-8 text-center">
          <p className="text-muted-foreground text-xs tracking-wider">
            © {currentYear} TITAN FORCE MULIKANDI · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
      </footer>
    </EntranceReveal>
  )
}
