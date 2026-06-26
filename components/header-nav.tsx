import { Search, ShoppingBag } from "lucide-react";
import { Logo } from "./logo";

const NAV = ["HOME", "FIXTURES", "PLAYERS", "GALLERY", "SHOP", "CLUB", "NEWS", "CONTACT"];

export function Header() {
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
