'use client'

import { Player, PlayerPosition } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayerPositionDiagramProps {
  player: Player
}

export function PlayerPositionDiagram({ player }: PlayerPositionDiagramProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const positionMap: Record<string, { x: number; y: number }> = {
    GK: { x: 50, y: 91 },
    CB: { x: 50, y: 74 },
    LB: { x: 24, y: 76 },
    RB: { x: 76, y: 76 },
    LWB: { x: 18, y: 61 },
    RWB: { x: 82, y: 61 },
    DM: { x: 50, y: 57 },
    CM: { x: 50, y: 45 },
    LM: { x: 22, y: 45 },
    RM: { x: 78, y: 45 },
    AM: { x: 50, y: 32 },
    CAM: { x: 50, y: 30 },
    LW: { x: 22, y: 24 },
    RW: { x: 78, y: 24 },
    CF: { x: 50, y: 18 },
    LF: { x: 34, y: 17 },
    RF: { x: 66, y: 17 },
    ST: { x: 50, y: 10 },
    FWD: { x: 50, y: 15 },
    MID: { x: 50, y: 45 },
    DEF: { x: 50, y: 72 },
  }

  const normalizePositions = (value: string | undefined) =>
    (value || 'MID')
      .toUpperCase()
      .split(/[\/,|+&]|\s+OR\s+|\s+AND\s+/)
      .map((position) => position.trim().replace(/\s+/g, ''))
      .map((position) => position === 'GOALKEEPER' ? 'GK' : position === 'DEFENDER' ? 'DEF' : position === 'MIDFIELDER' ? 'MID' : position === 'FORWARD' || position === 'STRIKER' ? 'FWD' : position)
      .filter((position, index, positions) => positionMap[position] && positions.indexOf(position) === index)

  const getPositionCoordinates = (position: string) => positionMap[position] || positionMap.MID
  const positionCodes = normalizePositions(player.position)

  // Prefer explicitly stored positions, while using normalized football roles for legacy composite values.
  const positionsToDisplay: Array<PlayerPosition & { position_name?: string }> = player.positions && player.positions.length > 0
    ? player.positions.map((position) => ({
        ...position,
        position_name: normalizePositions(position.position_name)[0] || 'MID',
        x_coordinate: position.x_coordinate ?? getPositionCoordinates(position.position_name).x,
        y_coordinate: position.y_coordinate ?? getPositionCoordinates(position.position_name).y,
      }))
    : positionCodes.map((position, index) => ({
        id: `default-${position}`,
        player_id: player.id,
        position_name: position,
        x_coordinate: getPositionCoordinates(position).x,
        y_coordinate: getPositionCoordinates(position).y,
        is_primary: index === 0,
        created_at: player.created_at,
        updated_at: player.updated_at,
      }))

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
