export function StatBar({ label, value, pct }: { label: string; value: string | number; pct: number }) {
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
