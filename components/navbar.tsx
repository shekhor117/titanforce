"use client"

import { useState } from "react"
import { Menu, X, Globe, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#squad", label: t.nav.squad },
    { href: "#matches", label: t.nav.matches },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features" },
    { href: "#contact", label: t.nav.contact },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-primary backdrop-blur-md bg-background/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="#home" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Titan Force FC Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <h1 className="font-[var(--font-display)] text-2xl tracking-wider text-primary">
            TITAN FORCE
          </h1>
        </Link>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
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
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/${user.role}`}
                className={`px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground hover:text-primary transition-colors ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-full flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex-1"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold">{language === "en" ? "বাংলা" : "EN"}</span>
            </button>
          </div>

          {user ? (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className={`px-4 py-2 rounded-full border-2 border-primary text-primary text-center ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {user.name}
              </Link>
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className={`px-4 py-2 flex items-center justify-center gap-2 border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              >
                <LogOut className="w-4 h-4" />
                {language === "bn" ? "লগআউট" : "Logout"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === "bn" ? "লগইন" : "Login"}
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
