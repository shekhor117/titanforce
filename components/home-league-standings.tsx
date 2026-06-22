"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { ArrowRight } from "lucide-react"

export function HomeLeagueStandings() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const standings = [
    { rank: 1, team: "Titan Force Mulikandi", played: 6, goalDiff: "+12", points: 16, isHighlighted: true },
    { rank: 2, team: "Greenfield FC", played: 6, goalDiff: "+6", points: 13 },
    { rank: 3, team: "Riverside United", played: 6, goalDiff: "+3", points: 10 },
    { rank: 4, team: "Blue Eagles", played: 6, goalDiff: "0", points: 8 },
    { rank: 5, team: "United Stars", played: 6, goalDiff: "-5", points: 6 },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className={`text-lg sm:text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            {isBn ? "লীগ স্ট্যান্ডিংস" : "League Standings"}
          </h2>
          <Link
            href="/fixtures-results"
            className="text-red-500 hover:text-red-400 text-sm font-semibold flex items-center gap-1 transition-colors duration-300"
          >
            {isBn ? "সম্পূর্ণ টেবিল" : "View Full Table"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Standings Table */}
        <div className="rounded-lg overflow-hidden border border-foreground/10 bg-card/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10 bg-red-500/10">
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    #
                  </th>
                  <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "দল" : "Team"}
                  </th>
                  <th className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    P
                  </th>
                  <th className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    GD
                  </th>
                  <th className={`px-4 py-3 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    PTS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {standings.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-300 hover:bg-red-500/5 ${
                      row.isHighlighted ? "bg-red-500/10 border-l-4 border-red-500" : ""
                    }`}
                  >
                    <td className={`px-4 py-4 font-bold text-foreground ${row.isHighlighted ? "text-red-500" : ""}`}>
                      {row.rank}
                    </td>
                    <td className={`px-4 py-4 font-semibold text-foreground text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {row.team}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground/70">{row.played}</td>
                    <td className="px-4 py-4 text-center text-sm text-foreground/70">{row.goalDiff}</td>
                    <td className={`px-4 py-4 text-center font-bold ${row.isHighlighted ? "text-red-500 text-lg" : "text-foreground"}`}>
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
