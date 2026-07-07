'use client'

import { Player } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayerPositionDiagramProps {
  player: Player
}

export function PlayerPositionDiagram({ player }: PlayerPositionDiagramProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const getPositionCoordinates = (position: string) => {
    const positionMap: Record<string, { x: number; y: number }> = {
      'GK': { x: 50, y: 10 },
      'CB': { x: 50, y: 30 },
      'LB': { x: 20, y: 40 },
      'RB': { x: 80, y: 40 },
      'LWB': { x: 10, y: 50 },
      'RWB': { x: 90, y: 50 },
      'CM': { x: 50, y: 55 },
      'LM': { x: 20, y: 55 },
      'RM': { x: 80, y: 55 },
      'CAM': { x: 50, y: 65 },
      'CF': { x: 50, y: 85 },
      'ST': { x: 50, y: 90 },
      'LW': { x: 20, y: 75 },
      'RW': { x: 80, y: 75 },
      'LF': { x: 30, y: 85 },
      'RF': { x: 70, y: 85 },
      'FWD': { x: 50, y: 85 },
      'MID': { x: 50, y: 55 },
      'DEF': { x: 50, y: 30 },
    }
    return positionMap[position] || { x: 50, y: 50 }
  }

  const coords = getPositionCoordinates(player.position)

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl">
      <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-6 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? 'অবস্থান' : 'Position'}
      </h3>

      <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-green-900/30 to-green-800/20 rounded-lg border-2 border-green-600/40 overflow-hidden">
        {/* Field lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Center line */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          {/* Center circle */}
          <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          {/* Penalty boxes */}
          <rect x="0" y="35" width="20" height="30" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          <rect x="80" y="35" width="20" height="30" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
        </svg>

        {/* Player position indicator */}
        <div
          className="absolute w-12 h-12 md:w-14 md:h-14 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
        >
          <div className="w-full h-full rounded-full bg-blue-500 border-3 border-blue-300 shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-base">#{player.num}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-secondary/30">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'অবস্থান' : 'Position'}</p>
            <p className="text-lg font-bold text-foreground">{player.position}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'পছন্দের পা' : 'Preferred Foot'}</p>
            <p className="text-lg font-bold text-foreground">{player.foot || 'Right'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
