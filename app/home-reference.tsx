import { createFileRoute } from "@tanstack/react-router";
import {
  Search, ShoppingBag, ChevronRight, Play, MapPin, Trophy, Users, Heart, Target,
  Calendar, ArrowRight,
} from "lucide-react";
import heroPlayers from "@/assets/hero-players.jpg";
import teamHuddle from "@/assets/team-huddle.jpg";
import newsCoach from "@/assets/news-coach.jpg";
import newsGoal from "@/assets/news-goal.jpg";
import newsStadium from "@/assets/news-stadium.jpg";
import newsPlayer from "@/assets/news-player.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Titan Force Mulikandi — Rise Like Titans" },
      { name: "description", content: "Official home of Titan Force Mulikandi FC. Fixtures, players, match stats, and the latest club news." },
      { property: "og:title", content: "Titan Force Mulikandi FC" },
      { property: "og:description", content: "Pride of Mulikandi. Power of the Titans." },
    ],
  }),
  component: Index,
});

const NAV = ["HOME", "FIXTURES", "PLAYERS", "GALLERY", "SHOP", "CLUB", "NEWS", "CONTACT"];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 grid place-items-center rounded-md bg-gradient-to-br from-primary to-[oklch(0.4_0.18_25)] shadow-[var(--shadow-glow)]">
        <span className="font-display text-lg font-bold tracking-tighter">TFM</span>
        <span className="absolute -inset-px rounded-md border border-primary/40" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-semibold tracking-wider">TITAN FORCE</div>
        <div className="text-[10px] tracking-[0.3em] text-muted-foreground">MULIKANDI</div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
        <Logo />
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[12px] font-semibold tracking-[0.18em]">
          {NAV.map((n, i) => (
            <a key={n} href="#" className={`relative transition-colors hover:text-primary ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
              {n}
              {i === 0 && <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <button aria-label="Search" className="p-2 text-muted-foreground hover:text-foreground"><Search className="h-4 w-4" /></button>
          <button aria-label="Cart" className="relative p-2 text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold tracking-widest text-primary-foreground hover:brightness-110 shadow-[var(--shadow-glow)]">
            LOGIN
          </button>
        </div>
      </div>
    </header>

  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroPlayers}
          alt="Titan Force Mulikandi players celebrating"
          width={1536}
          height={1024}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[70%_top] sm:object-top opacity-80 sm:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/70 to-background/40 sm:to-transparent" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-24 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 min-h-[560px] sm:min-h-[680px]">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-primary text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 sm:mb-6">
            <span className="h-px w-6 sm:w-8 bg-primary" /> RISE LIKE TITANS
          </div>
          <h1 className="font-display font-bold leading-[0.85] tracking-tight">
            <span className="block text-stroke text-[clamp(2.25rem,11vw,8rem)]">TITAN FORCE</span>
            <span className="block text-primary text-[clamp(2.75rem,13vw,10rem)] drop-shadow-[0_4px_30px_oklch(0.58_0.22_25/0.6)]">
              MULIKANDI
            </span>
          </h1>
          <p className="mt-5 sm:mt-6 text-muted-foreground max-w-md text-sm leading-relaxed">
            Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110">
              GET TICKETS <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center gap-3 rounded-md border border-border bg-card/40 backdrop-blur px-4 sm:px-5 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] hover:bg-card">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary"><Play className="h-3 w-3 fill-current" /></span>
              WATCH HIGHLIGHTS
            </button>
          </div>
        </div>

        {/* Match Card */}
        <div className="self-center lg:justify-self-end w-full max-w-sm panel p-5 sm:p-6 backdrop-blur-md bg-card/70">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NEXT MATCH</div>
          <div className="text-primary text-xs font-bold tracking-[0.3em] mt-1">PREMIER LEAGUE</div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <TeamBadge name="TFM" color="primary" />
            <div className="font-display text-2xl font-bold text-muted-foreground">VS</div>
            <TeamBadge name="RIVALS" color="blue" label="RIVALS FC" />
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">Sunday, 28 June 2026</span>
              <span className="ml-auto text-foreground shrink-0">4:30 PM</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" /> <span className="truncate">Mulikandi Stadium</span>
            </div>
          </div>
          <button className="mt-5 w-full rounded-md border border-border bg-background/60 py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-primary hover:border-primary transition">
            MATCH CENTRE
          </button>
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
              <s.icon className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="font-display text-lg sm:text-xl font-bold truncate">{s.value}</div>
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
}

function TeamBadge({ name, color, label }: { name: string; color: "primary" | "blue"; label?: string }) {
  const isPrimary = color === "primary";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-14 w-14 grid place-items-center rounded-md font-display font-bold text-sm ${
        isPrimary ? "bg-gradient-to-br from-primary to-[oklch(0.4_0.2_25)]" : "bg-gradient-to-br from-[oklch(0.4_0.15_240)] to-[oklch(0.3_0.1_240)]"
      }`}>{name}</div>
      <div className="text-[10px] tracking-[0.2em]">{label ?? "TFM"}</div>
    </div>
  );
}

function SectionHeader({ kicker, title, action }: { kicker?: string; title: string; action?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {kicker && <div className="text-primary text-[10px] font-bold tracking-[0.3em] mb-1">{kicker}</div>}
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wider">{title}</h2>
      </div>
      {action && (
        <a href="#" className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.25em] text-muted-foreground hover:text-primary">
          {action} <ChevronRight className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function LatestNews() {
  const items = [
    { img: newsCoach, title: "Coach Rahman on the upcoming big clash", date: "24 May 2026" },
    { img: newsGoal, title: "Sabbir Hossain scores a brace against Warriors", date: "22 May 2026" },
    { img: newsStadium, title: "Mulikandi Stadium gets a new look", date: "20 May 2026" },
    { img: newsPlayer, title: "Player of the Month — Rahim Uddin", date: "18 May 2026" },
  ];
  return (
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="panel p-4 sm:p-6 md:p-8">
        <SectionHeader title="LATEST NEWS" action="VIEW ALL NEWS" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((n) => (
            <a key={n.title} href="#" className="group block">
              <div className="overflow-hidden rounded-md border border-border">
                <img src={n.img} alt={n.title} width={768} height={576} loading="lazy" decoding="async"
                  className="h-44 sm:h-40 lg:h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              <h3 className="mt-4 font-display text-base font-semibold leading-snug group-hover:text-primary transition">
                {n.title}
              </h3>
              <div className="mt-2 text-[11px] tracking-widest text-muted-foreground">{n.date}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PossessionRing() {
  const r = 52, c = 2 * Math.PI * r, pct = 63;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="oklch(0.28 0.04 25)" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={r} stroke="oklch(0.58 0.22 25)" strokeWidth="10" fill="none"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-primary">63%</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">TFM</div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-2xl font-bold text-muted-foreground">37%</div>
        <div className="text-[10px] tracking-widest text-muted-foreground">OPP</div>
      </div>
    </div>
  );
}


function StatBar({ label, value, pct }: { label: string; value: string | number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] tracking-widest text-muted-foreground mb-1.5">
        <span>{label}</span><span className="text-foreground font-bold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.2_25)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MatchStats() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="panel p-4 sm:p-6 md:p-8">
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
            <button className="mt-6 w-full rounded-md border border-border py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-primary hover:border-primary transition">
              VIEW FULL STATS
            </button>
          </div>


          {/* Last match */}
          <div className="rounded-md border border-border bg-background/40 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 grid place-items-center rounded bg-primary font-display text-[10px] font-bold shrink-0">TFM</div>
                <span className="text-xs font-bold tracking-wider truncate">TFM</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold whitespace-nowrap">3 <span className="text-muted-foreground mx-1 sm:mx-2">-</span> 1</div>
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <span className="text-xs font-bold tracking-wider truncate hidden sm:inline">WARRIORS FC</span>
                <span className="text-xs font-bold tracking-wider truncate sm:hidden">WAR</span>
                <div className="h-8 w-8 grid place-items-center rounded bg-[oklch(0.3_0.1_240)] font-display text-[10px] font-bold shrink-0">WAR</div>
              </div>
            </div>
            <div className="text-center text-[10px] tracking-widest text-muted-foreground mt-2">
              20 MAY 2026 · PREMIER LEAGUE
            </div>

            {/* Pitch */}
            <div className="mt-6 relative aspect-[4/3] rounded-md overflow-hidden border border-border bg-[radial-gradient(ellipse_at_center,oklch(0.35_0.15_140),oklch(0.18_0.06_140))]">
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
                <rect x="10" y="10" width="380" height="280" fill="none" stroke="oklch(0.97 0 0 / 0.3)" strokeWidth="1.5" />
                <line x1="200" y1="10" x2="200" y2="290" stroke="oklch(0.97 0 0 / 0.3)" strokeWidth="1.5" />
                <circle cx="200" cy="150" r="40" fill="none" stroke="oklch(0.97 0 0 / 0.3)" strokeWidth="1.5" />
                <rect x="10" y="90" width="60" height="120" fill="none" stroke="oklch(0.97 0 0 / 0.3)" strokeWidth="1.5" />
                <rect x="330" y="90" width="60" height="120" fill="none" stroke="oklch(0.97 0 0 / 0.3)" strokeWidth="1.5" />
              </svg>
              {/* heatmap dots */}
              {[[120,120,40],[260,140,55],[300,160,30],[180,180,35],[230,100,25],[160,200,28]].map(([x,y,s],i)=>(
                <div key={i} className="absolute rounded-full" style={{
                  left: `${(x as number)/400*100}%`, top: `${(y as number)/300*100}%`,
                  width: `${s}px`, height: `${s}px`,
                  background: "radial-gradient(circle, oklch(0.7 0.25 80 / 0.7), transparent 70%)",
                  transform: "translate(-50%, -50%)"
                }} />
              ))}
            </div>
            <div className="mt-4 text-[10px] tracking-widest text-muted-foreground text-center">ATTACKING ZONES</div>
            <div className="mt-2 grid grid-cols-3 text-center">
              {[["28%","LEFT"],["44%","CENTER"],["28%","RIGHT"]].map(([v,l])=>(
                <div key={l}>
                  <div className="font-display text-xl font-bold text-primary">{v}</div>
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
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/50 to-secondary grid place-items-center font-display text-xs font-bold">
                    {p.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-[10px] tracking-widest text-muted-foreground">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-primary">{p.val}</div>
                    {p.unit && <div className="text-[9px] tracking-widest text-muted-foreground">{p.unit}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full rounded-md border border-border py-2.5 text-[11px] font-bold tracking-[0.25em] hover:bg-primary hover:border-primary transition">
              VIEW ALL PLAYERS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fixtures() {
  const tabs = ["ALL", "PREMIER LEAGUE", "FRIENDLY", "CUP"];
  const rows = [
    { date: "28 JUN 2026", opp: "RIVALS FC", venue: "Mulikandi Stadium" },
    { date: "05 JUL 2026", opp: "WARRIORS FC", venue: "Away" },
    { date: "12 JUL 2026", opp: "KINGS FC", venue: "Away", swap: true },
    { date: "19 JUL 2026", opp: "EAGLES FC", venue: "Mulikandi Stadium" },
    { date: "26 JUL 2026", opp: "TIGERS FC", venue: "Away", swap: true },
    { date: "02 AUG 2026", opp: "LEGENDS FC", venue: "Mulikandi Stadium" },
  ];
  return (
    <div className="panel p-6">
      <SectionHeader title="FIXTURES" />
      <div className="text-[10px] tracking-widest text-muted-foreground mb-3">HOME / FIXTURES</div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t, i) => (
          <button key={t} className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded ${
            i === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}>{t}</button>
        ))}
      </div>
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.date} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 py-2.5 border-b border-border/50 text-[11px] sm:text-xs">
            <span className="font-bold tracking-wider text-muted-foreground whitespace-nowrap">{r.date}</span>
            <div className="flex items-center justify-center gap-2 min-w-0">
              <span className="h-6 w-6 grid place-items-center rounded bg-primary text-[9px] font-bold shrink-0">{r.swap ? "OPP" : "TFM"}</span>
              <span className="text-muted-foreground text-[10px]">VS</span>
              <span className="h-6 w-6 grid place-items-center rounded bg-[oklch(0.3_0.1_240)] text-[9px] font-bold shrink-0">{r.swap ? "TFM" : "OPP"}</span>
              <span className="font-bold truncate">{r.opp}</span>
            </div>
            <span className="text-muted-foreground text-right truncate max-w-[80px] sm:max-w-none hidden sm:inline">{r.venue}</span>
          </li>
        ))}
      </ul>

      <button className="mt-5 w-full rounded-md bg-primary py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
        VIEW FULL FIXTURES
      </button>
    </div>
  );
}

function Players() {
  const tabs = ["ALL", "GOALKEEPERS", "DEFENDERS", "MIDFIELDERS", "FORWARDS"];
  const players = [
    { n: "01", name: "RAKIB HOSSAIN", role: "Goalkeeper" },
    { n: "04", name: "ARIF AHMED", role: "Defender" },
    { n: "05", name: "SAJID KHAN", role: "Defender" },
    { n: "07", name: "RAHIM UDDIN", role: "Midfielder", c: true },
    { n: "10", name: "SABBIR HOSSAIN", role: "Forward" },
    { n: "11", name: "RONY HASAN", role: "Midfielder" },
  ];
  return (
    <div className="panel p-6">
      <SectionHeader title="PLAYERS" />
      <div className="text-[10px] tracking-widest text-muted-foreground mb-3">HOME / PLAYERS</div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t, i) => (
          <button key={t} className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded ${
            i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {players.map((p) => (
          <div key={p.n} className="relative overflow-hidden rounded-md border border-border bg-gradient-to-b from-secondary/40 to-background aspect-[3/4] p-3 flex flex-col justify-between hover:border-primary transition group">
            <div className="font-display text-3xl font-bold text-primary">{p.n}</div>
            {p.c && <div className="absolute top-3 right-3 h-5 w-5 grid place-items-center rounded-full bg-primary text-[10px] font-bold">C</div>}
            <div>
              <div className="font-display text-xs font-bold tracking-wider">{p.name}</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">{p.role}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-5 w-full rounded-md bg-primary py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
        VIEW ALL PLAYERS
      </button>
    </div>
  );
}

function About() {
  return (
    <div className="panel p-6">
      <SectionHeader title="ABOUT TFM" />
      <div className="text-[10px] tracking-widest text-muted-foreground mb-4">HOME / CLUB / ABOUT US</div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <h3 className="font-display text-xl font-bold leading-tight">
            MORE THAN A CLUB,<br /><span className="text-primary">WE ARE A FAMILY</span>
          </h3>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Titan Force Mulikandi (TFM) is a professional football club from Mulikandi. Our mission is to inspire, develop and win with pride.
          </p>
          <ul className="mt-4 space-y-1.5 text-xs">
            {["Discipline", "Unity", "Passion", "Respect"].map((v) => (
              <li key={v} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{v}</li>
            ))}
          </ul>
          <button className="mt-5 rounded-md bg-primary px-5 py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
            LEARN MORE
          </button>
        </div>
        <img src={teamHuddle} alt="Team huddle" width={1024} height={768} loading="lazy"
          className="rounded-md object-cover h-full w-full border border-border" />
      </div>
      <div className="mt-6 pt-5 border-t border-border">
        <div className="text-[10px] tracking-widest text-muted-foreground mb-3">OUR PARTNERS</div>
        <div className="flex items-center gap-6 flex-wrap text-muted-foreground font-display font-bold text-sm tracking-widest opacity-70">
          <span>◎ SPORTS</span><span>DURANTA</span><span>A4</span><span>EX</span><span>POWER</span><span>RASMONDARI</span>
        </div>
      </div>
    </div>
  );
}

function NewsList() {
  const items = [
    { img: newsCoach, t: "Training session ahead of the big match", d: "28 May 2026" },
    { img: newsGoal, t: "Injury Update: Two players ruled out", d: "26 May 2026" },
    { img: newsPlayer, t: "Youth Academy trials announced", d: "22 May 2026" },
    { img: newsStadium, t: "Thank you Titans Fans!", d: "18 May 2026" },
  ];
  return (
    <div className="panel p-6">
      <SectionHeader title="NEWS" />
      <div className="text-[10px] tracking-widest text-muted-foreground mb-4">HOME / NEWS</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.t} className="flex gap-3 group cursor-pointer">
            <img src={i.img} alt="" width={768} height={576} loading="lazy"
              className="h-16 w-24 object-cover rounded border border-border" />
            <div>
              <div className="text-xs font-semibold leading-snug group-hover:text-primary transition">{i.t}</div>
              <div className="text-[10px] tracking-widest text-muted-foreground mt-1">{i.d}</div>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-5 w-full rounded-md bg-primary py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
        VIEW ALL NEWS
      </button>
    </div>
  );
}

function Shop() {
  const items = [
    { name: "Home Jersey", price: "1,299", g: "from-primary to-[oklch(0.3_0.15_25)]" },
    { name: "Away Jersey", price: "1,299", g: "from-[oklch(0.95_0.005_0)] to-[oklch(0.7_0.01_0)]" },
    { name: "Training Kit", price: "1,199", g: "from-secondary to-background" },
    { name: "TFM Cap", price: "419", g: "from-[oklch(0.2_0.04_25)] to-background" },
    { name: "Scarf", price: "309", g: "from-primary to-secondary" },
    { name: "Water Bottle", price: "649", g: "from-[oklch(0.3_0.05_25)] to-background" },
  ];
  return (
    <div className="panel p-6">
      <SectionHeader title="SHOP" />
      <div className="text-[10px] tracking-widest text-muted-foreground mb-3">HOME / SHOP</div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["ALL", "JERSEYS", "TRAINING", "ACCESSORIES", "LIFESTYLE"].map((t, i) => (
          <button key={t} className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded ${
            i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.name} className="rounded-md border border-border overflow-hidden bg-background/40 hover:border-primary transition group">
            <div className={`aspect-square bg-gradient-to-br ${it.g} grid place-items-center`}>
              <span className="font-display text-2xl font-bold opacity-30">TFM</span>
            </div>
            <div className="p-3">
              <div className="text-[11px] font-bold tracking-wider">{it.name}</div>
              <div className="text-[11px] text-primary font-bold mt-0.5">৳ {it.price}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-5 w-full rounded-md bg-primary py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
        VIEW ALL PRODUCTS
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <Logo />
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Pride of Mulikandi. Power of the Titans. Join the family and rise with us.
          </p>
        </div>
        {[
          { t: "CLUB", l: ["About", "History", "Stadium", "Academy"] },
          { t: "TEAMS", l: ["Fixtures", "Players", "Results", "Standings"] },
          { t: "CONNECT", l: ["Contact", "Tickets", "Shop", "Newsletter"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="font-display text-xs font-bold tracking-[0.3em] text-primary mb-3">{c.t}</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border text-center text-[10px] tracking-widest text-muted-foreground py-4">
        © 2026 TITAN FORCE MULIKANDI · ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <LatestNews />
        <MatchStats />
        <section className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12 sm:pb-16">
          <Fixtures />
          <Players />
          <div className="md:col-span-2 lg:col-span-1">
            <div className="panel p-5 sm:p-6 h-full">
              <SectionHeader title="GALLERY" />
              <div className="grid grid-cols-2 gap-2">
                {[heroPlayers, teamHuddle, newsGoal, newsStadium].map((s, i) => (
                  <img key={i} src={s} alt="Team gallery" width={768} height={576} loading="lazy" decoding="async" className="aspect-square object-cover rounded border border-border" />
                ))}
              </div>
              <button className="mt-5 w-full rounded-md bg-primary py-2.5 text-[11px] font-bold tracking-[0.25em] hover:brightness-110">
                VIEW FULL GALLERY
              </button>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-16 sm:pb-20">
          <Shop />
          <About />
          <NewsList />
        </section>

      </main>
      <Footer />
    </div>
  );
}
