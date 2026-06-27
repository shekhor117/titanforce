'use client'

import { useState, useEffect } from 'react'
import FixtureManager from '@/components/FixtureManager'
import { getDataService } from '@/lib/data-service'
import type { Match } from '@/lib/data-service'
import type { Fixture, Player } from '@/components/types'

export default function AdminMatchesPage() {
  const service = getDataService()
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [players] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const retryOperation = async (operation: () => Promise<any>, maxRetries = 3): Promise<any> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await operation()
        } catch (err) {
          if (i === maxRetries - 1) throw err
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    try {
      setLoading(true)
      const matches = await retryOperation(() => service.getMatches())
      
      // Convert Match to Fixture format
      const convertedFixtures: Fixture[] = matches.map((match: any) => ({
        id: match.id,
        homeTeam: match.home || 'Home Team',
        awayTeam: match.away || 'Away Team',
        homeLogoColor: 'bg-emerald-600',
        awayLogoColor: 'bg-indigo-600',
        homeScore: match.home_score ?? 0,
        awayScore: match.away_score ?? 0,
        date: match.date,
        time: match.time,
        stadium: match.venue,
        referee: 'TBD',
        status: (match.status === 'live' ? 'Live' : match.status === 'completed' ? 'Finished' : 'Upcoming') as 'Upcoming' | 'Live' | 'Finished',
        events: match.match_events || [],
      }))
      
      setFixtures(convertedFixtures)
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading matches:', err)
      setError('Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFixture = async (fixture: Fixture) => {
    try {
      setError(null)
      await service.createMatch({
        home: fixture.homeTeam,
        away: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        date: fixture.date,
        time: fixture.time,
        venue: fixture.stadium,
        status: fixture.status === 'Live' ? 'live' : fixture.status === 'Finished' ? 'completed' : 'upcoming',
      })
      
      setSuccessMessage('Match created successfully')
      await loadMatches()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add match'
      console.error('[v0] Error adding match:', err)
      setError(errorMsg)
    }
  }

  const handleUpdateFixture = async (fixture: Fixture) => {
    try {
      setError(null)
      await service.updateMatch(fixture.id, {
        home: fixture.homeTeam,
        away: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        date: fixture.date,
        time: fixture.time,
        venue: fixture.stadium,
        status: fixture.status === 'Live' ? 'live' : fixture.status === 'Finished' ? 'completed' : 'upcoming',
        match_events: fixture.events,
      })
      
      setSuccessMessage('Match updated successfully')
      await loadMatches()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update match'
      console.error('[v0] Error updating match:', err)
      setError(errorMsg)
    }
  }

  const handleDeleteFixture = async (fixtureId: string) => {
    try {
      setError(null)
      await service.deleteMatch(fixtureId)
      setSuccessMessage('Match deleted successfully')
      await loadMatches()
      setTimeout(() => setSuccessMessage(null), 3000)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-950 border border-red-900 text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-emerald-950 border border-emerald-900 text-emerald-200 px-4 py-3 rounded-lg flex items-start gap-3">
          <span className="text-xl">✓</span>
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <FixtureManager
        fixtures={fixtures}
        players={players}
        onAddFixture={handleAddFixture}
        onUpdateFixture={handleUpdateFixture}
        onDeleteFixture={handleDeleteFixture}
      />
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading matches...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <FixtureManager
        fixtures={fixtures}
        players={players}
        onAddFixture={handleAddFixture}
        onUpdateFixture={handleUpdateFixture}
        onDeleteFixture={handleDeleteFixture}
      />
    </div>
  )
}
