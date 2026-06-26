export function Logo() {
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
