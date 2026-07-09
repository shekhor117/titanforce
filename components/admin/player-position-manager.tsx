'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Star } from 'lucide-react'
import { PlayerPosition } from '@/lib/data-service'

interface PlayerPositionManagerProps {
  playerNum: number
}

const POSITION_OPTIONS = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CM', 'LM', 'RM', 'CAM', 'CF', 'ST', 'LW', 'RW', 'LF', 'RF', 'FWD', 'MID', 'DEF', 'AM'
]

const DEFAULT_COORDINATES: Record<string, { x: number; y: number }> = {
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

export function PlayerPositionManager({ playerNum }: PlayerPositionManagerProps) {
  const [positions, setPositions] = useState<PlayerPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newPosition, setNewPosition] = useState<string>('LW')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchPositions()
  }, [playerNum])

  const fetchPositions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/players/${playerNum}/positions`)
      if (!response.ok) throw new Error('Failed to fetch positions')
      const data = await response.json()
      setPositions(data.positions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load positions')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPosition = async () => {
    try {
      setSaving(true)
      setError(null)
      const coords = DEFAULT_COORDINATES[newPosition] || { x: 50, y: 50 }

      const response = await fetch(`/api/admin/players/${playerNum}/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position_name: newPosition,
          x_coordinate: coords.x,
          y_coordinate: coords.y,
          is_primary: positions.length === 0,
          description: '',
        }),
      })

      if (!response.ok) throw new Error('Failed to add position')
      const data = await response.json()
      setPositions([...positions, data.position])
      setNewPosition('LW')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add position')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePosition = async (positionId: string) => {
    try {
      setSaving(true)
      setError(null)
      const response = await fetch(`/api/admin/players/${playerNum}/positions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionId }),
      })

      if (!response.ok) throw new Error('Failed to delete position')
      setPositions(positions.filter(p => p.id !== positionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete position')
    } finally {
      setSaving(false)
    }
  }

  const handleSetPrimary = async (positionId: string) => {
    try {
      setSaving(true)
      setError(null)
      const position = positions.find(p => p.id === positionId)
      if (!position) return

      const response = await fetch(`/api/admin/players/${playerNum}/positions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId,
          position_name: position.position_name,
          x_coordinate: position.x_coordinate,
          y_coordinate: position.y_coordinate,
          is_primary: true,
          description: position.description,
        }),
      })

      if (!response.ok) throw new Error('Failed to update position')
      await fetchPositions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update position')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCoordinates = async (positionId: string, x: number, y: number) => {
    try {
      setSaving(true)
      setError(null)
      const position = positions.find(p => p.id === positionId)
      if (!position) return

      const response = await fetch(`/api/admin/players/${playerNum}/positions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId,
          position_name: position.position_name,
          x_coordinate: x,
          y_coordinate: y,
          is_primary: position.is_primary,
          description: position.description,
        }),
      })

      if (!response.ok) throw new Error('Failed to update coordinates')
      await fetchPositions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update coordinates')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/40">
          {error}
        </div>
      )}

      {/* Add Position */}
      <div className="neo-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4">Add Position</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            className="flex-1 px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
          >
            {POSITION_OPTIONS.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <button
            onClick={handleAddPosition}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {positions.map(position => (
          <div
            key={position.id}
            className="neo-card p-4 rounded-lg border border-secondary/30 cursor-pointer hover:border-secondary/60 transition-colors"
            onClick={() => setExpandedId(expandedId === position.id ? null : position.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {position.is_primary && (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                )}
                <div>
                  <p className="font-bold">{position.position_name}</p>
                  <p className="text-xs text-foreground/60">X: {position.x_coordinate}%, Y: {position.y_coordinate}%</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePosition(position.id)
                }}
                disabled={saving}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Details */}
            {expandedId === position.id && (
              <div className="mt-4 pt-4 border-t border-secondary/30 space-y-3">
                {!position.is_primary && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetPrimary(position.id)
                    }}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/40 rounded-lg hover:bg-yellow-600/30 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Star className="w-4 h-4" />
                    Set as Primary
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-foreground/60 uppercase mb-2 block">X Coordinate</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={position.x_coordinate}
                      onChange={(e) => handleUpdateCoordinates(position.id, parseFloat(e.target.value), position.y_coordinate)}
                      className="w-full px-3 py-2 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 uppercase mb-2 block">Y Coordinate</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={position.y_coordinate}
                      onChange={(e) => handleUpdateCoordinates(position.id, position.x_coordinate, parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {positions.length === 0 && (
          <div className="text-center py-8 text-foreground/60">
            No positions added yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  )
}
