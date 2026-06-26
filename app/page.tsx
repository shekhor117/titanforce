"use client"

import Link from "next/link"
import {
  Search, ShoppingBag, ChevronRight, Play, MapPin, Trophy, Users, Heart, Target,
  Calendar, ArrowRight, Menu, X, Globe,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { ButtonModern } from "@/components/button-modern"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { useCart } from "@/lib/cart-context"

const NAV = [
  { name: "HOME", href: "/" },
  { name: "FIXTURES", href: "/fixtures-results" },
  { name: "PLAYERS", href: "/team-squad" },
  { name: "GALLERY", href: "/gallery" },
  { name: "SHOP", href: "/shop" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="relative h-11 w-11 grid place-items-center rounded-md bg-gradient-to-br from-red-600 to-orange-600 shadow-lg">
        <span className="font-display text-lg font-bold tracking-tighter text-white">TFM</span>
        <span className="absolute -inset-px rounded-md border border-red-400/40" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-semibold tracking-wider text-foreground">TITAN FORCE</div>
        <div className="text-[10px] tracking-[0.3em] text-muted-foreground">MULIKANDI</div>
      </div>
    </Link>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { user } = useAuth()
  const { items } = useCart()
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
        <Logo />
        
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[12px] font-semibold tracking-[0.18em]">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative transition-colors hover:text-red-600 ${
                i === 0 ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {n.name}
              {i === 0 && <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-red-600" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button aria-label="Search" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/shop" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag className="h-4 w-4" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-600" />
            )}
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
          </button>
          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link href="/login">
              <ButtonModern variant="neumorphic-accent" size="sm">
                LOGIN
              </ButtonModern>
            </Link>
          )}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden px-4 sm:px-6 pb-4 flex flex-col gap-3 border-t border-border/60">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-muted-foreground hover:text-red-600 py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {n.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-soccer.jpg"
          alt="Titan Force Mulikandi players celebrating"
          fill
          priority
          className="object-cover object-[70%_top] sm:object-top opacity-80 sm:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/70 to-background/40 sm:to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-24 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 min-h-[560px] sm:min-h-[680px]">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-red-600 text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 sm:mb-6">
            <span className="h-px w-6 sm:w-8 bg-red-600" /> RISE LIKE TITANS
          </div>
          <h1 className="font-display font-bold leading-[0.85] tracking-tight">
            <span className="block text-foreground text-[clamp(2.25rem,11vw,8rem)]">TITAN FORCE</span>
            <span className="block text-red-600 text-[clamp(2.75rem,13vw,10rem)]">
              MULIKANDI
            </span>
          </h1>
          <p className="mt-5 sm:mt-6 text-muted-foreground max-w-md text-sm leading-relaxed">
            Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button className="group inline-flex items-center gap-2 rounded-md bg-red-600 px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-white hover:bg-red-700 transition-colors">
              GET TICKETS <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center gap-3 rounded-md border border-border bg-card/40 backdrop-blur px-4 sm:px-5 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] hover:bg-card transition-colors">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-red-600"><Play className="h-3 w-3 fill-current text-white" /></span>
              WATCH HIGHLIGHTS
            </button>
          </div>
        </div>

        {/* Match Card */}
        <div className="self-center lg:justify-self-end w-full max-w-sm rounded-lg p-5 sm:p-6 backdrop-blur-md bg-card/70 border border-border">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NEXT MATCH</div>
          <div className="text-red-600 text-xs font-bold tracking-[0.3em] mt-1">PREMIER LEAGUE</div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <TeamBadge name="TFM" color="red" />
            <div className="font-display text-2xl font-bold text-muted-foreground">VS</div>
            <TeamBadge name="RIVALS" color="blue" label="RIVALS FC" />
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-red-600 shrink-0" />
              <span className="truncate">Sunday, 28 June 2026</span>
              <span className="ml-auto text-foreground shrink-0">4:30 PM</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-red-600 shrink-0" /> <span className="truncate">Mulikandi Stadium</span>
            </div>
          </div>
          <Link href="/fixtures-results" className="mt-5 w-full block text-center rounded-md border border-border bg-background/60 py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
            MATCH CENTRE
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative border-y border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-2 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: ArrowRight, value: "2018", label: "FOUNDED" },
            { icon: Trophy, value: "3", label: "LEAGUE TITLES" },
            { icon: Trophy, value: "2", label: "FA CUPS" },
            { icon: Heart, value: "12K+", label: "FANS" },
            { icon: Users, value: "45", label: "PLAYERS" },
            { icon: Target, value: "VISION", label: "ONE TITAN FAMILY" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 py-4 sm:py-5 px-3 sm:px-5 border-b sm:border-b-0 sm:border-r border-border last:border-r-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r [&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0">
              <s.icon className="h-5 w-5 text-red-600 shrink-0" />
              <div className="min-w-0">
                <div className="font-display text-lg sm:text-xl font-bold truncate">{s.value}</div>
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamBadge({ name, color, label }: { name: string; color: "red" | "blue"; label?: string }) {
  const isRed = color === "red"
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-14 w-14 grid place-items-center rounded-md font-display font-bold text-sm text-white ${
        isRed ? "bg-gradient-to-br from-red-600 to-red-700" : "bg-gradient-to-br from-blue-600 to-blue-700"
      }`}>{name}</div>
      <div className="text-[10px] tracking-[0.2em]">{label ?? "TFM"}</div>
    </div>
  )
}

function SectionHeader({ kicker, title, action, actionHref }: { kicker?: string; title: string; action?: string; actionHref?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {kicker && <div className="text-red-600 text-[10px] font-bold tracking-[0.3em] mb-1">{kicker}</div>}
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wider">{title}</h2>
      </div>
      {action && actionHref && (
        <Link href={actionHref} className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.25em] text-muted-foreground hover:text-red-600 transition-colors">
          {action} <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}

function LatestNews() {
  const items = [
    { img: "/images/news-1.png", title: "Coach Rahman on the upcoming big clash", date: "24 May 2026" },
    { img: "/images/news-2.png", title: "Sabbir Hossain scores a brace against Warriors", date: "22 May 2026" },
    { img: "/images/news-3.png", title: "Mulikandi Stadium gets a new look", date: "20 May 2026" },
    { img: "/images/news-4.png", title: "Player of the Month — Rahim Uddin", date: "18 May 2026" },
  ]
  return (
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="rounded-lg p-4 sm:p-6 md:p-8 border border-border bg-card/50">
        <SectionHeader title="LATEST NEWS" action="VIEW ALL NEWS" actionHref="/contact" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((n) => (
            <Link key={n.title} href="/contact" className="group block">
              <div className="overflow-hidden rounded-md border border-border">
                <Image
                  src={n.img}
                  alt={n.title}
                  width={768}
                  height={576}
                  className="h-44 sm:h-40 lg:h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold leading-snug group-hover:text-red-600 transition-colors">
                {n.title}
              </h3>
              <div className="mt-2 text-[11px] tracking-widest text-muted-foreground">{n.date}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PossessionRing() {
  const r = 52, c = 2 * Math.PI * r, pct = 63
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="currentColor" strokeOpacity="0.2" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={r} stroke="rgb(220, 38, 38)" strokeWidth="10" fill="none"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-red-600">63%</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">TFM</div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-2xl font-bold text-muted-foreground">37%</div>
        <div className="text-[10px] tracking-widest text-muted-foreground">OPP</div>
      </div>
    </div>
  )
}

function StatBar({ label, value, pct }: { label: string; value: string | number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] tracking-widest text-muted-foreground mb-1.5">
        <span>{label}</span><span className="text-foreground font-bold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function MatchStats() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="rounded-lg p-4 sm:p-6 md:p-8 border border-border bg-card/50">
        <SectionHeader title="PREMIUM MATCH STATS" />
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Possession */}
          <div className="rounded-md border border-border bg-background/40 p-5 sm:p-6">
            <div className="text-[11px] tracking-[0.3em] text-muted-foreground mb-5 sm:mb-6">BALL POSSESSION</div>
            <PossessionRing />
            <div className="mt-6 sm:mt-8 space-y-4">
              <StatBar label="TOTAL SHOTS" value={8} pct={70} />
              <StatBar label="SHOTS ON TARGET" value={3} pct={45} />
              <StatBar label="PASSES" value={358} pct={85} />
              <StatBar label="PASS ACCURACY" value="78%" pct={78} />
            </div>
            <button className="mt-6 w-full rounded-md border border-border py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
              VIEW FULL STATS
            </button>
          </div>

          {/* Last match */}
          <div className="rounded-md border border-border bg-background/40 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 grid place-items-center rounded bg-red-600 font-display text-[10px] font-bold shrink-0 text-white">TFM</div>
                <span className="text-xs font-bold tracking-wider truncate">TFM</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold whitespace-nowrap">3 <span className="text-muted-foreground mx-1 sm:mx-2">-</span> 1</div>
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <span className="text-xs font-bold tracking-wider truncate hidden sm:inline">WARRIORS FC</span>
                <span className="text-xs font-bold tracking-wider truncate sm:hidden">WAR</span>
                <div className="h-8 w-8 grid place-items-center rounded bg-blue-600 font-display text-[10px] font-bold shrink-0 text-white">WAR</div>
              </div>
            </div>
            <div className="text-center text-[10px] tracking-widest text-muted-foreground mt-2">
              20 MAY 2026 · PREMIER LEAGUE
            </div>

            {/* Pitch */}
            <div className="mt-6 relative aspect-[4/3] rounded-md overflow-hidden border border-border bg-green-950">
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
                <rect x="10" y="10" width="380" height="280" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <line x1="200" y1="10" x2="200" y2="290" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <circle cx="200" cy="150" r="40" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <rect x="10" y="90" width="60" height="120" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <rect x="330" y="90" width="60" height="120" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="mt-4 text-[10px] tracking-widest text-muted-foreground text-center">ATTACKING ZONES</div>
            <div className="mt-2 grid grid-cols-3 text-center">
              {[["28%","LEFT"],["44%","CENTER"],["28%","RIGHT"]].map(([v,l])=>(
                <div key={l}>
                  <div className="font-display text-xl font-bold text-red-600">{v}</div>
                  <div className="text-[10px] tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top players */}
          <div className="rounded-md border border-border bg-background/40 p-6">
            <div className="text-[11px] tracking-[0.3em] text-muted-foreground mb-4">TOP PLAYERS</div>
            <ul className="divide-y divide-border">
              {[
                { name: "Rahim Uddin", role: "Match Rating", val: "8.6" },
                { name: "Sabbir Hossain", role: "Top Scorer", val: "7", unit: "Goals" },
                { name: "Arif Ahmed", role: "Pass Accuracy", val: "92%" },
                { name: "Rony Hasan", role: "Most Assists", val: "5", unit: "Assists" },
              ].map((p) => (
                <li key={p.name} className="flex items-center gap-3 py-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600/50 to-red-700 grid place-items-center font-display text-xs font-bold text-white">
                    {p.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-red-600">{p.val}</div>
                    {p.unit && <div className="text-[9px] tracking-widest text-muted-foreground">{p.unit}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/team-squad" className="mt-4 w-full block text-center rounded-md border border-border py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
              VIEW ALL PLAYERS
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LatestNews />
        <MatchStats />
      </main>
      <Footer />
    </div>
  )
}
