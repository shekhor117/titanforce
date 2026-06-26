export function PossessionRing() {
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
