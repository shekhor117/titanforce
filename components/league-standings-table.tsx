"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface TeamStanding {
  rank: number
  team: string
  logo?: string
  played: number
  goalDiff: number
  points: number
  isCurrentTeam?: boolean
}

interface LeagueStandingsTableProps {
  title: string
  standings: TeamStanding[]
  viewAllLink?: string
}

export function LeagueStandingsTable({
  title,
  standings,
  viewAllLink = "/standings",
}: LeagueStandingsTableProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
            {title}
          </h2>
          <Link
            href={viewAllLink}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <span className="text-sm font-bold uppercase tracking-wider">View full table</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Team</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">P</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">GD</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr
                  key={team.rank}
                  className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${
                    team.isCurrentTeam ? "bg-primary/10" : ""
                  }`}
                >
                  <td className={`px-4 py-4 font-bold ${team.isCurrentTeam ? "text-primary" : "text-foreground"}`}>
                    {team.rank}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {team.logo && (
                        <Image
                          src={team.logo}
                          alt={team.team}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <span className={`text-sm font-semibold ${team.isCurrentTeam ? "text-primary font-bold" : "text-foreground"}`}>
                        {team.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-foreground">{team.played}</td>
                  <td className="px-4 py-4 text-center text-sm text-foreground">{team.goalDiff > 0 ? "+" : ""}{team.goalDiff}</td>
                  <td className={`px-4 py-4 text-center font-bold ${team.isCurrentTeam ? "text-primary text-lg" : "text-foreground"}`}>
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
