"use client"

import { useAdmin } from "@/lib/admin-context"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const { logout } = useAdmin()
  const { language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isBn = language === "bn"

  const menuItems = [
    { href: "/admin/dashboard", label: isBn ? "ড্যাশবোর্ড" : "Dashboard", icon: "📊" },
    { href: "/admin/players", label: isBn ? "খেলোয়াড়" : "Players", icon: "⚽" },
    { href: "/admin/matches", label: isBn ? "ম্যাচ" : "Matches", icon: "🏆" },
    { href: "/admin/fans", label: isBn ? "অনুরাগী" : "Fans", icon: "👥" },
    { href: "/admin/partners", label: isBn ? "অংশীদার" : "Partners", icon: "🤝" },
    { href: "/admin/news", label: isBn ? "সংবাদ" : "News", icon: "📢" },
    { href: "/admin/media", label: isBn ? "মিডিয়া" : "Media", icon: "📸" },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded bg-primary text-primary-foreground"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r-2 border-primary p-6 overflow-y-auto transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <h2 className="font-[var(--font-display)] text-2xl tracking-wider text-primary">
            {isBn ? "অ্যাডমিন" : "ADMIN"}
          </h2>
          <p className={`text-xs text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নিয়ন্ত্রণ প্যানেল" : "Control Panel"}
          </p>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-primary/10 hover:text-primary transition ${
                isBn ? "font-[var(--font-bengali)]" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-semibold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            logout()
            setMobileOpen(false)
          }}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase">{isBn ? "লগআউট" : "Logout"}</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
