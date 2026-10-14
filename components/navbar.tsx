"use client"

import { useState, memo, useCallback, useMemo } from "react"
import { Menu, X, Globe, ShoppingBag, Home, Users, CalendarDays, Sparkles, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"
import { ButtonModern } from "@/components/button-modern"

function NavbarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/about", label: t.nav.about, icon: Users },
    { href: "/team-squad", label: t.nav.squad, icon: Users },
    { href: "/fixtures-results", label: t.nav.matches, icon: CalendarDays },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features", icon: Sparkles },
    { href: "/contact", label: t.nav.contact, icon: Mail },
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
          <h1 className="font-[var(--font-display)] font-black text-lg sm:text-2xl tracking-wider bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
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
            className="neo-btn flex items-center gap-2 px-4 py-2 relative group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-3 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold">{language === "bn" ? "স্টোর" : "STORE"}</span>
          </Link>
          
          <ThemeToggle />
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link href="/login" className="neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline">
              <span className={`text-xs font-bold ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                {language === "bn" ? "লগইন" : "LOGIN"}
              </span>
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] z-40 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="ml-auto flex h-[calc(100dvh-73px)] w-[min(82vw,320px)] flex-col overflow-y-auto bg-background px-4 pb-4 pt-4 shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 border-b border-border pb-5">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                <div className="min-w-0 [&>div]:w-full [&>div>button]:min-h-11 [&>div>button]:rounded-lg [&>div>button]:border [&>div>button]:border-border [&>div>button]:bg-muted/40 [&>div>button]:shadow-none [&>div>button]:hover:bg-muted">
                  <ThemeToggle />
                </div>
                <button onClick={() => setLanguage(language === "en" ? "bn" : "en")} className="flex min-h-11 min-w-[76px] items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-xs font-bold transition-colors hover:bg-muted" aria-label="Toggle language">
                  <Globe className="size-4 text-primary" />{language === "en" ? "বাংলা" : "EN"}
                </button>
                {user ? <UserProfileDropdown onClose={() => setMobileMenuOpen(false)} /> : <Link href="/login" className="flex min-h-11 min-w-[76px] items-center justify-center rounded-lg border border-primary/50 bg-primary/5 px-3 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground" onClick={() => setMobileMenuOpen(false)}>{language === "bn" ? "লগইন" : "LOGIN"}</Link>}
              </div>
            </div>

            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex min-h-11 items-center rounded-lg border px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${pathname === link.href ? "border-primary/30 bg-primary/10 text-primary" : "border-transparent text-foreground/70 hover:border-primary/20 hover:bg-primary/10 hover:text-primary"} ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                    style={{ animationDelay: `${index * 40}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-3"><Icon className="size-4 text-primary/70 transition-colors group-hover:text-primary" />{link.label}</span>
                  </Link>
                )
              })}
              <Link href="/shop" className={`mt-2 flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all ${pathname === "/shop" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border border-transparent bg-muted/40 text-foreground/70 hover:border-primary/20 hover:bg-primary/10 hover:text-primary"}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="flex items-center gap-3"><ShoppingBag className="size-4" />{language === "bn" ? "স্টোর" : "STORE"}</span>
                {cartItemCount > 0 && <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">{cartItemCount > 9 ? "9+" : cartItemCount}</span>}
              </Link>
            </nav>

          </div>
        </div>
      )}
    </nav>
  )
}

export const Navbar = memo(NavbarComponent)
