'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const standingsData = [
  {
    position: 1,
    team: 'Titan Force Mulikandi',
    played: 6,
    goalDifference: '+12',
    points: 16,
    highlighted: true
  },
  {
    position: 2,
    team: 'Greenfield FC',
    played: 6,
    goalDifference: '+6',
    points: 13,
  },
  {
    position: 3,
    team: 'Riverside United',
    played: 6,
    goalDifference: '+3',
    points: 10,
  },
  {
    position: 4,
    team: 'Blue Eagles',
    played: 6,
    goalDifference: '0',
    points: 8,
  },
  {
    position: 5,
    team: 'United Stars',
    played: 6,
    goalDifference: '-5',
    points: 6,
  },
]

export function HomeLeagueStandings() {
  return (
    <div className="rounded-xl border border-accent/20 bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-accent/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-accent rounded-full" />
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
            LEAGUE STANDINGS
          </h3>
        </div>
        <Link
          href="/league-standings"
          className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Header */}
          <thead className="border-b border-accent/10 bg-muted/30 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">TEAM</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">P</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">GD</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">PTS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {standingsData.map((row) => (
              <tr
                key={row.position}
                className={`border-b border-accent/10 transition-colors ${
                  row.highlighted
                    ? 'bg-primary/10 hover:bg-primary/20'
                    : 'hover:bg-muted/30'
                }`}
              >
                <td className={`px-4 py-4 font-bold ${row.highlighted ? 'text-accent' : 'text-foreground'}`}>
                  {row.position}
                </td>
                <td className={`px-4 py-4 font-semibold ${row.highlighted ? 'text-accent' : 'text-foreground'}`}>
                  {row.team}
                </td>
                <td className={`px-4 py-4 text-center ${row.highlighted ? 'text-accent' : 'text-muted-foreground'}`}>
                  {row.played}
                </td>
                <td className={`px-4 py-4 text-center ${row.highlighted ? 'text-accent' : 'text-muted-foreground'}`}>
                  {row.goalDifference}
                </td>
                <td className={`px-4 py-4 text-center font-bold ${row.highlighted ? 'text-accent' : 'text-foreground'}`}>
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-accent/10">
        <Link
          href="/league-standings"
          className="w-full text-center text-sm font-bold text-accent hover:text-primary uppercase tracking-wider transition-colors"
        >
          VIEW FULL TABLE
        </Link>
      </div>
    </div>
  )
}
