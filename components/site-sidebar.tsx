"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Calendar,
  Sparkles,
  Mail,
  ShoppingBag,
  Globe,
  Info,
  X,
  ChevronLeft,
  LogIn,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

export function SiteSidebar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()
  const { setOpenMobile, toggleSidebar, state } = useSidebar()

  const isCollapsed = state === "collapsed"

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/about", label: t.nav.about, icon: Info },
    { href: "/team-squad", label: t.nav.squad, icon: Users },
    { href: "/fixtures-results", label: t.nav.matches, icon: Calendar },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features", icon: Sparkles },
    { href: "/contact", label: t.nav.contact, icon: Mail },
  ]

  const handleLinkClick = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={handleLinkClick}
          >
            <Image
              src="/logo.png"
              alt="Titan Force FC Logo"
              width={40}
              height={40}
              className="object-contain group-hover:scale-110 transition-transform"
            />
            {!isCollapsed && (
              <span
                className="font-[var(--font-display)] text-xl tracking-wider bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(107deg, #a71930 0%, #465fb1 100%)",
                }}
              >
                TITAN FORCE
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpenMobile(false)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all ${
              isCollapsed ? "rotate-180" : ""
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/50" />

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`h-11 text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "hover:bg-muted/50 hover:text-foreground"
                      } ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                    >
                      <Link href={link.href} onClick={handleLinkClick}>
                        <link.icon
                          className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-border/50" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/shop"}
                  className={`h-12 text-base font-bold transition-all ${
                    pathname === "/shop"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <Link
                    href="/shop"
                    onClick={handleLinkClick}
                    className="relative"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{language === "bn" ? "স্টোর" : "STORE"}</span>
                    {cartItemCount > 0 && (
                      <span className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex flex-col gap-3">
          <div className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "gap-2"}`}>
            <ThemeToggle />
            {!isCollapsed && (
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border text-foreground hover:bg-muted transition-all flex-1 text-sm font-medium"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span>{language === "en" ? "বাংলা" : "English"}</span>
              </button>
            )}
            {isCollapsed && (
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="flex items-center justify-center p-2 rounded-md border border-border text-foreground hover:bg-muted transition-all"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
              </button>
            )}
          </div>

          {user ? (
            <UserProfileDropdown onClose={handleLinkClick} />
          ) : (
            <Link
              href="/login"
              className={`w-full px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-md bg-primary text-primary-foreground hover:opacity-90 transition text-center ${
                language === "bn" ? "font-[var(--font-bengali)]" : ""
              } ${isCollapsed ? "px-2" : ""}`}
              onClick={handleLinkClick}
            >
              {isCollapsed ? (
                <LogIn className="w-4 h-4 mx-auto" />
              ) : (
                language === "bn" ? "লগইন" : "Login"
              )}
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
