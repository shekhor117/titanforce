"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

function NavbarComponent() {
  const { language } = useLanguage()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo and Branding - Left */}
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

        {/* User Profile/Login - Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link href="/login" className="neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline text-xs sm:text-sm">
              <span className={`font-bold ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                {language === "bn" ? "লগইন" : "LOGIN"}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export const Navbar = memo(NavbarComponent)
