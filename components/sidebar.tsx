"use client"

import { useState, memo, useCallback } from "react"
import { Menu, X, Globe, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/lib/cart-context"

function SidebarComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
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

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-[64px] sm:top-[72px] h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] w-64 bg-background border-l border-border/50 z-40 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide text-foreground/60 hover:text-primary hover:bg-muted rounded transition-all duration-300 ${
                  language === "bn" ? "font-[var(--font-bengali)]" : ""
                }`}
                onClick={handleCloseSidebar}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Shop Section */}
          <div className="px-4 py-4 border-t border-secondary">
            <Link
              href="/shop"
              className="neo-btn flex items-center gap-2 px-4 py-2 w-full relative group"
              onClick={handleCloseSidebar}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-3 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold flex-1 text-left">
                {language === "bn" ? "স্টোর" : "STORE"}
              </span>
            </Link>
          </div>

          {/* Bottom Controls */}
          <div className="px-4 py-4 border-t border-secondary space-y-3">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="neo-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-full flex-1 text-xs"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span className="font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-[64px] sm:top-[72px] bg-black/50 z-30 md:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed right-4 top-4 z-50 p-2 text-foreground hover:bg-muted rounded transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </>
  )
}

export const Sidebar = memo(SidebarComponent)
