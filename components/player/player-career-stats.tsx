'use client'

import { Player } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayerCareerStatsProps {
  player: Player
}

export function PlayerCareerStats({ player }: PlayerCareerStatsProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl 2xl:col-span-2">
      <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-6 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? 'ক্যারিয়ার' : 'Career Stats'}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead className="border-b-2 border-primary">
            <tr className="text-left text-primary font-bold uppercase tracking-wider text-xs">
              <th className="px-3 py-3">Season</th>
              <th className="px-3 py-3">{isBn ? 'ম্যাচ' : 'Matches'}</th>
              <th className="px-3 py-3">{isBn ? 'গোল' : 'Goals'}</th>
              <th className="px-3 py-3">{isBn ? 'সহায়তা' : 'Assists'}</th>
              <th className="px-3 py-3 hidden sm:table-cell">{isBn ? 'মিনিট' : 'Minutes'}</th>
              <th className="px-3 py-3 hidden md:table-cell">{isBn ? 'রেটিং' : 'Rating'}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-secondary/30 hover:bg-secondary/20 transition-colors">
              <td className="px-3 py-4 font-semibold text-foreground">2024-2025</td>
              <td className="px-3 py-4">{player.appearances || 0}</td>
              <td className="px-3 py-4 text-green-400 font-bold">{player.goals || 0}</td>
              <td className="px-3 py-4 text-blue-400 font-bold">{player.assists || 0}</td>
              <td className="px-3 py-4 hidden sm:table-cell">{player.minutes_played || 0}</td>
              <td className="px-3 py-4 hidden md:table-cell font-bold">{player.average_rating?.toFixed(1) || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-secondary/30">
        <div className="bg-secondary/20 rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'যোগাযোগ' : 'Passes'}</p>
          <p className="text-2xl font-bold text-primary">{player.pass_accuracy?.toFixed(1) || 0}%</p>
        </div>
        <div className="bg-secondary/20 rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'সুযোগ' : 'Chances'}</p>
          <p className="text-2xl font-bold text-primary">{player.chances_created || 0}</p>
        </div>
        <div className="bg-secondary/20 rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'কার্ড' : 'Cards'}</p>
          <p className="text-2xl font-bold text-primary">{(player.yellow_cards || 0) + (player.red_cards || 0)}</p>
        </div>
        <div className="bg-secondary/20 rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'এমওটিএম' : 'MOTM'}</p>
          <p className="text-2xl font-bold text-primary">{player.man_of_the_match || 0}</p>
        </div>
      </div>
    </div>
  )
}
