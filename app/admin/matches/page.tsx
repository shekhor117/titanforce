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

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const matches = await service.getMatches()
      
      // Convert Match to Fixture format
      const convertedFixtures: Fixture[] = matches.map(match => ({
        id: match.id,
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        homeLogoColor: 'bg-emerald-600',
        awayLogoColor: 'bg-indigo-600',
        homeScore: match.home_score || 0,
        awayScore: match.away_score || 0,
        date: match.match_date,
        time: match.match_time,
        stadium: match.venue,
        referee: 'TBD',
        status: (match.status === 'live' ? 'Live' : match.status === 'finished' ? 'Finished' : 'Upcoming') as 'Upcoming' | 'Live' | 'Finished',
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
      await service.createMatch({
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        match_date: fixture.date,
        match_time: fixture.time,
        venue: fixture.stadium,
        status: fixture.status === 'Live' ? 'live' : fixture.status === 'Finished' ? 'finished' : 'upcoming',
      })
      
      await loadMatches()
    } catch (err) {
      console.error('[v0] Error adding match:', err)
      setError('Failed to add match')
    }
  }

  const handleUpdateFixture = async (fixture: Fixture) => {
    try {
      await service.updateMatch(fixture.id, {
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        match_date: fixture.date,
        match_time: fixture.time,
        venue: fixture.stadium,
        status: fixture.status === 'Live' ? 'live' : fixture.status === 'Finished' ? 'finished' : 'upcoming',
      })
      
      await loadMatches()
    } catch (err) {
      console.error('[v0] Error updating match:', err)
      setError('Failed to update match')
    }
  }

  const handleDeleteFixture = async (fixtureId: string) => {
    try {
      await service.deleteMatch(fixtureId)
      await loadMatches()
    } catch (err) {
      console.error('[v0] Error deleting match:', err)
      setError('Failed to delete match')
    }
  }

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
