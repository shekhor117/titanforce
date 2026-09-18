"use client"

import Link from "next/link"
import { ArrowUpRight, CalendarDays, ChevronRight, Home, LogOut, Settings, ShieldCheck, UserCircle, Users, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

const actions = [
  { href: "/fixtures-results", label: "Fixtures & results", description: "Follow every matchday", icon: CalendarDays },
  { href: "/team-squad", label: "Explore the squad", description: "Meet the Titan Force", icon: Users },
  { href: "/dashboard/user/profile", label: "Complete your profile", description: "Keep your details current", icon: UserCircle },
]

export function UserDashboard() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const firstName = user?.name?.split(" ")[0] || (isBn ? "ব্যবহারকারী" : "there")
  const joinedLabel = isBn ? "সক্রিয় সদস্য" : "Active member"

  if (!user) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Return to Titan Force home">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Zap className="size-5" /></div>
            <div><p className="font-[var(--font-display)] text-lg tracking-[0.18em] text-foreground">TITAN FORCE</p><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Member portal</p></div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block" aria-label="Home"><Home className="size-5" /></Link>
            <Link href="/dashboard/user/settings" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Settings"><Settings className="size-5" /></Link>
            <button onClick={logout} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Log out"><LogOut className="size-5" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-10">
        <aside className="hidden lg:block">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
          <nav className="flex flex-col gap-1">
            <Link href="/dashboard/user" className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-3 text-sm font-semibold text-primary"><Zap className="size-4" />Overview</Link>
            <Link href="/dashboard/user/profile" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><UserCircle className="size-4" />Profile</Link>
            <Link href="/dashboard/user/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Settings className="size-4" />Settings</Link>
          </nav>
          <div className="mt-8 rounded-2xl border border-border bg-card p-4"><ShieldCheck className="mb-4 size-5 text-primary" /><p className="text-sm font-semibold">Your account is secure</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Signed in with Supabase Auth.</p></div>
        </aside>

        <section className="min-w-0">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm sm:p-8">
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">{joinedLabel}</p><h1 className="max-w-xl font-[var(--font-display)] text-4xl tracking-wide sm:text-5xl">{isBn ? `স্বাগতম, ${firstName}` : `Welcome back, ${firstName}`}</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{isBn ? "আপনার Titan Force অভিজ্ঞতা এখান থেকেই পরিচালনা করুন।" : "Your Titan Force experience, all in one place. Stay close to the club and your community."}</p></div>
              <Link href="/dashboard/user/profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">Edit profile <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account status</p><div className="mt-3 flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-emerald-500" />Active</div></div>
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Access level</p><p className="mt-3 text-sm font-semibold">Standard member</p></div>
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Member since</p><p className="mt-3 text-sm font-semibold">Titan Force community</p></div>
          </div>

          <div className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Make your move</p><h2 className="mt-1 text-2xl font-semibold">Quick actions</h2></div><Link href="/" className="hidden items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary sm:flex">View site <ChevronRight className="size-4" /></Link></div><div className="grid gap-3 md:grid-cols-3">{actions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"><div className="mb-8 flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div><ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></div><h3 className="font-semibold">{action.label}</h3><p className="mt-1 text-sm text-muted-foreground">{action.description}</p></Link> })}</div></div>

          <div className="mt-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your hub</p><h2 className="mt-1 text-xl font-semibold">Stay connected</h2></div><Users className="size-5 text-muted-foreground" /></div><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Follow fixtures, discover player stories, and keep your profile ready for the next club update.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/news" className="rounded-lg border border-border px-3 py-2 text-xs font-bold transition-colors hover:border-primary hover:text-primary">Latest news</Link><Link href="/contact" className="rounded-lg border border-border px-3 py-2 text-xs font-bold transition-colors hover:border-primary hover:text-primary">Contact the club</Link></div></div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6"><ShieldCheck className="size-5 text-primary" /><h2 className="mt-4 text-xl font-semibold">Member access</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your dashboard is protected by Supabase Auth and connected to your Titan Force account.</p></div>
          </div>
        </section>
      </div>
    </main>
  )
}
