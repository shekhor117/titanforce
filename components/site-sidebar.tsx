"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Home,
  Users,
  Calendar,
  Sparkles,
  Mail,
  ShoppingBag,
  Globe,
  Info,
  ChevronLeft,
  Trophy,
  Newspaper,
  ImageIcon,
  LogIn,
  Bell,
  TrendingUp,
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
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { DataService } from "@/lib/data-service"
import type { Match, NewsItem, Player } from "@/lib/data-service"

export function SiteSidebar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()
  const { setOpenMobile, toggleSidebar, state, isMobile } = useSidebar()

  const isCollapsed = state === "collapsed"
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Live data from admin panel
  const [upcomingMatch, setUpcomingMatch] = useState<Match | null>(null)
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null)
  const [playerCount, setPlayerCount] = useState(0)
  const [matchStats, setMatchStats] = useState({ wins: 0, total: 0 })

  // Fetch live data from database
  useEffect(() => {
    const dataService = new DataService()

    const fetchData = async () => {
      try {
        // Get matches
        const matches = await dataService.getMatches()
        const upcoming = matches.find(m => m.status === 'scheduled')
        setUpcomingMatch(upcoming || null)
        
        const completedMatches = matches.filter(m => m.status === 'completed')
        const wins = completedMatches.filter(m => {
          if (m.goals_for !== undefined && m.goals_against !== undefined) {
            return m.goals_for > m.goals_against
          }
          return false
        }).length
        setMatchStats({ wins, total: completedMatches.length })

        // Get news
        const news = await dataService.getNewsItems()
        setLatestNews(news[0] || null)

        // Get players
        const players = await dataService.getPlayers()
        setPlayerCount(players.filter(p => p.status === 'active' || p.status === 'Active').length)
      } catch (error) {
        console.error("[v0] Error fetching sidebar data:", error)
      }
    }

    fetchData()

    // Subscribe to real-time updates
    const unsubMatches = dataService.subscribeToMatches(async () => {
      const matches = await dataService.getMatches()
      const upcoming = matches.find(m => m.status === 'scheduled')
      setUpcomingMatch(upcoming || null)
      
      const completedMatches = matches.filter(m => m.status === 'completed')
      const wins = completedMatches.filter(m => {
        if (m.goals_for !== undefined && m.goals_against !== undefined) {
          return m.goals_for > m.goals_against
        }
        return false
      }).length
      setMatchStats({ wins, total: completedMatches.length })
    })

    const unsubNews = dataService.subscribeToNewsItems(async () => {
      const news = await dataService.getNewsItems()
      setLatestNews(news[0] || null)
    })

    const unsubPlayers = dataService.subscribeToPlayers(async (players) => {
      setPlayerCount(players.filter(p => p.status === 'active' || p.status === 'Active').length)
    })

    return () => {
      unsubMatches()
      unsubNews()
      unsubPlayers()
    }
  }, [])

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/about", label: t.nav.about, icon: Info },
    { href: "/team-squad", label: t.nav.squad, icon: Users, badge: playerCount > 0 ? playerCount : undefined },
    { href: "/fixtures-results", label: t.nav.matches, icon: Calendar },
    { href: "/features", label: language === "bn" ? "ফিচার" : "Features", icon: Sparkles },
    { href: "/gallery", label: language === "bn" ? "গ্যালারি" : "Gallery", icon: ImageIcon },
    { href: "/contact", label: t.nav.contact, icon: Mail },
  ]

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 group min-w-0"
            onClick={handleLinkClick}
          >
            <Image
              src="/logo.png"
              alt="Titan Force FC Logo"
              width={36}
              height={36}
              className="object-contain group-hover:scale-110 transition-transform flex-shrink-0"
            />
            {!isCollapsed && (
              <span
                className="font-[var(--font-display)] text-lg tracking-wider bg-clip-text text-transparent truncate"
                style={{
                  backgroundImage: "linear-gradient(107deg, #a71930 0%, #465fb1 100%)",
                }}
              >
                TITAN FORCE
              </span>
            )}
          </Link>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex-shrink-0 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/50" />

      <SidebarContent className="p-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            {language === "bn" ? "নেভিগেশন" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? link.label : undefined}
                      className={`h-10 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 hover:text-foreground"
                      } ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
                    >
                      <Link href={link.href} onClick={handleLinkClick}>
                        <link.icon
                          className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <span className="truncate">{link.label}</span>
                        {link.badge && !isCollapsed && (
                          <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-border/50" />

        {/* Live Stats Section */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {language === "bn" ? "লাইভ স্ট্যাটস" : "Live Stats"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 px-2">
                {/* Match Record */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {language === "bn" ? "ম্যাচ রেকর্ড" : "Match Record"}
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {matchStats.wins}W / {matchStats.total - matchStats.wins}L
                    </p>
                  </div>
                </div>

                {/* Next Match */}
                {upcomingMatch && (
                  <Link 
                    href="/fixtures-results" 
                    onClick={handleLinkClick}
                    className="block p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-accent/10">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {language === "bn" ? "পরবর্তী ম্যাচ" : "Next Match"}
                        </p>
                        <p className="text-sm font-semibold truncate">
                          vs {upcomingMatch.opponent}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {new Date(upcomingMatch.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Latest News */}
                {latestNews && (
                  <div className="p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-green-500/10">
                        <Newspaper className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {language === "bn" ? "সর্বশেষ সংবাদ" : "Latest News"}
                        </p>
                        <p className="text-sm font-medium truncate">
                          {latestNews.title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Collapsed Stats Icons */}
        {isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={`${matchStats.wins}W / ${matchStats.total - matchStats.wins}L`}
                    className="h-10"
                  >
                    <Trophy className="w-4 h-4 text-primary" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {upcomingMatch && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={`Next: vs ${upcomingMatch.opponent}`}
                      className="h-10"
                    >
                      <Link href="/fixtures-results" onClick={handleLinkClick}>
                        <Bell className="w-4 h-4 text-accent" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {latestNews && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={latestNews.title}
                      className="h-10"
                    >
                      <Newspaper className="w-4 h-4 text-green-500" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarSeparator className="my-2 bg-border/50" />

        {/* Store Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/shop"}
                  tooltip={isCollapsed ? (language === "bn" ? "স্টোর" : "Store") : undefined}
                  className={`h-11 text-sm font-bold transition-all ${
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
                    <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span>{language === "bn" ? "স্টোর" : "STORE"}</span>}
                    {cartItemCount > 0 && (
                      <span className={`absolute ${isCollapsed ? "-top-1 -right-1" : "top-1/2 -translate-y-1/2 right-2"} w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center`}>
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

      <SidebarFooter className="p-3 border-t border-border/50">
        <div className="flex flex-col gap-2">
          <div className={`flex items-center ${isCollapsed ? "flex-col" : ""} gap-2`}>
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className={`flex items-center justify-center gap-1.5 ${
                isCollapsed ? "p-2" : "px-3 py-2 flex-1"
              } rounded-md border border-border text-foreground hover:bg-muted transition-all text-sm font-medium`}
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>{language === "en" ? "বাংলা" : "EN"}</span>}
            </button>
          </div>

          {user ? (
            <UserProfileDropdown onClose={handleLinkClick} />
          ) : (
            <Link
              href="/login"
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-sm uppercase tracking-wider rounded-md bg-primary text-primary-foreground hover:opacity-90 transition ${
                language === "bn" ? "font-[var(--font-bengali)]" : ""
              }`}
              onClick={handleLinkClick}
            >
              <LogIn className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (language === "bn" ? "লগইন" : "Login")}
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
