'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Standing {
  id?: string
  position: number
  team_name: string
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference?: number
  points: number
  is_highlighted: boolean
}

export function StandingsManager() {
  const { isBn } = useLanguage()
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Standing | null>(null)
  const [newForm, setNewForm] = useState<Standing>({
    position: 0,
    team_name: '',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0,
    is_highlighted: false,
  })
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    loadStandings()
  }, [])

  const loadStandings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/standings')
      if (!response.ok) throw new Error('Failed to fetch standings')
      const data = await response.json()
      setStandings(data)
    } catch (err) {
      console.error('[v0] Error loading standings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load standings')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      if (!newForm.team_name || newForm.position === 0) {
        setError(isBn ? 'দল নাম এবং অবস্থান প্রয়োজন' : 'Team name and position are required')
        return
      }

      const response = await fetch('/api/admin/standings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      setSuccess(isBn ? 'দল যোগ করা হয়েছে' : 'Standing added successfully')
      setNewForm({
        position: 0,
        team_name: '',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        points: 0,
        is_highlighted: false,
      })
      setShowNewForm(false)
      await loadStandings()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('[v0] Error adding standing:', err)
      setError(err instanceof Error ? err.message : 'Failed to add standing')
    }
  }

  const handleEdit = async (standing: Standing) => {
    try {
      if (!standing.id) return

      const response = await fetch('/api/admin/standings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standing),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      setSuccess(isBn ? 'আপডেট করা হয়েছে' : 'Standing updated successfully')
      setEditingId(null)
      setEditForm(null)
      await loadStandings()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('[v0] Error updating standing:', err)
      setError(err instanceof Error ? err.message : 'Failed to update standing')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isBn ? 'নিশ্চিত? এটি মুছে দেবে' : 'Are you sure? This will delete the standing')) return

    try {
      const response = await fetch(`/api/admin/standings?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      setSuccess(isBn ? 'মুছে ফেলা হয়েছে' : 'Standing deleted successfully')
      await loadStandings()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('[v0] Error deleting standing:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete standing')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isBn ? 'font-bengali' : ''}`}>
          {isBn ? 'স্ট্যান্ডিংস পরিচালনা' : 'Manage Standings'}
        </h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isBn ? 'যোগ করুন' : 'Add Team'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          <p className={`font-semibold ${isBn ? 'font-bengali' : ''}`}>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600">
          <p className={`font-semibold ${isBn ? 'font-bengali' : ''}`}>{success}</p>
        </div>
      )}

      {showNewForm && (
        <div className="neo-panel p-6 space-y-4">
          <h3 className={`text-lg font-semibold ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'নতুন দল' : 'New Standing'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'অবস্থান' : 'Position'}
              </label>
              <input
                type="number"
                value={newForm.position}
                onChange={(e) => setNewForm({ ...newForm, position: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'দল নাম' : 'Team Name'}
              </label>
              <input
                type="text"
                value={newForm.team_name}
                onChange={(e) => setNewForm({ ...newForm, team_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
                placeholder={isBn ? 'দল নাম' : 'Team name'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'খেলা' : 'Played'}
              </label>
              <input
                type="number"
                value={newForm.played}
                onChange={(e) => setNewForm({ ...newForm, played: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'জয়' : 'Won'}
              </label>
              <input
                type="number"
                value={newForm.won}
                onChange={(e) => setNewForm({ ...newForm, won: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'ড্র' : 'Drawn'}
              </label>
              <input
                type="number"
                value={newForm.drawn}
                onChange={(e) => setNewForm({ ...newForm, drawn: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'হার' : 'Lost'}
              </label>
              <input
                type="number"
                value={newForm.lost}
                onChange={(e) => setNewForm({ ...newForm, lost: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'গোল' : 'Goals For'}
              </label>
              <input
                type="number"
                value={newForm.goals_for}
                onChange={(e) => setNewForm({ ...newForm, goals_for: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'বিরুদ্ধে গোল' : 'Goals Against'}
              </label>
              <input
                type="number"
                value={newForm.goals_against}
                onChange={(e) => setNewForm({ ...newForm, goals_against: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'পয়েন্ট' : 'Points'}
              </label>
              <input
                type="number"
                value={newForm.points}
                onChange={(e) => setNewForm({ ...newForm, points: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-secondary-foreground/20 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newForm.is_highlighted}
                onChange={(e) => setNewForm({ ...newForm, is_highlighted: e.target.checked })}
                className="w-4 h-4"
              />
              <label className={`text-sm font-medium ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'হাইলাইট করুন' : 'Highlight'}
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              {isBn ? 'যোগ করুন' : 'Add'}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <X className="w-4 h-4" />
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-secondary-foreground/20">
              <th className={`text-left px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'অবস্থান' : 'Pos'}
              </th>
              <th className={`text-left px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'দল' : 'Team'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'খ' : 'P'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'জ' : 'W'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'ড' : 'D'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'হ' : 'L'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'গ' : 'GD'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'পয়েন্ট' : 'Pts'}
              </th>
              <th className={`text-center px-4 py-3 font-semibold ${isBn ? 'font-bengali' : ''}`}>
                {isBn ? 'অ্যাকশন' : 'Action'}
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => (
              <tr
                key={standing.id}
                className={`border-b border-secondary-foreground/10 hover:bg-secondary/50 transition-colors ${
                  standing.is_highlighted ? 'bg-primary/5' : ''
                }`}
              >
                <td className="px-4 py-3">{standing.position}</td>
                <td className={`px-4 py-3 font-medium ${isBn ? 'font-bengali' : ''}`}>
                  {standing.team_name}
                </td>
                <td className="px-4 py-3 text-center">{standing.played}</td>
                <td className="px-4 py-3 text-center">{standing.won}</td>
                <td className="px-4 py-3 text-center">{standing.drawn}</td>
                <td className="px-4 py-3 text-center">{standing.lost}</td>
                <td className="px-4 py-3 text-center">{standing.goal_difference || standing.goals_for - standing.goals_against}</td>
                <td className="px-4 py-3 text-center font-semibold">{standing.points}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(standing.id || null)
                        setEditForm(standing)
                      }}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      title={isBn ? 'সম্পাদন করুন' : 'Edit'}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => standing.id && handleDelete(standing.id)}
                      className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                      title={isBn ? 'মুছে দিন' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {standings.length === 0 && (
        <div className="text-center py-12 text-foreground/60">
          <p className={isBn ? 'font-bengali' : ''}>
            {isBn ? 'কোনো স্ট্যান্ডিং নেই। যোগ করতে শুরু করুন।' : 'No standings yet. Start adding teams.'}
          </p>
        </div>
      )}
    </div>
  )
}
