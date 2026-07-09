'use client'

import { Player, PlayerPosition } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'
import { PositionBadge } from './position-badge'

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
      'AM': { x: 50, y: 65 },
    }
    return positionMap[position] || { x: 50, y: 50 }
  }

  // Use stored positions if available, otherwise create default from primary position
  const positionsToDisplay: Array<PlayerPosition & { position_name?: string }> = player.positions && player.positions.length > 0
    ? player.positions
    : [{
        id: 'default',
        player_id: player.id,
        position_name: player.position,
        x_coordinate: getPositionCoordinates(player.position).x,
        y_coordinate: getPositionCoordinates(player.position).y,
        is_primary: true,
        created_at: player.created_at,
        updated_at: player.updated_at,
      }]

  // Get primary position for display
  const primaryPosition = positionsToDisplay.find(p => p.is_primary) || positionsToDisplay[0]
  const secondaryPositions = positionsToDisplay.filter(p => !p.is_primary)

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl">
      <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-6 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? 'অবস্থান' : 'Position'}
      </h3>

      {/* Position Info */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-red-600/20 border border-red-500/40 rounded-lg">
          <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-foreground/60 uppercase">{isBn ? 'প্রধান অবস্থান' : 'Primary'}</p>
            <p className="text-lg font-bold text-foreground">{primaryPosition.position_name}</p>
          </div>
        </div>

        {secondaryPositions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-foreground/60 uppercase">{isBn ? 'অন্যান্য' : 'Others'}</p>
            <div className="flex flex-wrap gap-2">
              {secondaryPositions.map(pos => (
                <span
                  key={pos.id}
                  className="px-3 py-1 bg-gray-600/40 text-foreground/80 text-sm rounded-full border border-gray-500/30"
                >
                  {pos.position_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-green-800 to-green-900 rounded-lg border-2 border-green-600/60 overflow-hidden">
        {/* Field lines - FotMob style */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {/* Field background */}
          <rect width="100" height="100" fill="#1b5e35" />
          
          {/* Subtle grid pattern */}
          <defs>
            <pattern id="fieldGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(74, 222, 128, 0.08)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#fieldGrid)" />
          
          {/* Boundary lines */}
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(74, 222, 128, 0.4)" strokeWidth="1.5" />
          
          {/* Center line */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="0.8" />
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(74, 222, 128, 0.35)" strokeWidth="0.8" />
          
          {/* Center spot */}
          <circle cx="50" cy="50" r="1.5" fill="rgba(74, 222, 128, 0.5)" />
          
          {/* Penalty boxes */}
          <rect x="0" y="35" width="18" height="30" fill="none" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="0.8" />
          <rect x="82" y="35" width="18" height="30" fill="none" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="0.8" />
          
          {/* Goal areas */}
          <rect x="0" y="42" width="8" height="16" fill="none" stroke="rgba(74, 222, 128, 0.25)" strokeWidth="0.6" />
          <rect x="92" y="42" width="8" height="16" fill="none" stroke="rgba(74, 222, 128, 0.25)" strokeWidth="0.6" />
          
          {/* Corner arcs */}
          <circle cx="0" cy="0" r="1.5" fill="none" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="0.5" />
          <circle cx="100" cy="0" r="1.5" fill="none" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="0.5" />
          <circle cx="0" cy="100" r="1.5" fill="none" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="1.5" fill="none" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="0.5" />
        </svg>

        {/* Position badges */}
        <div className="absolute inset-0">
          {positionsToDisplay.map(pos => (
            <PositionBadge
              key={pos.id}
              number={player.num}
              position={pos.position_name || ''}
              isPrimary={pos.is_primary}
              x={pos.x_coordinate}
              y={pos.y_coordinate}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-secondary/30">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-foreground/60 uppercase mb-2">{isBn ? 'প্রধান অবস্থান' : 'Primary Position'}</p>
            <p className="text-lg font-bold text-foreground">{primaryPosition.position_name}</p>
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
