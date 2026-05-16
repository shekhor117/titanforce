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

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#squad", label: t.nav.squad },
    { href: "#matches", label: t.nav.matches },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features" },
    { href: "#contact", label: t.nav.contact },
  ]

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-primary backdrop-blur-md bg-background/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <Link href="#home" className="flex items-center gap-1 sm:gap-2 min-w-0">
          <Image
            src="/logo.png"
            alt="Titan Force FC Logo"
            width={50}
            height={50}
            className="object-contain w-10 sm:w-[50px] h-10 sm:h-[50px] flex-shrink-0"
            priority
          />
          <h1 className="font-[var(--font-display)] text-lg sm:text-2xl tracking-wider text-primary truncate">
            TITAN FORCE
          </h1>
        </Link>

        <button
          className="md:hidden p-2 text-foreground hover:bg-secondary rounded transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-4 text-sm font-semibold uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground hover:text-primary transition-colors ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-primary/20" />
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 rounded border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all relative group"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link
              href="/login"
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
            >
              {language === "bn" ? "লগইন" : "Login"}
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-3 sm:px-4 pb-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide border-t border-secondary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground hover:text-primary transition-colors py-2 px-2 rounded ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2.5 rounded border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all relative"
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
          
          <div className="border-t border-secondary pt-3 mt-2 flex flex-col gap-3">
            <div className="w-full flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex-1 text-xs"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span className="font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
              </button>
            </div>

            {user ? (
              <UserProfileDropdown onClose={() => setMobileMenuOpen(false)} />
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition text-center ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "bn" ? "লগইন" : "Login"}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
