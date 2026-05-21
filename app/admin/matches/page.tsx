'use client'

import { useState, useEffect } from 'react'
import { FixtureManager } from '@/components/FixtureManager'
import { useDataService } from '@/lib/data-service'
import type { Match } from '@/lib/data-service'

interface Fixture {
  id: string
  homeTeam: string
  awayTeam: string
  homeLogoColor: string
  awayLogoColor: string
  homeScore: number
  awayScore: number
  date: string
  time: string
  venue: string
  status: 'Not Started' | 'In Progress' | 'Finished'
  homeLineup: Array<{ name: string; number: number }>
  awayLineup: Array<{ name: string; number: number }>
  events: Array<{
    player: string
    type: 'Goal' | 'Yellow Card' | 'Red Card' | 'Substitution'
    minute: number
    team: 'Home' | 'Away'
  }>
}

interface Player {
  id: string
  name: string
  number: number
}

export default function AdminMatchesPage() {
  const { getMatches, createMatch, updateMatch, deleteMatch } = useDataService()
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
      const matches = await getMatches()
      
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
        venue: match.venue,
        status: (match.status as 'Not Started' | 'In Progress' | 'Finished') || 'Not Started',
        homeLineup: match.home_lineup || [],
        awayLineup: match.away_lineup || [],
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
      await createMatch({
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        match_date: fixture.date,
        match_time: fixture.time,
        venue: fixture.venue,
        status: fixture.status,
        home_lineup: fixture.homeLineup,
        away_lineup: fixture.awayLineup,
        match_events: fixture.events,
      })
      
      await loadMatches()
    } catch (err) {
      console.error('[v0] Error adding match:', err)
      setError('Failed to add match')
    }
  }

  const handleUpdateFixture = async (fixture: Fixture) => {
    try {
      await updateMatch(fixture.id, {
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        home_score: fixture.homeScore,
        away_score: fixture.awayScore,
        match_date: fixture.date,
        match_time: fixture.time,
        venue: fixture.venue,
        status: fixture.status,
        home_lineup: fixture.homeLineup,
        away_lineup: fixture.awayLineup,
        match_events: fixture.events,
      })
      
      await loadMatches()
    } catch (err) {
      console.error('[v0] Error updating match:', err)
      setError('Failed to update match')
    }
  }

  const handleDeleteFixture = async (fixtureId: string) => {
    try {
      await deleteMatch(fixtureId)
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
