import { ChevronRight } from "lucide-react";

export function SectionHeader({ kicker, title, action }: { kicker?: string; title: string; action?: string }) {
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
