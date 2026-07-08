"use client"

import { useState, memo } from "react"
import { Menu, X, Globe, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"

function WebsiteSidebarComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 p-6 overflow-y-auto transition-transform duration-300 z-40 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-8 group"
          onClick={() => setSidebarOpen(false)}
        >
          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force FC Logo"
            width={50}
            height={50}
            className="object-contain w-10 h-10 group-hover:scale-110 transition-transform flex-shrink-0"
            priority
          />
          <div>
            <h1 className="font-[var(--font-display)] font-black text-lg tracking-wider bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
              TITAN
            </h1>
            <p className="text-xs text-foreground/60">FORCE</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1 mb-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors duration-300 ${language === "bn" ? "font-[var(--font-bengali)]" : ""} animate-in fade-in slide-in-from-left-4`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-primary/20 my-6" />

        {/* Store Link */}
        <Link
          href="/shop"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors duration-300 mb-6 relative group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </div>
          <span>{language === "bn" ? "স্টোর" : "STORE"}</span>
        </Link>

        {/* Divider */}
        <div className="h-px bg-primary/20 my-6" />

        {/* Theme and Language */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 text-foreground/60 hover:text-primary hover:bg-primary/20 transition-colors text-xs font-semibold uppercase"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "বাংলা" : "EN"}</span>
            </button>
          </div>
        </div>

        {/* Auth Links */}
        <div className="space-y-2">
          {user ? (
            <UserProfileDropdown onClose={() => setSidebarOpen(false)} />
          ) : (
            <Link
              href="/login"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-semibold uppercase w-full no-underline"
            >
              {language === "bn" ? "লগইন" : "LOGIN"}
            </Link>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content offset on large screens */}
      <div className="lg:ml-64" />
    </>
  )
}

export const WebsiteSidebar = memo(WebsiteSidebarComponent)
