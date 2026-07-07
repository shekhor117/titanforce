'use client'

import { useLanguage } from '@/lib/language-context'
import { Trophy } from 'lucide-react'

interface Honour {
  title: string
  count: number
}

interface PlayerHonoursSectionProps {
  honours?: Honour[]
}

const DEFAULT_HONOURS: Honour[] = [
  { title: 'Premier League', count: 0 },
  { title: 'FA Cup', count: 0 },
  { title: 'League Cup', count: 0 },
  { title: 'Champions League', count: 0 },
  { title: 'Europa League', count: 0 },
  { title: 'Bundesliga', count: 0 },
]

export function PlayerHonoursSection({ honours = DEFAULT_HONOURS }: PlayerHonoursSectionProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const totalHonours = honours.reduce((sum, h) => sum + h.count, 0)

  if (totalHonours === 0) {
    return null
  }

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl border border-secondary/40">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className={`text-xl md:text-2xl font-bold text-foreground uppercase tracking-wider ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
          {isBn ? 'সম্মাননা' : 'Honours'}
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {honours.map((honour) => (
          <div
            key={honour.title}
            className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition"
          >
            <p className="text-sm text-foreground/70 mb-2">{honour.title}</p>
            <p className="text-3xl font-black text-yellow-400">{honour.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-secondary/30">
        <p className="text-sm text-foreground/60">
          {isBn ? 'মোট সম্মাননা' : 'Total Honours'}: <span className="font-bold text-foreground">{totalHonours}</span>
        </p>
      </div>
    </div>
  )
}
