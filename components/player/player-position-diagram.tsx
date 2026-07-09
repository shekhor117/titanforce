'use client'

import { Player, PlayerPosition } from '@/lib/data-service'
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

      {/* Main layout: Left sidebar + Right field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left sidebar - Position info */}
        <div className="space-y-4">
          {/* Primary Position */}
          <div>
            <p className="text-sm font-semibold text-foreground/70 uppercase mb-2">{isBn ? 'প্রধান' : 'Primary'}</p>
            <p className="text-lg md:text-xl font-bold text-foreground">{primaryPosition.position_name}</p>
          </div>

          {/* Secondary Positions */}
          {secondaryPositions.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground/70 uppercase mb-2">{isBn ? 'অন্যান্য' : 'Others'}</p>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {secondaryPositions.map(pos => pos.position_name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Right side - Field diagram with position badges */}
        <div className="relative w-full aspect-[3/4] bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
          {/* Field lines - Dark style */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {/* Field background */}
            <rect width="100" height="100" fill="#3d3d3d" />
            
            {/* Boundary lines */}
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(100, 100, 100, 0.6)" strokeWidth="2" />
            
            {/* Center line */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1.2" />
            
            {/* Center circle */}
            <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            
            {/* Center spot */}
            <circle cx="50" cy="50" r="1.2" fill="rgba(120, 120, 120, 0.7)" />
            
            {/* Penalty boxes */}
            <rect x="0" y="35" width="16" height="30" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            <rect x="84" y="35" width="16" height="30" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            
            {/* Goal areas */}
            <rect x="0" y="42" width="6" height="16" fill="none" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.8" />
            <rect x="94" y="42" width="6" height="16" fill="none" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.8" />
            
            {/* Corner arcs */}
            <circle cx="0" cy="0" r="1" fill="none" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.8" />
            <circle cx="100" cy="0" r="1" fill="none" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.8" />
            <circle cx="0" cy="100" r="1" fill="none" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="1" fill="none" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.8" />
          </svg>

          {/* Position badges */}
          <div className="absolute inset-0">
            {positionsToDisplay.map(pos => (
              <div
                key={pos.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x_coordinate}%`, top: `${pos.y_coordinate}%` }}
              >
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg transition-all ${
                    pos.is_primary
                      ? 'bg-red-600 text-white border border-red-500'
                      : 'bg-gray-600 text-gray-100 border border-gray-500'
                  }`}
                >
                  {pos.position_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
