'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { MatchStatsEditor } from './match-stats-editor'
import { MatchLineupEditor } from './match-lineup-editor'
import { MatchEventsEditor } from './match-events-editor'

interface Match {
  id?: string
  home_team: string
  away_team: string
  home_score?: number
  away_score?: number
  match_date: string
  match_time?: string
  venue?: string
  league?: string
  status?: 'upcoming' | 'live' | 'completed'
  result?: 'W' | 'D' | 'L'
  referee?: string
  attendance?: number
  weather_temp?: number
  weather_condition?: string
  [key: string]: any
}

interface MatchAdminManagerProps {
  matches: Match[]
  onSave: (match: Match) => Promise<void>
  onDelete: (matchId: string) => Promise<void>
}

export function MatchAdminManager({ matches, onSave, onDelete }: MatchAdminManagerProps) {
  const { isBn } = useLanguage()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'stats' | 'lineups' | 'events'>('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOpenForm = (match?: Match) => {
    if (match) {
      setEditingMatch(match)
    } else {
      setEditingMatch({
        home_team: '',
        away_team: '',
        match_date: new Date().toISOString().split('T')[0],
        status: 'upcoming',
        league: 'Premier League'
      })
    }
    setActiveTab('basic')
    setIsFormOpen(true)
    setError('')
  }

  const handleSaveMatch = async () => {
    if (!editingMatch?.home_team.trim() || !editingMatch?.away_team.trim()) {
      setError(isBn ? 'দল নাম প্রয়োজন' : 'Team names are required')
      return
    }

    setLoading(true)
    try {
      await onSave(editingMatch)
      setIsFormOpen(false)
      setEditingMatch(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save match')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMatch = async (matchId?: string) => {
    if (!matchId) return
    if (!confirm(isBn ? 'এটি মুছে ফেলতে নিশ্চিত?' : 'Are you sure?')) return

    setLoading(true)
    try {
      await onDelete(matchId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete match')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isBn ? 'font-bengali' : ''}`}>
          {isBn ? 'ম্যাচ ম্যানেজার' : 'Match Manager'}
        </h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          {isBn ? 'নতুন ম্যাচ' : 'New Match'}
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-2">
        {matches.map(match => (
          <div key={match.id} className="border border-foreground/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="font-semibold">{match.home_team} vs {match.away_team}</div>
                <div className="text-sm text-foreground/60">{match.match_date} • {match.venue}</div>
              </div>
              {expandedMatchId === match.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedMatchId === match.id && (
              <div className="p-4 border-t border-foreground/10 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => { handleOpenForm(match); setActiveTab('basic'); }}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm bg-foreground/10 hover:bg-foreground/20"
                  >
                    <Edit2 className="w-3 h-3" /> {isBn ? 'সম্পাদনা' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="w-3 h-3" /> {isBn ? 'মুছুন' : 'Delete'}
                  </button>
                </div>

                {/* Match Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-foreground/60">{isBn ? 'সময়' : 'Time'}:</span> {match.match_time}
                  </div>
                  <div>
                    <span className="text-foreground/60">{isBn ? 'স্ট্যাটাস' : 'Status'}:</span> {match.status}
                  </div>
                  <div>
                    <span className="text-foreground/60">{isBn ? 'স্কোর' : 'Score'}:</span> {match.home_score} - {match.away_score}
                  </div>
                  <div>
                    <span className="text-foreground/60">{isBn ? 'ফলাফল' : 'Result'}:</span> {match.result || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {isFormOpen && editingMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-foreground/10 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-foreground/10 p-4 flex items-center justify-between">
              <h3 className={`text-xl font-bold ${isBn ? 'font-bengali' : ''}`}>
                {editingMatch.id ? (isBn ? 'ম্যাচ সম্পাদনা' : 'Edit Match') : (isBn ? 'নতুন ম্যাচ' : 'New Match')}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-foreground/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-foreground/10 flex">
              {['basic', 'stats', 'lineups', 'events'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-foreground/5'
                  }`}
                >
                  {isBn
                    ? { basic: 'মৌলিক', stats: 'পরিসংখ্যান', lineups: 'লাইনআপ', events: 'ঘটনা' }[tab]
                    : { basic: 'Basic', stats: 'Stats', lineups: 'Lineups', events: 'Events' }[tab]}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              {activeTab === 'basic' && (
                <BasicMatchForm
                  match={editingMatch}
                  onChange={(field, value) => setEditingMatch({ ...editingMatch, [field]: value })}
                  isBn={isBn}
                />
              )}

              {activeTab === 'stats' && (
                <MatchStatsEditor
                  stats={editingMatch}
                  homeTeam={editingMatch.home_team}
                  awayTeam={editingMatch.away_team}
                  onSave={(stats) => setEditingMatch({ ...editingMatch, ...stats })}
                />
              )}

              {activeTab === 'lineups' && (
                <MatchLineupEditor
                  homeLineup={editingMatch.home_lineup || []}
                  awayLineup={editingMatch.away_lineup || []}
                  homeTeam={editingMatch.home_team}
                  awayTeam={editingMatch.away_team}
                  onSave={(home, away) => setEditingMatch({ ...editingMatch, home_lineup: home, away_lineup: away })}
                />
              )}

              {activeTab === 'events' && (
                <MatchEventsEditor
                  goals={editingMatch.goals || []}
                  events={editingMatch.events || []}
                  homeTeam={editingMatch.home_team}
                  awayTeam={editingMatch.away_team}
                  onSave={(goals, events) => setEditingMatch({ ...editingMatch, goals, events })}
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-foreground/10 p-4 flex gap-2">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-foreground/20 hover:bg-foreground/5 transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveMatch}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? (isBn ? 'সংরক্ষণ...' : 'Saving...') : (isBn ? 'সংরক্ষণ' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BasicMatchForm({ match, onChange, isBn }: { match: Match; onChange: (field: string, value: any) => void; isBn: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'হোম টিম' : 'Home Team'}
          </label>
          <input
            type="text"
            value={match.home_team}
            onChange={(e) => onChange('home_team', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'অ্যাওয়ে টিম' : 'Away Team'}
          </label>
          <input
            type="text"
            value={match.away_team}
            onChange={(e) => onChange('away_team', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'তারিখ' : 'Date'}
          </label>
          <input
            type="date"
            value={match.match_date}
            onChange={(e) => onChange('match_date', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'সময়' : 'Time'}
          </label>
          <input
            type="time"
            value={match.match_time || ''}
            onChange={(e) => onChange('match_time', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'স্টেডিয়াম' : 'Venue'}
          </label>
          <input
            type="text"
            value={match.venue || ''}
            onChange={(e) => onChange('venue', e.target.value)}
            placeholder="Stadium name"
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'লিগ' : 'League'}
          </label>
          <input
            type="text"
            value={match.league || 'Premier League'}
            onChange={(e) => onChange('league', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'স্কোর - হোম' : 'Score - Home'}
          </label>
          <input
            type="number"
            min="0"
            value={match.home_score ?? ''}
            onChange={(e) => onChange('home_score', parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'স্কোর - অ্যাওয়ে' : 'Score - Away'}
          </label>
          <input
            type="number"
            min="0"
            value={match.away_score ?? ''}
            onChange={(e) => onChange('away_score', parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'স্ট্যাটাস' : 'Status'}
          </label>
          <select
            value={match.status || 'upcoming'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'রেফারি' : 'Referee'}
          </label>
          <input
            type="text"
            value={match.referee || ''}
            onChange={(e) => onChange('referee', e.target.value)}
            className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
          />
        </div>
      </div>

      <div>
        <label className={`text-sm text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
          {isBn ? 'উপস্থিতি' : 'Attendance'}
        </label>
        <input
          type="number"
          value={match.attendance ?? ''}
          onChange={(e) => onChange('attendance', parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded border border-foreground/10 bg-secondary"
        />
      </div>
    </div>
  )
}
