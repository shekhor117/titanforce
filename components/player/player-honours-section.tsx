'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import PlayerHonoursService from '@/lib/player-honours-service'
import { Trophy, ArrowRight } from 'lucide-react'

interface PlayerHonoursSectionProps {
  playerId?: string
}

export function PlayerHonoursSection({ playerId }: PlayerHonoursSectionProps) {
  const params = useParams()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [stats, setStats] = useState({ total: 0, byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 } })
  const [loading, setLoading] = useState(true)

  const playerNum = params.number as string
  const effPlayerId = playerId

  useEffect(() => {
    const loadHonours = async () => {
      if (!effPlayerId) {
        setLoading(false)
        return
      }

      try {
        const honours = await PlayerHonoursService.getPlayerHonoursStats(effPlayerId)
        setStats(honours)
      } catch (error) {
        console.error('[v0] Error loading honours:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHonours()
  }, [effPlayerId])

  if (loading || stats.total === 0) {
    return null
  }

  const categoryLabels = {
    league: isBn ? 'লীগ' : 'League',
    cup: isBn ? 'কাপ' : 'Cup',
    championship: isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship',
    tournament: isBn ? 'টুর্নামেন্ট' : 'Tournament',
  }

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl border border-secondary/40">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className={`text-xl md:text-2xl font-bold text-foreground uppercase tracking-wider ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
            {isBn ? 'সম্মাননা' : 'Honours'}
          </h3>
        </div>
        <Link
          href={`/player/${playerNum}/honours`}
          className="text-primary hover:text-primary/80 transition flex items-center gap-1 text-sm font-semibold"
        >
          {isBn ? 'সব দেখুন' : 'View All'} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition text-center">
          <p className="text-sm text-foreground/70 mb-2">{isBn ? 'মোট' : 'Total'}</p>
          <p className="text-3xl font-black text-yellow-400">{stats.total}</p>
        </div>
        {Object.entries(stats.byCategory).map(([category, count]) => (
          <div
            key={category}
            className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 hover:border-primary/40 transition text-center"
          >
            <p className="text-sm text-foreground/70 mb-2">{categoryLabels[category as keyof typeof categoryLabels]}</p>
            <p className="text-2xl font-black text-primary">{count}</p>
          </div>
        ))}
      </div>

      <Link
        href={`/player/${playerNum}/honours`}
        className="text-primary hover:text-primary/80 transition text-sm font-semibold inline-block"
      >
        {isBn ? '→ সব সম্মাননা দেখুন' : '→ View all honours'}
      </Link>
    </div>
  )
}
