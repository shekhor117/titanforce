import { SectionHeader } from "./section-header";
import { useState } from "react";

export function Fixtures() {
  const [activeTab, setActiveTab] = useState("ALL");
  const tabs = ["ALL", "PREMIER LEAGUE", "FRIENDLY", "CUP"];
  const rows = [
    { date: "28 JUN 2026", opp: "RIVALS FC", venue: "Mulikandi Stadium" },
    { date: "05 JUL 2026", opp: "WARRIORS FC", venue: "Away" },
    { date: "12 JUL 2026", opp: "KINGS FC", venue: "Away", swap: true },
    { date: "19 JUL 2026", opp: "EAGLES FC", venue: "Mulikandi Stadium" },
    { date: "26 JUL 2026", opp: "TIGERS FC", venue: "Away", swap: true },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="panel p-4 sm:p-6 md:p-8">
        <SectionHeader title="FIXTURES" action="VIEW ALL FIXTURES" />
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[11px] font-bold tracking-[0.2em] rounded-md whitespace-nowrap transition ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-muted-foreground font-semibold tracking-widest">DATE</th>
                <th className="py-3 px-4 text-left text-muted-foreground font-semibold tracking-widest">OPPONENT</th>
                <th className="py-3 px-4 text-left text-muted-foreground font-semibold tracking-widest">VENUE</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border hover:bg-background/60 transition">
                  <td className="py-3 px-4 font-bold">{r.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {r.swap && <div className="h-6 w-6 grid place-items-center rounded bg-[oklch(0.3_0.1_240)] text-[10px] font-bold">OPP</div>}
                      <span>{r.opp}</span>
                      {!r.swap && <div className="h-6 w-6 grid place-items-center rounded bg-primary text-[10px] font-bold">TFM</div>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{r.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
