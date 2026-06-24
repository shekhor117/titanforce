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
    <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 sm:gap-2 min-w-0 group">
          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force FC Logo"
            width={50}
            height={50}
            className="object-contain w-10 sm:w-[50px] h-10 sm:h-[50px] flex-shrink-0 group-hover:scale-110 transition-transform"
            priority
          />
          <h1 className="font-[var(--font-display)] text-lg sm:text-2xl tracking-wider bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
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

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground/60 hover:text-primary hover-underline transition-colors duration-300 ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-primary/20" />
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 rounded glass-btn-primary text-foreground hover-lift transition-all relative group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "bn" ? "স্টোর" : "STORE"}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
        <div className="md:hidden px-3 sm:px-4 pb-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide border-t border-secondary animate-in slide-in-from-top-2 duration-300">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground/60 hover:text-primary hover-underline transition-colors py-3 px-3 rounded min-h-[44px] flex items-center duration-300 animate-in fade-in slide-in-from-left-4 ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-3 rounded glass-btn-primary text-foreground hover-lift transition-all duration-300 relative min-h-[44px] animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: '300ms' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "bn" ? "স্টোর" : "STORE"}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
