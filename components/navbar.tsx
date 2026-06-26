"use client"

import { useState } from "react"
import { Menu, X, Globe, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"
import { ButtonModern } from "@/components/button-modern"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/team-squad", label: t.nav.squad },
    { href: "/fixtures-results", label: t.nav.matches },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features" },
    { href: "/contact", label: t.nav.contact },
  ]

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 backdrop-blur-2xl bg-gradient-to-r from-background/95 via-background/90 to-background/95 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 sm:gap-2 min-w-0 group hover:opacity-80 transition-all duration-300">
          <div className="relative">
            <Image
              src="/logos/titanforce-logo.svg"
              alt="Titan Force FC Logo"
              width={50}
              height={50}
              className="object-contain w-10 sm:w-[50px] h-10 sm:h-[50px] flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h1 className="font-[var(--font-display)] text-lg sm:text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-400 font-bold" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #d91e3f 100%)' }}>
            TITAN FORCE
          </h1>
        </Link>

        <button
          className="md:hidden p-2 text-foreground hover:bg-muted rounded transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-5 text-sm font-semibold uppercase tracking-wide">
          {navLinks.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-foreground/70 hover:text-primary transition-all duration-300 group ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-red-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          
          <div className="h-6 w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary/20 to-red-500/20 border border-primary/30 text-foreground hover:bg-gradient-to-r hover:from-primary/30 hover:to-red-500/30 hover:border-primary/60 hover-lift transition-all relative group shadow-lg hover:shadow-primary/20"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">{language === "bn" ? "স্টোর" : "STORE"}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <ThemeToggle />
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn-primary text-foreground hover-lift transition-all duration-300"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link href="/login" className="no-underline">
              <ButtonModern
                variant="neumorphic-accent"
                size="sm"
                className={`${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              >
                {language === "bn" ? "লগইন" : "Login"}
              </ButtonModern>
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-3 sm:px-4 pb-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide border-t border-primary/20 bg-gradient-to-b from-primary/5 to-background/50 backdrop-blur animate-in slide-in-from-top-2 duration-300">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all py-3 px-4 rounded-lg border border-transparent hover:border-primary/30 duration-300 animate-in fade-in slide-in-from-left-4 ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-red-500/20 border border-primary/30 text-foreground hover:bg-gradient-to-r hover:from-primary/30 hover:to-red-500/30 hover:border-primary/60 transition-all duration-300 relative min-h-[44px] animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: '300ms' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "bn" ? "স্টোর" : "STORE"}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <div className="border-t border-secondary pt-4 mt-2 flex flex-col gap-3">
            <div className="w-full flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full glass-btn-primary text-foreground hover-lift transition-all duration-300 flex-1 text-xs min-h-[44px]"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span className="font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
              </button>
            </div>

            {user ? (
              <UserProfileDropdown onClose={() => setMobileMenuOpen(false)} />
            ) : (
              <Link href="/login" className="no-underline" onClick={() => setMobileMenuOpen(false)}>
                <ButtonModern
                  variant="neumorphic-accent"
                  size="md"
                  className={`w-full ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {language === "bn" ? "লগইন" : "Login"}
                </ButtonModern>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
