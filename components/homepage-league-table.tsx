"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface TableRow {
  pos: number
  team: string
  matches: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
  points: number
  isHighlighted?: boolean
}

export function HomepageLeagueTable() {
  const { language, t } = useLanguage()

  const tableData: TableRow[] = [
    { pos: 1, team: "TITAN FORCE", matches: 37, wins: 28, draws: 6, losses: 3, gf: 90, ga: 45, points: 90, isHighlighted: true },
    { pos: 2, team: "CITY ROVERS", matches: 37, wins: 24, draws: 7, losses: 6, gf: 78, ga: 28, points: 79 },
    { pos: 3, team: "EAST UNITED", matches: 37, wins: 22, draws: 8, losses: 7, gf: 72, ga: 22, points: 74 },
    { pos: 4, team: "RIVER TOWN", matches: 37, wins: 20, draws: 6, losses: 11, gf: 65, ga: 15, points: 66 },
    { pos: 5, team: "NORTH CITY", matches: 37, wins: 17, draws: 9, losses: 11, gf: 60, ga: 8, points: 60 },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              {language === "bn" ? "লীগ টেবিল" : "LEAGUE TABLE"}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl uppercase tracking-wider text-foreground">
              {language === "bn" ? "স্ট্যান্ডিংস" : "STANDINGS"}
            </h2>
          </div>
          <Link
            href="/standings"
            className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wide font-semibold text-foreground hover:text-primary transition-colors"
          >
            {language === "bn" ? "সম্পূর্ণ টেবিল" : "VIEW FULL TABLE"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* League Table */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    POS
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    CLUB
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    P
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    W
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    D
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    L
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    GD
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    PTS
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border/30 transition-colors ${
                      row.isHighlighted
                        ? "bg-primary/15 hover:bg-primary/20"
                        : "hover:bg-muted/10"
                    }`}
                  >
                    <td className={`px-4 py-4 font-bold text-sm ${row.isHighlighted ? "text-primary" : "text-foreground"}`}>
                      {row.pos}
                    </td>
                    <td className={`px-4 py-4 font-semibold text-sm ${row.isHighlighted ? "text-primary" : "text-foreground"}`}>
                      {row.team}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground hidden sm:table-cell">
                      {row.matches}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground hidden md:table-cell">
                      {row.wins}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground hidden lg:table-cell">
                      {row.draws}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground hidden lg:table-cell">
                      {row.losses}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground hidden md:table-cell">
                      {row.gf - row.ga > 0 ? "+" : ""}{row.gf - row.ga}
                    </td>
                    <td className={`px-4 py-4 text-right font-bold text-sm ${row.isHighlighted ? "text-primary" : "text-foreground"}`}>
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View Full Table Link */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/standings"
            className="inline-flex items-center gap-2 px-6 py-3 glass-btn-primary rounded font-bold text-sm uppercase tracking-wider text-foreground hover-lift transition-all"
          >
            {language === "bn" ? "সম্পূর্ণ টেবিল" : "VIEW FULL TABLE"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
