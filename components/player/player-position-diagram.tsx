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
      'GK': { x: 50, y: 90 },
      'CB': { x: 50, y: 75 },
      'LB': { x: 28, y: 78 },
      'RB': { x: 72, y: 82 },
      'LWB': { x: 20, y: 66 },
      'RWB': { x: 80, y: 66 },
      'CM': { x: 42, y: 45 },
      'LM': { x: 24, y: 45 },
      'RM': { x: 72, y: 45 },
      'CAM': { x: 50, y: 28 },
      'CF': { x: 50, y: 18 },
      'ST': { x: 50, y: 10 },
      'LW': { x: 28, y: 25 },
      'RW': { x: 72, y: 25 },
      'LF': { x: 35, y: 16 },
      'RF': { x: 65, y: 16 },
      'FWD': { x: 50, y: 15 },
      'MID': { x: 50, y: 45 },
      'DEF': { x: 50, y: 68 },
      'AM': { x: 42, y: 25 },
    }
    return positionMap[position] || { x: 50, y: 50 }
  }

  // Scan positions directly from Supabase player table
  // Use stored positions if available, otherwise create default from player's primary position
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

  // Get primary position for display (from Supabase player table data)
  const primaryPosition = positionsToDisplay.find(p => p.is_primary) || positionsToDisplay[0]
  const secondaryPositions = positionsToDisplay.filter(p => !p.is_primary)

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl">
      <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-6 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? 'অবস্থান' : 'Position'}
      </h3>

      {/* Main layout: Vertical stack */}
      <div className="grid grid-cols-1 gap-6">
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
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1.2" />
            
            {/* Center circle */}
            <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            
            {/* Center spot */}
            <circle cx="50" cy="50" r="1.2" fill="rgba(120, 120, 120, 0.7)" />
            
            {/* Penalty boxes */}
            <rect x="25" y="0" width="50" height="16" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            <rect x="25" y="84" width="50" height="16" fill="none" stroke="rgba(100, 100, 100, 0.5)" strokeWidth="1" />
            
            {/* Goal areas */}
            <rect x="38" y="0" width="24" height="6" fill="none" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.8" />
            <rect x="38" y="94" width="24" height="6" fill="none" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.8" />
            
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
