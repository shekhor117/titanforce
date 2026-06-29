'use client'

import { Star } from 'lucide-react'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayersTabProps {
  match: Match
}

interface PlayerRating {
  name: string
  number: number
  rating: number
  goals?: number
  assists?: number
  passAccuracy?: number
  chances?: number
}

export function PlayersTab({ match }: PlayersTabProps) {
  const { isBn } = useLanguage()

  // Mock player ratings
  const homeRatings: PlayerRating[] = [
    { name: 'Mohamed Salah', number: 10, rating: 8.8, goals: 2, assists: 1, passAccuracy: 92, chances: 6 },
    { name: 'Luis Díaz', number: 7, rating: 8.2, goals: 1, assists: 0, passAccuracy: 88, chances: 4 },
    { name: 'Darwin Núñez', number: 9, rating: 7.9, goals: 1, assists: 0, passAccuracy: 75, chances: 3 },
    { name: 'Trent Alexander-Arnold', number: 66, rating: 7.6, assists: 1, passAccuracy: 94, chances: 2 },
    { name: 'Virgil van Dijk', number: 4, rating: 7.4, passAccuracy: 96, chances: 0 },
    { name: 'Alisson', number: 1, rating: 7.1, passAccuracy: 65, chances: 0 },
  ]

  const awayRatings: PlayerRating[] = [
    { name: 'Erling Haaland', number: 9, rating: 7.2, passAccuracy: 82, chances: 2 },
    { name: 'Bernardo Silva', number: 20, rating: 6.9, passAccuracy: 89, chances: 1 },
    { name: 'Rodri', number: 16, rating: 6.8, passAccuracy: 91, chances: 0 },
    { name: 'Kyle Walker', number: 2, rating: 6.5, passAccuracy: 88, chances: 0 },
    { name: 'Manuel Akanji', number: 25, rating: 6.4, passAccuracy: 92, chances: 0 },
    { name: 'Stefan Ortega', number: 18, rating: 6.3, passAccuracy: 45, chances: 0 },
  ]

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-emerald-400 bg-emerald-500/20'
    if (rating >= 7.5) return 'text-blue-400 bg-blue-500/20'
    if (rating >= 7) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-orange-400 bg-orange-500/20'
  }

  const getRatingBgColor = (rating: number) => {
    if (rating >= 8) return 'bg-emerald-500/10'
    if (rating >= 7.5) return 'bg-blue-500/10'
    if (rating >= 7) return 'bg-yellow-500/10'
    return 'bg-orange-500/10'
  }

  return (
    <div className="space-y-6">
      {/* Home Team */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {match.home} {isBn ? 'খেলোয়াড়' : 'Players'}
        </h3>
        <div className="space-y-3">
          {homeRatings.map((player, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${getRatingBgColor(player.rating)} hover:bg-secondary/30 transition-colors cursor-pointer border border-secondary/20`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{player.number}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{player.name}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-lg ${getRatingColor(player.rating)}`}>
                  <Star className="w-4 h-4" />
                  {player.rating.toFixed(1)}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {player.goals !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'গোল' : 'Goals'}</div>
                    <div className="font-bold text-foreground">{player.goals}</div>
                  </div>
                )}
                {player.assists !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'অ্যাসিস্ট' : 'Assists'}</div>
                    <div className="font-bold text-foreground">{player.assists}</div>
                  </div>
                )}
                {player.passAccuracy !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'পাস %' : 'Pass %'}</div>
                    <div className="font-bold text-foreground">{player.passAccuracy}%</div>
                  </div>
                )}
                {player.chances !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'সুযোগ' : 'Chances'}</div>
                    <div className="font-bold text-foreground">{player.chances}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Away Team */}
      <div className="neo-panel p-6">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
          {match.away} {isBn ? 'খেলোয়াড়' : 'Players'}
        </h3>
        <div className="space-y-3">
          {awayRatings.map((player, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${getRatingBgColor(player.rating)} hover:bg-secondary/30 transition-colors cursor-pointer border border-secondary/20`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{player.number}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{player.name}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-lg ${getRatingColor(player.rating)}`}>
                  <Star className="w-4 h-4" />
                  {player.rating.toFixed(1)}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {player.goals !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'গোল' : 'Goals'}</div>
                    <div className="font-bold text-foreground">{player.goals}</div>
                  </div>
                )}
                {player.assists !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'অ্যাসিস্ট' : 'Assists'}</div>
                    <div className="font-bold text-foreground">{player.assists}</div>
                  </div>
                )}
                {player.passAccuracy !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'পাস %' : 'Pass %'}</div>
                    <div className="font-bold text-foreground">{player.passAccuracy}%</div>
                  </div>
                )}
                {player.chances !== undefined && (
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-foreground/60">{isBn ? 'সুযোগ' : 'Chances'}</div>
                    <div className="font-bold text-foreground">{player.chances}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
