'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Standing {
  id: string
  position: number
  team_name: string
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
  is_highlighted: boolean
}

export function HomeLeagueStandings() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const response = await fetch('/api/standings')
        if (response.ok) {
          const data = await response.json()
          setStandings(data.sort((a: Standing, b: Standing) => a.position - b.position))
        }
      } catch (error) {
        // Silently handle errors - standings table may not exist yet
        console.debug('[v0] Error loading standings:', error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    loadStandings()
  }, [])

  if (loading) {
    return (
      <div className="neo-card overflow-hidden h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="neo-card overflow-hidden h-full flex flex-col">
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
            {standings.length > 0 ? (
              standings.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-accent/10 transition-colors ${
                    row.is_highlighted
                      ? 'bg-primary/10 hover:bg-primary/20'
                      : 'hover:bg-muted/30'
                  }`}
                >
                  <td className={`px-4 py-4 font-bold ${row.is_highlighted ? 'text-accent' : 'text-foreground'}`}>
                    {row.position}
                  </td>
                  <td className={`px-4 py-4 font-semibold ${row.is_highlighted ? 'text-accent' : 'text-foreground'}`}>
                    {row.team_name}
                  </td>
                  <td className={`px-4 py-4 text-center ${row.is_highlighted ? 'text-accent' : 'text-muted-foreground'}`}>
                    {row.played}
                  </td>
                  <td className={`px-4 py-4 text-center ${row.is_highlighted ? 'text-accent' : 'text-muted-foreground'}`}>
                    {row.goal_difference >= 0 ? '+' : ''}{row.goal_difference}
                  </td>
                  <td className={`px-4 py-4 text-center font-bold ${row.is_highlighted ? 'text-accent' : 'text-foreground'}`}>
                    {row.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No standings data available
                </td>
              </tr>
            )}
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
