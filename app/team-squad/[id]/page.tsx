'use client'

import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { usePlayers } from '@/lib/use-data-store'
import { ArrowLeft, Trophy, Target, Heart, Zap } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { useState, useEffect } from 'react'

export default function PlayerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const playerId = params.id as string
  const { players } = usePlayers()
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const player = players.find(p => p.id === playerId)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Player Not Found</h1>
            <p className="text-foreground/60 mb-6">The player you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Determine category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GK':
        return 'bg-yellow-600'
      case 'DEF':
        return 'bg-blue-600'
      case 'MID':
        return 'bg-green-600'
      case 'FWD':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  // Stats for display
  const stats = [
    { label: isBn ? 'লক্ষ্য' : 'Goals', value: player.goals, icon: Target },
    { label: isBn ? 'সহায়তা' : 'Assists', value: player.assists, icon: Heart },
    { label: isBn ? 'ম্যাচ' : 'Appearances', value: player.appearances || 0, icon: Trophy },
    { label: isBn ? 'রেটিং' : 'Avg Rating', value: (player.average_rating || 0).toFixed(1), icon: Zap },
  ]

  // Attributes for radar/display
  const attributes = [
    { label: 'Pace', value: player.pace || 0 },
    { label: 'Shooting', value: player.shooting || 0 },
    { label: 'Passing', value: player.passing || 0 },
    { label: 'Dribbling', value: player.dribbling || 0 },
    { label: 'Defending', value: player.defending || 0 },
    { label: 'Physical', value: player.physical || 0 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-red-900/20 via-black to-black">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider font-semibold">
                {isBn ? 'পিছনে' : 'Back'}
              </span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Player Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-600/0 rounded-2xl blur-2xl" />
                  <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden border-2 border-red-500/30">
                    {player.image_url ? (
                      <Image
                        src={player.image_url}
                        alt={player.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-900/40 to-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl text-red-500/20 font-bold mb-2">👤</div>
                          <p className="text-white/30">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Jersey Number Badge */}
                  <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-red-600">
                    <span className="text-3xl font-bold text-red-600">{player.num}</span>
                  </div>
                </div>
              </div>

              {/* Player Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="flex items-center gap-3">
                  <span className={`${getCategoryColor(player.category)} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                    {player.category}
                  </span>
                  <span className="text-foreground/60">{player.position}</span>
                </div>

                {/* Name */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                    {player.name}
                  </h1>
                  <p className="text-lg text-foreground/70">
                    {player.full_name}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                      <div key={idx} className="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-foreground/70">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Bio */}
                {player.bio && (
                  <div className="bg-black/50 border border-red-500/20 rounded-lg p-4">
                    <p className="text-foreground/80">{player.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Stats Section */}
        <section className="py-16 px-4 bg-black/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isBn ? 'পরিসংখ্যান' : 'Statistics'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Stats */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-6">Match Performance</h3>
                {[
                  { label: 'Appearances', value: player.appearances || 0 },
                  { label: 'Minutes Played', value: player.minutes_played || 0 },
                  { label: 'Goals', value: player.goals },
                  { label: 'Assists', value: player.assists },
                  { label: 'Pass Accuracy', value: `${player.pass_accuracy || 0}%` },
                  { label: 'Clean Sheets', value: player.clean_sheets || 0 },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-red-600/5 border border-red-500/10 rounded-lg p-4">
                    <span className="text-foreground/70">{stat.label}</span>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Attributes */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-6">Attributes</h3>
                {attributes.map((attr, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">{attr.label}</span>
                      <span className="text-white font-bold">{attr.value}</span>
                    </div>
                    <div className="w-full h-2 bg-red-600/10 rounded-full overflow-hidden border border-red-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
                        style={{ width: `${Math.min(attr.value / 100 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Age', value: player.age || 'N/A' },
                { label: 'Date of Birth', value: player.date_of_birth || 'N/A' },
                { label: 'Nationality', value: player.nationality || 'N/A' },
                { label: 'Hometown', value: player.hometown || 'N/A' },
                { label: 'Preferred Foot', value: player.foot || 'N/A' },
                { label: 'Status', value: player.status },
              ].map((info, idx) => (
                <div key={idx} className="bg-red-600/5 border border-red-500/10 rounded-lg p-6">
                  <p className="text-sm text-foreground/60 mb-2">{info.label}</p>
                  <p className="text-lg font-bold text-white">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
