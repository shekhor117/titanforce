'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface H2HTabProps {
  match: Match
}

interface H2HMatch {
  date: string
  home: string
  away: string
  score: string
  result: 'home' | 'away' | 'draw'
}

export function H2HTab({ match }: H2HTabProps) {
  const { isBn } = useLanguage()

  // Mock H2H history
  const h2hMatches: H2HMatch[] = [
    { date: '2024-01-14', home: 'Liverpool', away: 'Manchester City', score: '3-1', result: 'home' },
    { date: '2023-10-29', home: 'Manchester City', away: 'Liverpool', score: '1-1', result: 'draw' },
    { date: '2023-05-28', home: 'Manchester City', away: 'Liverpool', score: '0-0', result: 'draw' },
    { date: '2022-10-16', home: 'Liverpool', away: 'Manchester City', score: '1-0', result: 'home' },
    { date: '2022-04-10', home: 'Manchester City', away: 'Liverpool', score: '2-2', result: 'draw' },
    { date: '2021-11-21', home: 'Liverpool', away: 'Manchester City', score: '2-2', result: 'draw' },
    { date: '2021-07-04', home: 'Manchester City', away: 'Liverpool', score: '1-0', result: 'home' },
    { date: '2021-04-10', home: 'Liverpool', away: 'Manchester City', score: '1-1', result: 'draw' },
    { date: '2020-11-08', home: 'Manchester City', away: 'Liverpool', score: '1-1', result: 'draw' },
    { date: '2020-07-02', home: 'Liverpool', away: 'Manchester City', score: '4-0', result: 'home' },
  ]

  // Stats
  const homeStats = h2hMatches.filter(m => m.result === 'home').length
  const awayStats = h2hMatches.filter(m => m.result === 'away').length
  const draws = h2hMatches.filter(m => m.result === 'draw').length

  // Chart data
  const chartData = [
    {
      name: isBn ? 'ম্যাচ' : 'Match',
      [match.home]: homeStats,
      [match.away]: awayStats,
      'Draw': draws,
    }
  ]

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="neo-panel p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{homeStats}</div>
          <div className="text-xs uppercase tracking-wider text-foreground/60">{isBn ? 'জয়' : 'Wins'}</div>
          <div className="text-sm font-semibold text-foreground mt-2">{match.home}</div>
        </div>
        <div className="neo-panel p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{draws}</div>
          <div className="text-xs uppercase tracking-wider text-foreground/60">{isBn ? 'ড্র' : 'Draws'}</div>
        </div>
        <div className="neo-panel p-6 text-center">
          <div className="text-3xl font-bold text-indigo-400 mb-2">{awayStats}</div>
          <div className="text-xs uppercase tracking-wider text-foreground/60">{isBn ? 'জয়' : 'Wins'}</div>
          <div className="text-sm font-semibold text-foreground mt-2">{match.away}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {isBn ? 'মাথার হিসাব' : 'Head to Head Record'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey={match.home} fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Draw" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey={match.away} fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Matches */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {isBn ? 'সাম্প্রতিক ম্যাচ' : 'Recent Matches'}
        </h3>
        <div className="space-y-3">
          {h2hMatches.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="text-xs text-foreground/60">{m.date}</div>
              <div className="flex-1 flex items-center justify-center gap-4 mx-4">
                <div className="text-sm font-semibold text-foreground">{m.home}</div>
                <div className="font-bold text-primary text-lg">{m.score}</div>
                <div className="text-sm font-semibold text-foreground">{m.away}</div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  m.result === 'home' || m.result === 'away'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {m.result === 'draw' ? 'Draw' : m.result === 'home' ? match.home : match.away}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
