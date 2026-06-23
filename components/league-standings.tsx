"use client"

import { Trophy, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface StandingsTeam {
  position: number
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
  form?: "W" | "D" | "L"[]
}

interface LeagueStandingsProps {
  teams?: StandingsTeam[]
}

// Mock data for demonstration
const mockStandings: StandingsTeam[] = [
  { position: 1, name: "Titan Force", played: 10, won: 8, drawn: 1, lost: 1, points: 25, form: ["W", "W", "D", "W", "W"] },
  { position: 2, name: "City United", played: 10, won: 7, drawn: 2, lost: 1, points: 23, form: ["W", "W", "W", "D", "L"] },
  { position: 3, name: "Royal FC", played: 10, won: 6, drawn: 2, lost: 2, points: 20, form: ["W", "D", "W", "L", "D"] },
  { position: 4, name: "Star Athletic", played: 10, won: 5, drawn: 3, lost: 2, points: 18, form: ["D", "W", "W", "D", "W"] },
  { position: 5, name: "United Warriors", played: 10, won: 4, drawn: 2, lost: 4, points: 14, form: ["L", "W", "D", "L", "W"] },
]

export function LeagueStandings({ teams = mockStandings }: LeagueStandingsProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const getFormColor = (form: "W" | "D" | "L") => {
    switch (form) {
      case "W":
        return "bg-green-500/30 border-green-500/50 text-green-400"
      case "D":
        return "bg-yellow-500/30 border-yellow-500/50 text-yellow-400"
      case "L":
        return "bg-red-500/30 border-red-500/50 text-red-400"
    }
  }

  return (
    <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-card/60 to-card/30 p-6 field-pattern">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
        <Trophy className="w-6 h-6 trophy-badge" />
        <h3 className="font-display text-lg tracking-[0.15em] uppercase match-title">
          {isBn ? "লিগ টেবিল" : "League Table"}
        </h3>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-primary/20">
              <th className="text-left py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">Pos</th>
              <th className="text-left py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">Team</th>
              <th className="text-center py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">P</th>
              <th className="text-center py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">W</th>
              <th className="text-center py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">D</th>
              <th className="text-center py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">L</th>
              <th className="text-center py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">Pts</th>
              <th className="text-left py-3 px-2 text-muted-foreground uppercase tracking-wider font-semibold text-xs">Form</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => (
              <tr
                key={team.position}
                className={`border-b border-secondary/30 hover:bg-primary/10 transition-colors ${
                  team.position === 1 ? "bg-primary/20 border-primary/30" : ""
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Position */}
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                    team.position === 1
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
                      : team.position <= 3
                      ? "bg-primary/40 text-primary border border-primary/50"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {team.position}
                  </div>
                </td>

                {/* Team Name */}
                <td className="py-3 px-2 font-semibold text-foreground">
                  {team.name}
                  {team.position === 1 && <TrendingUp className="w-4 h-4 inline ml-2 text-primary" />}
                </td>

                {/* Stats */}
                <td className="text-center py-3 px-2 text-foreground/70">{team.played}</td>
                <td className="text-center py-3 px-2 text-green-400 font-semibold">{team.won}</td>
                <td className="text-center py-3 px-2 text-yellow-400 font-semibold">{team.drawn}</td>
                <td className="text-center py-3 px-2 text-red-400 font-semibold">{team.lost}</td>

                {/* Points */}
                <td className="text-center py-3 px-2">
                  <div className="font-bold text-lg score-display">{team.points}</div>
                </td>

                {/* Form */}
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    {team.form?.map((f, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded border text-xs font-bold flex items-center justify-center ${getFormColor(f)}`}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
