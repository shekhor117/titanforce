'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface LineupPlayer {
  number: number
  player: string
  name?: string
  position: string
}

interface MatchLineupEditorProps {
  homeLineup: LineupPlayer[]
  awayLineup: LineupPlayer[]
  homeTeam: string
  awayTeam: string
  onSave: (home: LineupPlayer[], away: LineupPlayer[]) => void
}

export function MatchLineupEditor({ homeLineup, awayLineup, homeTeam, awayTeam, onSave }: MatchLineupEditorProps) {
  const { isBn } = useLanguage()
  const [home, setHome] = useState<LineupPlayer[]>(homeLineup || [])
  const [away, setAway] = useState<LineupPlayer[]>(awayLineup || [])
  const [expandedTeam, setExpandedTeam] = useState<'home' | 'away' | null>('home')

  const addPlayer = (team: 'home' | 'away') => {
    const lineup = team === 'home' ? home : away
    const newPlayer: LineupPlayer = {
      number: lineup.length > 0 ? Math.max(...lineup.map(p => p.number)) + 1 : 1,
      player: '',
      position: 'FW'
    }
    if (team === 'home') {
      setHome([...home, newPlayer])
    } else {
      setAway([...away, newPlayer])
    }
  }

  const removePlayer = (team: 'home' | 'away', index: number) => {
    if (team === 'home') {
      setHome(home.filter((_, i) => i !== index))
    } else {
      setAway(away.filter((_, i) => i !== index))
    }
  }

  const updatePlayer = (team: 'home' | 'away', index: number, field: keyof LineupPlayer, value: any) => {
    const lineup = team === 'home' ? home : away
    const updated = [...lineup]
    updated[index] = { ...updated[index], [field]: value }
    if (team === 'home') {
      setHome(updated)
    } else {
      setAway(updated)
    }
  }

  const positions = ['GK', 'LB', 'CB', 'RB', 'CM', 'CDM', 'CAM', 'LM', 'RM', 'FW', 'LW', 'RW', 'ST']

  const TeamLineup = ({ team, lineup, teamName, color }: { team: 'home' | 'away', lineup: LineupPlayer[], teamName: string, color: string }) => {
    const isExpanded = expandedTeam === team
    return (
      <div className="border border-foreground/10 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedTeam(isExpanded ? null : team)}
          className={`w-full p-4 flex items-center justify-between ${color} bg-opacity-10 hover:bg-opacity-20 transition-colors`}
        >
          <h3 className={`font-semibold ${isBn ? 'font-bengali' : ''}`}>{teamName}</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="p-4 space-y-3">
            {lineup.map((player, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={player.number}
                  onChange={(e) => updatePlayer(team, idx, 'number', parseInt(e.target.value))}
                  className="w-12 px-2 py-1 rounded bg-secondary border border-foreground/10 text-xs"
                  placeholder="#"
                />
                <input
                  type="text"
                  value={player.player}
                  onChange={(e) => updatePlayer(team, idx, 'player', e.target.value)}
                  className="flex-1 px-3 py-1 rounded bg-secondary border border-foreground/10 text-sm"
                  placeholder={isBn ? 'খেলোয়াড়' : 'Player name'}
                />
                <select
                  value={player.position}
                  onChange={(e) => updatePlayer(team, idx, 'position', e.target.value)}
                  className="px-2 py-1 rounded bg-secondary border border-foreground/10 text-xs"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <button
                  onClick={() => removePlayer(team, idx)}
                  className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => addPlayer(team)}
              className="w-full flex items-center justify-center gap-2 p-2 rounded border border-dashed border-foreground/20 hover:bg-foreground/5 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {isBn ? 'খেলোয়াড় যোগ করুন' : 'Add Player'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TeamLineup team="home" lineup={home} teamName={homeTeam} color="bg-emerald-600" />
      <TeamLineup team="away" lineup={away} teamName={awayTeam} color="bg-indigo-600" />

      <button
        onClick={() => onSave(home, away)}
        className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        {isBn ? 'সংরক্ষণ করুন' : 'Save Lineups'}
      </button>
    </div>
  )
}
