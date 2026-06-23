'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const standingsData = [
  {
    position: 1,
    team: 'Titan Force',
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
    <div className="group rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Local Championship
          </p>
          <h3 className="text-base font-bold text-foreground">
            Standings
          </h3>
        </div>
        <Link
          href="/league-standings"
          className="text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Header */}
          <thead className="border-b border-border/50 bg-muted/20">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-10">Pos</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Club</th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground w-12">P</th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground w-12">GD</th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground w-12">Pts</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {standingsData.map((row, index) => (
              <tr
                key={row.position}
                className={`border-b border-border/30 transition-colors last:border-0 ${
                  row.highlighted
                    ? 'bg-accent/5 hover:bg-accent/10'
                    : 'hover:bg-muted/20'
                }`}
              >
                <td className="px-4 py-3">
                  <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                    row.highlighted ? 'bg-accent text-white' : 'text-muted-foreground'
                  }`}>
                    {row.position}
                  </div>
                </td>
                <td className={`px-4 py-3 font-semibold text-sm ${row.highlighted ? 'text-foreground' : 'text-foreground/90'}`}>
                  {row.team}
                </td>
                <td className="px-2 py-3 text-center text-sm text-muted-foreground font-medium">
                  {row.played}
                </td>
                <td className={`px-2 py-3 text-center text-sm font-medium ${
                  row.goalDifference.startsWith('+') ? 'text-green-500' : 
                  row.goalDifference.startsWith('-') ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {row.goalDifference}
                </td>
                <td className={`px-2 py-3 text-center text-sm font-bold ${row.highlighted ? 'text-accent' : 'text-foreground'}`}>
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-border/50 bg-muted/10">
        <Link
          href="/league-standings"
          className="w-full text-center text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          View Full Table
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
