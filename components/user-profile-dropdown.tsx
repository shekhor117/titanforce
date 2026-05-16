"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, LayoutDashboard, UserCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

interface UserProfileDropdownProps {
  onClose?: () => void
}

export function UserProfileDropdown({ onClose }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: string | null) => {
    if (!role) return isBn ? "ব্যবহারকারী" : "User"
    const labels: Record<string, { en: string; bn: string }> = {
      player: { en: "Player", bn: "খেলোয়াড়" },
      fan: { en: "Fan", bn: "ফ্যান" },
      partner: { en: "Partner", bn: "পার্টনার" },
    }
    return labels[role]?.[language] || role
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    onClose?.()
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    onClose?.()
  }

  const menuItems = [
    {
      href: `/dashboard/${user.role}`,
      icon: LayoutDashboard,
      label: isBn ? "ড্যাশবোর্ড" : "Dashboard",
    },
    {
      href: `/dashboard/${user.role}/profile`,
      icon: UserCircle,
      label: isBn ? "প্রোফাইল" : "My Profile",
    },
    {
      href: `/dashboard/${user.role}/settings`,
      icon: Settings,
      label: isBn ? "সেটিংস" : "Settings",
    },
  ]

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            {getInitials(user.name)}
          </div>
        )}
        <span className={`text-sm font-semibold text-foreground hidden sm:block max-w-[100px] truncate ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {user.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-foreground/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border-2 border-secondary rounded-xl shadow-lg overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-secondary bg-secondary/20">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold border-2 border-primary">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-foreground truncate ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {user.name}
                </p>
                <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-secondary/50 transition-colors ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <item.icon className="w-5 h-5 text-foreground/60" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-secondary py-2">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{isBn ? "লগআউট" : "Logout"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
