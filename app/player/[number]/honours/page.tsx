'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { getDataService } from '@/lib/data-service'
import PlayerHonoursService from '@/lib/player-honours-service'
import { ArrowLeft, Trophy, Award, Star } from 'lucide-react'
import type { Player } from '@/lib/data-service'
import type { Honour } from '@/lib/honour-data-service'

export default function PlayerHonoursPage({ params }: { params: { number: string } }) {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [player, setPlayer] = useState<Player | null>(null)
  const [honours, setHonours] = useState<Honour[]>([])
  const [stats, setStats] = useState({ total: 0, byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 } })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const playerNum = parseInt(params.number)
        const dataService = getDataService()
        const playerData = await dataService.getPlayers()
        const foundPlayer = playerData.find(p => p.num === playerNum)

        if (foundPlayer) {
          setPlayer(foundPlayer)
          const playerHonours = await PlayerHonoursService.getPlayerHonours(foundPlayer.id)
          const playerStats = await PlayerHonoursService.getPlayerHonoursStats(foundPlayer.id)
          setHonours(playerHonours)
          setStats(playerStats)
        }
      } catch (error) {
        console.error('[v0] Error loading player honours:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.number])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isBn ? 'খেলোয়াড় পাওয়া যায়নি' : 'Player not found'}</h1>
          <Link href="/squad" className="text-primary hover:text-primary/80">
            {isBn ? 'দলে ফিরে যান' : 'Back to squad'}
          </Link>
        </div>
      </div>
    )
  }

  const categoryLabels = {
    league: isBn ? 'লীগ' : 'League',
    cup: isBn ? 'কাপ' : 'Cup',
    championship: isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship',
    tournament: isBn ? 'টুর্নামেন্ট' : 'Tournament',
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      league: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      cup: 'text-green-400 bg-green-500/10 border-green-500/30',
      championship: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      tournament: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    }
    return colors[category] || colors.league
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link
            href={`/player/${player.num}`}
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{player.full_name}</h1>
            <p className="text-sm text-foreground/60">{isBn ? '#{player.num} - সম্মাননা' : `#${player.num} - Honours`}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="neo-card p-4 md:p-6 rounded-2xl">
            <p className="text-foreground/60 text-xs md:text-sm mb-2">{isBn ? 'মোট' : 'Total'}</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-400">{stats.total}</p>
          </div>
          <div className="neo-card p-4 md:p-6 rounded-2xl">
            <p className="text-foreground/60 text-xs md:text-sm mb-2">{isBn ? 'লীগ' : 'League'}</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{stats.byCategory.league}</p>
          </div>
          <div className="neo-card p-4 md:p-6 rounded-2xl">
            <p className="text-foreground/60 text-xs md:text-sm mb-2">{isBn ? 'কাপ' : 'Cup'}</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">{stats.byCategory.cup}</p>
          </div>
          <div className="neo-card p-4 md:p-6 rounded-2xl">
            <p className="text-foreground/60 text-xs md:text-sm mb-2">{isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship'}</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-400">{stats.byCategory.championship}</p>
          </div>
          <div className="neo-card p-4 md:p-6 rounded-2xl">
            <p className="text-foreground/60 text-xs md:text-sm mb-2">{isBn ? 'টুর্নামেন্ট' : 'Tournament'}</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-400">{stats.byCategory.tournament}</p>
          </div>
        </div>

        {/* Honours Grid */}
        {honours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {honours.map(honour => (
              <div
                key={honour.id}
                className="neo-card p-6 rounded-2xl border border-secondary/40 hover:border-secondary/60 transition group"
              >
                {/* Icon and Featured Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{honour.icon}</div>
                  {honour.featured && (
                    <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
                      <Star className="w-3 h-3" />
                      {isBn ? 'বৈশিষ্ট্য' : 'Featured'}
                    </div>
                  )}
                </div>

                {/* Honour Info */}
                <h3 className="text-lg font-bold mb-2">{honour.name}</h3>

                {/* Category Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${getCategoryColor(honour.category)}`}>
                  {categoryLabels[honour.category as keyof typeof categoryLabels]}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">{isBn ? 'বছর' : 'Year'}</span>
                    <span className="font-semibold">{honour.year}</span>
                  </div>
                  {honour.runners_up && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">{isBn ? 'রানার্স-আপ' : 'Runners-up'}</span>
                      <span className="font-semibold">{honour.runners_up}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {honour.description && (
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                    {honour.description}
                  </p>
                )}

                {/* View Button */}
                <Link
                  href={`/admin/honours`}
                  className="inline-block text-primary hover:text-primary/80 transition text-sm font-semibold"
                >
                  {isBn ? 'বিবরণ দেখুন' : 'View Details'} →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-lg text-foreground/60 mb-4">
              {isBn ? 'এখনও কোনো সম্মাননা নেই' : 'No honours awarded yet'}
            </p>
            <Link
              href={`/player/${player.num}`}
              className="text-primary hover:text-primary/80 font-semibold"
            >
              {isBn ? 'প্রোফাইলে ফিরে যান' : 'Back to profile'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
