'use client'

import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface OverviewTabProps {
  match: Match
}

export function OverviewTab({ match }: OverviewTabProps) {
  const { isBn } = useLanguage()

  // Mock momentum data (90 minutes of possession shifts)
  const momentumData = Array.from({ length: 90 }, (_, i) => ({
    minute: i + 1,
    home: 45 + Math.sin(i / 15) * 15 + Math.random() * 10,
    away: 55 - Math.sin(i / 15) * 15 - Math.random() * 10,
  }))

  // Win probability data
  const winProb = [
    { name: match.home, value: 58, color: '#10b981' },
    { name: 'Draw', value: 20, color: '#f59e0b' },
    { name: match.away, value: 22, color: '#6366f1' },
  ]

  // Stats grid
  const stats = [
    { label: isBn ? 'দখল' : 'Possession', home: '62%', away: '38%' },
    { label: isBn ? 'শট' : 'Shots', home: '18', away: '10' },
    { label: isBn ? 'লক্ষ্যে শট' : 'Shots on Target', home: '8', away: '4' },
    { label: isBn ? 'বড় সুযোগ' : 'Big Chances', home: '5', away: '2' },
    { label: isBn ? 'কর্নার' : 'Corners', home: '9', away: '3' },
    { label: isBn ? 'অফসাইড' : 'Offsides', home: '2', away: '1' },
    { label: isBn ? 'ফাউল' : 'Fouls', home: '11', away: '15' },
    { label: isBn ? 'হলুদ কার্ড' : 'Yellow Cards', home: '2', away: '3' },
  ]

  return (
    <div className="space-y-6">
      {/* Match Momentum */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {isBn ? 'ম্যাচ গতিবেগ' : 'Match Momentum'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={momentumData}>
            <defs>
              <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAway" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="minute" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="home" stroke="#10b981" fillOpacity={1} fill="url(#colorHome)" name={match.home} />
            <Area type="monotone" dataKey="away" stroke="#6366f1" fillOpacity={1} fill="url(#colorAway)" name={match.away} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Win Probability */}
        <div className="neo-panel p-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
            {isBn ? 'জয়ের সম্ভাবনা' : 'Win Probability'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={winProb}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {winProb.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* xG Stats */}
        <div className="neo-panel p-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
            {isBn ? 'প্রত্যাশিত গোল (xG)' : 'Expected Goals (xG)'}
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-emerald-400">{match.home}</span>
                <span className="text-2xl font-bold text-foreground">2.35</span>
              </div>
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-indigo-400">{match.away}</span>
                <span className="text-2xl font-bold text-foreground">1.08</span>
              </div>
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 ml-auto" style={{ width: '35%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {isBn ? 'মূল পরিসংখ্যান' : 'Key Statistics'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/20">
              <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">{stat.label}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-emerald-400">{stat.home}</div>
                <div className="text-lg font-bold text-indigo-400">{stat.away}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
