"use client"

import { memo } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

interface WebsiteHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function WebsiteHeaderComponent({ sidebarOpen, onToggleSidebar }: WebsiteHeaderProps) {
  const { language } = useLanguage()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center gap-2 min-w-0 group">
          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force FC Logo"
            width={50}
            height={50}
            className="object-contain w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 group-hover:scale-110 transition-transform"
            priority
          />
          <div className="hidden sm:block">
            <h1 className="font-[var(--font-display)] font-black text-lg sm:text-xl tracking-wider bg-clip-text text-transparent whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
              TITAN
            </h1>
            <p className="text-xs text-foreground/60">FORCE</p>
          </div>
          <h1 className="sm:hidden font-[var(--font-display)] font-black text-lg tracking-wider bg-clip-text text-transparent whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
            TF
          </h1>
        </Link>

        <div className="flex-1" />

        {/* Right Side - User Profile & Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* User Profile on Desktop */}
          <div className="hidden md:block">
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Link href="/login" className="neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline text-xs font-bold">
                {language === "bn" ? "লগইন" : "LOGIN"}
              </Link>
            )}
          </div>

          {/* Hamburger Menu - Right Side */}
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export const WebsiteHeader = memo(WebsiteHeaderComponent)
