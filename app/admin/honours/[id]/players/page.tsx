'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import HonourDataService, { Honour } from '@/lib/honour-data-service'
import PlayerHonoursService from '@/lib/player-honours-service'
import { getDataService } from '@/lib/data-service'
import { ArrowLeft, X, Plus, Check } from 'lucide-react'
import type { Player } from '@/lib/data-service'

export default function HonourPlayersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const [honour, setHonour] = useState<Honour | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [assignedPlayers, setAssignedPlayers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load honour
      const honours = await HonourDataService.getHonours()
      const foundHonour = honours.find(h => h.id === params.id)
      setHonour(foundHonour || null)

      // Load all players
      const dataService = getDataService()
      const players = await dataService.getPlayers()
      setAllPlayers(players)

      // Load assigned players
      if (foundHonour) {
        const assigned = await PlayerHonoursService.getPlayersWithHonour(params.id)
        setAssignedPlayers(assigned.map(p => p.id))
      }
    } catch (error) {
      console.error('[v0] Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignPlayer = async (playerId: string) => {
    try {
      await PlayerHonoursService.addHonourToPlayer(playerId, params.id)
      setAssignedPlayers([...assignedPlayers, playerId])
    } catch (error) {
      console.error('[v0] Error assigning player:', error)
      alert(isBn ? 'খেলোয়াড় নির্ধারণ ব্যর্থ' : 'Failed to assign player')
    }
  }

  const handleUnassignPlayer = async (playerId: string) => {
    try {
      await PlayerHonoursService.removeHonourFromPlayer(playerId, params.id)
      setAssignedPlayers(assignedPlayers.filter(id => id !== playerId))
    } catch (error) {
      console.error('[v0] Error unassigning player:', error)
      alert(isBn ? 'খেলোয়াড় সরানো ব্যর্থ' : 'Failed to unassign player')
    }
  }

  const filteredPlayers = allPlayers.filter(p =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.num.toString().includes(searchTerm) ||
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!honour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isBn ? 'সম্মাননা পাওয়া যায়নি' : 'Honour not found'}</h1>
          <Link href="/admin/honours" className="text-primary hover:text-primary/80">
            {isBn ? 'সম্মাননায় ফিরুন' : 'Back to honours'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{honour.name}</h1>
            <p className="text-sm text-foreground/60">
              {isBn ? 'খেলোয়াড় ব্যবস্থাপনা' : 'Manage Players'} - {assignedPlayers.length} {isBn ? 'নির্ধারিত' : 'Assigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={isBn ? 'খেলোয়াড়ের নাম বা নম্বর খুঁজুন...' : 'Search by player name or number...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Players */}
          <div>
            <h2 className="text-xl font-bold mb-4">{isBn ? 'উপলব্ধ খেলোয়াড়' : 'Available Players'}</h2>
            <div className="neo-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-secondary">
                {filteredPlayers
                  .filter(p => !assignedPlayers.includes(p.id))
                  .map(player => (
                    <div key={player.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition">
                      <div>
                        <p className="font-semibold">#{player.num} {player.full_name}</p>
                        <p className="text-xs text-foreground/60">{player.position}</p>
                      </div>
                      <button
                        onClick={() => handleAssignPlayer(player.id)}
                        className="p-2 bg-primary/20 text-primary rounded hover:bg-primary/40 transition"
                        title={isBn ? 'নির্ধারণ করুন' : 'Assign'}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                {filteredPlayers.filter(p => !assignedPlayers.includes(p.id)).length === 0 && (
                  <div className="p-8 text-center text-foreground/60">
                    {isBn ? 'কোনো উপলব্ধ খেলোয়াড় নেই' : 'No available players'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Players */}
          <div>
            <h2 className="text-xl font-bold mb-4">{isBn ? 'নির্ধারিত খেলোয়াড়' : 'Assigned Players'}</h2>
            <div className="neo-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-secondary">
                {allPlayers
                  .filter(p => assignedPlayers.includes(p.id))
                  .map(player => (
                    <div key={player.id} className="p-4 flex items-center justify-between bg-primary/5 hover:bg-primary/10 transition">
                      <div>
                        <p className="font-semibold">#{player.num} {player.full_name}</p>
                        <p className="text-xs text-foreground/60">{player.position}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <button
                          onClick={() => handleUnassignPlayer(player.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition"
                          title={isBn ? 'সরান' : 'Remove'}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                {allPlayers.filter(p => assignedPlayers.includes(p.id)).length === 0 && (
                  <div className="p-8 text-center text-foreground/60">
                    {isBn ? 'কোনো খেলোয়াড় নির্ধারিত নেই' : 'No players assigned'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/admin/honours"
            className="inline-block neo-btn bg-secondary/30 text-foreground px-6 py-3 rounded-lg hover:bg-secondary/60 transition"
          >
            {isBn ? 'সম্মাননায় ফিরুন' : 'Back to honours'}
          </Link>
        </div>
      </div>
    </div>
  )
}
