"use client"

import { Menu, Globe, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"
import { useSidebar } from "@/components/ui/sidebar"

export function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()
  const { setOpenMobile, isMobile, state } = useSidebar()

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Mobile: Logo and Menu */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              className="p-2 text-foreground hover:bg-muted rounded transition-colors"
              onClick={() => setOpenMobile(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {/* Show logo on mobile or when sidebar is collapsed on desktop */}
          {(isMobile || state === "collapsed") && (
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="Titan Force FC Logo"
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform"
                priority
              />
              <h1 className="font-[var(--font-display)] text-lg tracking-wider bg-clip-text text-transparent hidden sm:block" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
                TITAN FORCE
              </h1>
            </Link>
          )}
        </div>

        {/* Desktop: Quick Actions */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile: Quick Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/shop"
            className="relative p-2 text-foreground hover:bg-muted rounded transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
