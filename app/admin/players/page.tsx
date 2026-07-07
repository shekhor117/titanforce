'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Eye } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getDataService } from '@/lib/data-service'
import type { Player } from '@/lib/data-service'

export default function AdminPlayersPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPosition, setFilterPosition] = useState<string>('all')

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const service = getDataService()
        const data = await service.getPlayers()
        setPlayers(data)
      } catch (error) {
        console.error('[v0] Error fetching players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.num.toString().includes(searchTerm)
    const matchesFilter = filterPosition === 'all' || player.position === filterPosition
    return matchesSearch && matchesFilter
  })

  const positions = [...new Set(players.map(p => p.position))].sort()
  const stats = {
    total: players.length,
    goals: players.reduce((sum, p) => sum + (p.goals || 0), 0),
    assists: players.reduce((sum, p) => sum + (p.assists || 0), 0),
    totalAppearances: players.reduce((sum, p) => sum + (p.appearances || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin"
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
          </Link>
          <h1 className="text-2xl font-bold">{isBn ? 'খেলোয়াড় ব্যবস্থাপনা' : 'Manage Players'}</h1>
          <div></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="neo-card p-6 rounded-2xl">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? 'মোট খেলোয়াড়' : 'Total Players'}</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="neo-card p-6 rounded-2xl">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? 'মোট গোল' : 'Total Goals'}</p>
            <p className="text-3xl font-bold text-green-400">{stats.goals}</p>
          </div>
          <div className="neo-card p-6 rounded-2xl">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? 'মোট সহায়তা' : 'Total Assists'}</p>
            <p className="text-3xl font-bold text-blue-400">{stats.assists}</p>
          </div>
          <div className="neo-card p-6 rounded-2xl">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? 'ম্যাচ সংখ্যা' : 'Appearances'}</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalAppearances}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={isBn ? 'খেলোয়াড়ের নাম বা অবস্থান খুঁজুন...' : 'Search players by name or position...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
          />
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="all">{isBn ? 'সমস্ত অবস্থান' : 'All Positions'}</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* Players Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="neo-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30 border-b border-secondary">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground/80">#</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground/80">{isBn ? 'নাম' : 'Name'}</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground/80">{isBn ? 'অবস্থান' : 'Position'}</th>
                    <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-foreground/80">{isBn ? 'গোল' : 'Goals'}</th>
                    <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-foreground/80">{isBn ? 'সহায়তা' : 'Assists'}</th>
                    <th className="hidden md:table-cell px-4 md:px-6 py-4 text-center text-sm font-semibold text-foreground/80">{isBn ? 'ম্যাচ' : 'Apps'}</th>
                    <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-center text-sm font-semibold text-foreground/80">{isBn ? 'রেটিং' : 'Rating'}</th>
                    <th className="px-4 md:px-6 py-4 text-right text-sm font-semibold text-foreground/80">{isBn ? 'পদক্ষেপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-secondary/30 hover:bg-secondary/20 transition"
                    >
                      <td className="px-4 md:px-6 py-4 font-bold text-primary">#{player.num}</td>
                      <td className="px-4 md:px-6 py-4 font-semibold">{player.full_name}</td>
                      <td className="px-4 md:px-6 py-4 text-foreground/80">{player.position}</td>
                      <td className="px-4 md:px-6 py-4 text-center text-green-400 font-bold">{player.goals || 0}</td>
                      <td className="px-4 md:px-6 py-4 text-center text-blue-400 font-bold">{player.assists || 0}</td>
                      <td className="hidden md:table-cell px-4 md:px-6 py-4 text-center text-foreground/80">{player.appearances || 0}</td>
                      <td className="hidden lg:table-cell px-4 md:px-6 py-4 text-center text-yellow-400 font-bold">{player.average_rating?.toFixed(1) || 'N/A'}</td>
                      <td className="px-4 md:px-6 py-4 flex justify-end gap-2">
                        <Link
                          href={`/player/${player.num}`}
                          className="p-2 bg-secondary/30 text-foreground rounded hover:bg-secondary/60 transition"
                          title={isBn ? 'দেখুন' : 'View'}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/players/${player.num}/edit`}
                          className="p-2 bg-primary/20 text-primary rounded hover:bg-primary/40 transition"
                          title={isBn ? 'সম্পাদনা করুন' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPlayers.length === 0 && (
              <div className="p-8 text-center text-foreground/60">
                {isBn ? 'কোনো খেলোয়াড় পাওয়া যায়নি' : 'No players found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
