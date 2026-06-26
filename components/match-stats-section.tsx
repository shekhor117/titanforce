import { SectionHeader } from "./section-header";
import { PossessionRing } from "./possession-ring";
import { StatBar } from "./stat-bar";

export function MatchStatsSection() {
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
