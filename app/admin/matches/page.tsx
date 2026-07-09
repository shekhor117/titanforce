'use client'

import { useState, useEffect } from 'react'
import { MatchAdminManager } from '@/components/admin/match-admin-manager'
import type { Match } from '@/lib/data-service'

interface MatchData {
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
  [key: string]: any
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/matches')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch matches')
      }
      const data = await response.json()
      setMatches(data || [])
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading matches:', err)
      setError(err instanceof Error ? err.message : 'Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMatch = async (match: MatchData) => {
    try {
      setError(null)
      const method = match.id ? 'PUT' : 'POST'
      
      const response = await fetch('/api/admin/matches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match)
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${JSON.stringify(errorData.details)}`
          : errorData.error || 'Failed to save match'
        setError(errorMessage)
        return
      }

      await loadMatches()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save match'
      console.error('[v0] Error saving match:', err)
      setError(errorMsg)
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/admin/matches?id=${matchId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete match')
        return
      }

      await loadMatches()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete match'
      console.error('[v0] Error deleting match:', err)
      setError(errorMsg)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <MatchAdminManager
        matches={matches}
        onSave={handleSaveMatch}
        onDelete={handleDeleteMatch}
      />
    </div>
  )
}
