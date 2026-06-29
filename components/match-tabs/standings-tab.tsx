'use client'

import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface StandingsTabProps {
  match: Match
}

interface StandingsEntry {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  isHighlighted?: boolean
}

export function StandingsTab({ match }: StandingsTabProps) {
  const { isBn } = useLanguage()

  // Mock Premier League standings
  const standings: StandingsEntry[] = [
    { position: 1, team: 'Liverpool', played: 30, won: 22, drawn: 2, lost: 6, goalsFor: 68, goalsAgainst: 28, goalDifference: 40, points: 68, isHighlighted: true },
    { position: 2, team: 'Arsenal', played: 30, won: 21, drawn: 3, lost: 6, goalsFor: 64, goalsAgainst: 32, goalDifference: 32, points: 66 },
    { position: 3, team: 'Manchester City', played: 29, won: 20, drawn: 2, lost: 7, goalsFor: 58, goalsAgainst: 31, goalDifference: 27, points: 62, isHighlighted: true },
    { position: 4, team: 'Chelsea', played: 30, won: 18, drawn: 4, lost: 8, goalsFor: 54, goalsAgainst: 38, goalDifference: 16, points: 58 },
    { position: 5, team: 'Manchester United', played: 30, won: 16, drawn: 5, lost: 9, goalsFor: 48, goalsAgainst: 34, goalDifference: 14, points: 53 },
    { position: 6, team: 'Brighton', played: 30, won: 15, drawn: 6, lost: 9, goalsFor: 46, goalsAgainst: 38, goalDifference: 8, points: 51 },
    { position: 7, team: 'Tottenham', played: 30, won: 14, drawn: 4, lost: 12, goalsFor: 52, goalsAgainst: 46, goalDifference: 6, points: 46 },
    { position: 8, team: 'Aston Villa', played: 30, won: 13, drawn: 5, lost: 12, goalsFor: 42, goalsAgainst: 44, goalDifference: -2, points: 44 },
  ]

  return (
    <div className="space-y-6">
      <div className="neo-panel p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-secondary/30">
              <th className="text-left py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">#</th>
              <th className="text-left py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'দল' : 'Team'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'খে' : 'P'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'জ' : 'W'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'ড' : 'D'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'হ' : 'L'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'গ-বি' : 'GD'}</th>
              <th className="text-center py-3 px-3 text-xs uppercase tracking-wider font-semibold text-foreground/60">{isBn ? 'পয়েন্ট' : 'Pts'}</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry) => (
              <tr
                key={entry.position}
                className={`border-b border-secondary/20 last:border-b-0 transition-colors ${
                  entry.isHighlighted ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary/20'
                }`}
              >
                <td className="py-3 px-3 font-semibold text-foreground/70">{entry.position}</td>
                <td className="py-3 px-3 font-semibold text-foreground">{entry.team}</td>
                <td className="py-3 px-3 text-center text-foreground/70">{entry.played}</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-semibold">{entry.won}</td>
                <td className="py-3 px-3 text-center text-yellow-400 font-semibold">{entry.drawn}</td>
                <td className="py-3 px-3 text-center text-rose-400 font-semibold">{entry.lost}</td>
                <td className="py-3 px-3 text-center text-foreground/70 font-medium">
                  {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                </td>
                <td className="py-3 px-3 text-center font-bold text-primary text-lg">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="neo-panel p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-foreground/70">{isBn ? 'জয়' : 'Win'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-foreground/70">{isBn ? 'ড্র' : 'Draw'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="text-foreground/70">{isBn ? 'পরাজয়' : 'Loss'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 rounded" />
            <span className="text-foreground/70">{isBn ? 'হাইলাইট' : 'Highlighted'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
