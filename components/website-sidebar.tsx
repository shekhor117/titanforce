"use client"

import { useState, memo } from "react"
import { Globe, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"
import { WebsiteHeader } from "@/components/website-header"

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
      {/* Header with Logo and User Profile */}
      <WebsiteHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border/50 p-6 overflow-y-auto transition-transform duration-300 z-40 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
