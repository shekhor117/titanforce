"use client"

import { useAdmin } from "@/lib/admin-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Menu } from "lucide-react"
import { useState, useRef } from "react"

export function AdminSidebar() {
  const { logout, isLoading, admin } = useAdmin()
  const { language } = useLanguage()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isBn = language === "bn"
  const isAdmin = admin?.role === "admin"

  // All menu items
  const allMenuItems = [
    { href: "/admin/dashboard", label: isBn ? "ড্যাশবোর্ড" : "Dashboard", icon: "📊", restricted: false },
    { href: "/admin/players", label: isBn ? "স্কোয়াড" : "Squad", icon: "⚽", restricted: false },
    { href: "/admin/squad-manager", label: isBn ? "স্কোয়াড ম্যানেজার" : "Squad Manager", icon: "🎯", restricted: false },
    { href: "/admin/matches", label: isBn ? "ম্যাচ" : "Matches", icon: "🏆", restricted: true, category: "team" },
    { href: "/admin/standings", label: isBn ? "স্ট্যান্ডিংস" : "Standings", icon: "📊", restricted: true, category: "team" },
    { href: "/admin/fans", label: isBn ? "অনুরাগী" : "Fans", icon: "👥", restricted: false },
    { href: "/admin/partners", label: isBn ? "অংশীদার" : "Partners", icon: "🤝", restricted: true, category: "team" },
    { href: "/admin/news", label: isBn ? "সংবাদ" : "News", icon: "📢", restricted: true, category: "team" },
    { href: "/admin/media", label: isBn ? "মিডিয়া" : "Media", icon: "📸", restricted: true, category: "tools" },
    { href: "/admin/contacts", label: isBn ? "যোগাযোগ" : "Contacts", icon: "✉️", restricted: true, category: "team" },
    { href: "/admin/player-profiles", label: isBn ? "খেলোয়াড় প্রোফাইল" : "Player Profiles", icon: "🎽", restricted: true, category: "team" },
    { href: "/admin/news-updates", label: isBn ? "সংবাদ আপডেট" : "News Updates", icon: "📰", restricted: true, category: "team" },
    
    // Store management
    { href: "/admin/store/products", label: isBn ? "পণ্য" : "Products", icon: "🛍️", restricted: true, category: "store" },
    { href: "/admin/store/orders", label: isBn ? "অর্ডার" : "Orders", icon: "📦", restricted: true, category: "store" },
    { href: "/admin/store/inventory", label: isBn ? "ইনভেন্টরি" : "Inventory", icon: "📋", restricted: true, category: "store" },
    { href: "/admin/store/analytics", label: isBn ? "বিক্রয় বিশ্লেষণ" : "Sales Analytics", icon: "💹", restricted: true, category: "store" },
    
    // CMS Management
    { href: "/admin/cms", label: isBn ? "সিএমএস" : "CMS", icon: "📝", restricted: true, category: "tools" },
    
    { href: "/admin/users", label: isBn ? "ব্যবহারকারী" : "Users", icon: "👤", restricted: true, category: "tools" },
    { href: "/admin/analytics", label: isBn ? "বিশ্লেষণ" : "Analytics", icon: "📈", restricted: true, category: "tools" },
    { href: "/admin/settings", label: isBn ? "সেটিংস" : "Settings", icon: "🔧", restricted: true, category: "tools" },
    { href: "/admin/system", label: isBn ? "সিস্টেম" : "System", icon: "💾", restricted: true, category: "tools" },
    { href: "/admin/features", label: isBn ? "বৈশিষ্ট্য" : "Features", icon: "⚙️", restricted: true, category: "tools" },
  ]

  // Filter menu items based on admin role
  const menuItems = allMenuItems.filter(item => {
    if (!item.restricted) return true
    return isAdmin
  })

  const handleLogout = async () => {
    try {
      await logout()
      setMobileOpen(false)
      
      // Defer router navigation to ensure router is ready
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = setTimeout(() => {
        try {
          router.push("/admin/login")
        } catch (err) {
          console.debug("[v0] Logout redirect error:", err)
        }
      }, 0)
    } catch (err) {
      console.debug("[v0] Logout error:", err)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r-2 border-primary p-6 overflow-y-auto transition-transform duration-300 z-40 md:translate-x-0 ${
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
        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors ${
                isBn ? "font-[var(--font-bengali)]" : ""
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors text-xs font-semibold uppercase ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>{isBn ? "লগআউট" : "Logout"}</span>
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
