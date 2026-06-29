'use client'

import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface StatsTabProps {
  match: Match
}

const StatBar = ({ label, home, away, maxValue = 100 }: { label: string; home: number; away: number; maxValue?: number }) => {
  const homePercent = (home / maxValue) * 100
  const awayPercent = (away / maxValue) * 100

  return (
    <div className="py-4 border-b border-secondary/20 last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">{label}</div>
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-emerald-400 w-12 text-right">{home}</div>
        <div className="flex-1 flex gap-1">
          <div className="h-2 bg-secondary/30 rounded-full overflow-hidden flex-1">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${homePercent}%` }} />
          </div>
          <div className="h-2 bg-secondary/30 rounded-full overflow-hidden flex-1">
            <div className="h-full bg-indigo-500 ml-auto transition-all" style={{ width: `${awayPercent}%` }} />
          </div>
        </div>
        <div className="text-sm font-semibold text-indigo-400 w-12 text-left">{away}</div>
      </div>
    </div>
  )
}

export function StatsTab({ match }: StatsTabProps) {
  const { isBn } = useLanguage()

  const categories = [
    {
      title: isBn ? 'আক্রমণ' : 'Attack',
      stats: [
        { label: isBn ? 'গোল' : 'Goals', home: 3, away: 1 },
        { label: 'xG', home: 2.35, away: 1.08 },
        { label: isBn ? 'শট' : 'Shots', home: 18, away: 10 },
        { label: isBn ? 'লক্ষ্যে শট' : 'Shots on Target', home: 8, away: 4 },
        { label: isBn ? 'অবরুদ্ধ শট' : 'Blocked Shots', home: 3, away: 5 },
        { label: isBn ? 'বড় সুযোগ' : 'Big Chances', home: 5, away: 2 },
        { label: isBn ? 'মিস করা সুযোগ' : 'Big Chances Missed', home: 2, away: 1 },
      ]
    },
    {
      title: isBn ? 'পাস' : 'Passing',
      stats: [
        { label: isBn ? 'পাস' : 'Passes', home: 547, away: 421 },
        { label: isBn ? 'সঠিক পাস' : 'Accurate Passes', home: 498, away: 362 },
        { label: isBn ? 'লং বল' : 'Long Balls', home: 45, away: 38 },
        { label: isBn ? 'ক্রস' : 'Crosses', home: 22, away: 14 },
        { label: isBn ? 'থ্রু বল' : 'Through Balls', home: 8, away: 5 },
      ]
    },
    {
      title: isBn ? 'প্রতিরক্ষা' : 'Defence',
      stats: [
        { label: isBn ? 'ট্যাকেল' : 'Tackles', home: 24, away: 18 },
        { label: isBn ? 'ক্লিয়ারেন্স' : 'Clearances', home: 32, away: 28 },
        { label: isBn ? 'ইন্টারসেপশন' : 'Interceptions', home: 14, away: 11 },
        { label: isBn ? 'সেভ' : 'Saves', home: 4, away: 7 },
        { label: isBn ? 'পুনরুদ্ধার' : 'Recoveries', home: 38, away: 35 },
      ]
    },
    {
      title: isBn ? 'শৃঙ্খলা' : 'Discipline',
      stats: [
        { label: isBn ? 'ফাউল' : 'Fouls', home: 11, away: 15 },
        { label: isBn ? 'হলুদ কার্ড' : 'Yellow Cards', home: 2, away: 3 },
        { label: isBn ? 'লাল কার্ড' : 'Red Cards', home: 0, away: 0 },
        { label: isBn ? 'অফসাইড' : 'Offsides', home: 2, away: 1 },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {categories.map((category, idx) => (
        <div key={idx} className="neo-panel p-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
            {category.title}
          </h3>
          <div>
            {category.stats.map((stat, i) => (
              <StatBar
                key={i}
                label={stat.label}
                home={stat.home}
                away={stat.away}
                maxValue={Math.max(stat.home, stat.away) * 1.2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
