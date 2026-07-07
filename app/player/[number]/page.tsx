'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { PlayerProfileHero } from '@/components/player/player-profile-hero'
import { PlayerAttributesChart } from '@/components/player/player-attributes-chart'
import { PlayerCareerStats } from '@/components/player/player-career-stats'
import { PlayerPositionDiagram } from '@/components/player/player-position-diagram'
import { useEffect, useState } from 'react'
import { getDataService } from '@/lib/data-service'
import type { Player } from '@/lib/data-service'

export default function PlayerProfile() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const playerNum = parseInt(params.number as string)

  useEffect(() => {
    setMounted(true)
    try {
      const adminData = localStorage.getItem('titanforce_admin')
      if (adminData) {
        const admin = JSON.parse(adminData)
        setIsAdmin(admin.role === 'admin')
      }
    } catch {
      // Silent fail
    }
  }, [])

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!mounted) return
      try {
        setLoading(true)
        const service = getDataService()
        const players = await service.getPlayers()
        const foundPlayer = players.find(p => p.num === playerNum)
        setPlayer(foundPlayer)
      } catch (err) {
        console.error('[v0] Error fetching player:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [playerNum, mounted])

  if (!mounted || loading) {
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
          <h1 className="text-3xl font-bold mb-4">{isBn ? 'খেলোয়াড় পাওয়া যায়নি' : 'Player Not Found'}</h1>
          <Link href="/team-squad" className="text-primary">{isBn ? 'দলে ফিরে যান' : 'Go Back'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'পিছনে' : 'Back'}</span>
          </button>
          
          {isAdmin && (
            <Link
              href={`/admin/players/${player.num}/edit`}
              className="flex items-center gap-2 px-4 py-2 rounded bg-primary/20 text-primary text-sm font-semibold hover:bg-primary/30 transition"
            >
              <Edit className="w-4 h-4" />
              <span>{isBn ? 'সম্পাদনা করুন' : 'Edit'}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Professional Hero Section */}
        <PlayerProfileHero player={player} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-3 border-b border-secondary pb-4">
          {[
            { id: 'overview', label: isBn ? 'সংক্ষিপ্তি' : 'Overview' },
            { id: 'stats', label: isBn ? 'পরিসংখ্যান' : 'Statistics' },
            { id: 'skills', label: isBn ? 'দক্ষতা' : 'Skills' },
            { id: 'position', label: isBn ? 'অবস্থান' : 'Position' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-secondary/30 text-foreground hover:bg-secondary/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="neo-card p-6 md:p-8 rounded-2xl border border-secondary/40">
              <h3 className={`text-xl md:text-2xl font-bold mb-6 text-foreground uppercase tracking-wider ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                {isBn ? 'তথ্য' : 'Information'}
              </h3>
              <div className="space-y-4">
                {[
                  ['Full Name', player.full_name],
                  ['Position', player.position],
                  ['Jersey', `#${player.num}`],
                  ['Age', player.age?.toString() || 'N/A'],
                  ['Hometown', player.hometown || 'Bangladesh'],
                  ['Status', player.status || 'Active'],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between border-b border-secondary/30 pb-3">
                    <span className="text-foreground/70 font-medium">{label}</span>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="neo-card p-6 md:p-8 rounded-2xl border border-secondary/40">
                <h3 className={`text-xl md:text-2xl font-bold mb-4 text-foreground uppercase tracking-wider ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                  {isBn ? 'জীবনী' : 'Biography'}
                </h3>
                <p className="text-foreground/85 leading-relaxed">{player.bio || 'No bio available.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <PlayerCareerStats player={player} />
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <PlayerAttributesChart player={player} />
        )}

        {/* Position Tab */}
        {activeTab === 'position' && (
          <PlayerPositionDiagram player={player} />
        )}
      </div>
    </div>
  )
}
