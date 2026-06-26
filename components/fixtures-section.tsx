import { SectionHeader } from "./section-header";

export function FixturesSection() {
  const tabs = ["ALL", "PREMIER LEAGUE", "FRIENDLY", "CUP"];
  const rows = [
    { date: "28 JUN 2026", opp: "RIVALS FC", venue: "Mulikandi Stadium" },
    { date: "05 JUL 2026", opp: "WARRIORS FC", venue: "Away" },
    { date: "12 JUL 2026", opp: "KINGS FC", venue: "Away", swap: true },
    { date: "19 JUL 2026", opp: "EAGLES FC", venue: "Mulikandi Stadium" },
    { date: "26 JUL 2026", opp: "TIGERS FC", venue: "Away", swap: true },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="panel p-4 sm:p-6 md:p-8">
        <SectionHeader title="FIXTURES & RESULTS" action="VIEW ALL FIXTURES" />
        
        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab, i) => (
            <button key={tab} className={`px-4 py-2 text-[11px] font-bold tracking-[0.15em] whitespace-nowrap rounded transition ${
              i === 0 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"
            }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Fixtures Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-[0.15em] text-muted-foreground">DATE</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-[0.15em] text-muted-foreground">OPPONENT</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-[0.15em] text-muted-foreground">VENUE</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition">
                  <td className="px-4 py-4 text-[11px] font-bold tracking-wider">{row.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded bg-primary/10 font-display text-[10px] font-bold">TFM</div>
                      <span className="text-sm font-semibold">{row.opp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
