import { ChevronRight, Play, Calendar, MapPin, ArrowRight, Trophy, Heart, Users, Target } from "lucide-react";
import heroPlayers from "@/assets/hero-players.jpg";
import { TeamBadge } from "./team-badge";

export function Hero() {
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
