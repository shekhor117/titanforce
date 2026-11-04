import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const league = searchParams.get('league')
    const requestedLimit = Number(searchParams.get('limit') ?? 50)
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50

    let query = supabase
      .from('matches')
      .select('id, home, away, home_score, away_score, date, time, venue, status, result, season_year, notes, goals')
      .order('date', { ascending: false })
      .limit(limit)

    const allowedStatuses = new Set(['upcoming', 'scheduled', 'live', 'completed', 'cancelled', 'postponed'])
    if (status) {
      if (!allowedStatuses.has(status)) return NextResponse.json({ error: 'Invalid match status' }, { status: 400 })
      query = query.eq('status', status)
    }

    if (league) {
      return NextResponse.json({ error: 'League filtering is not available for this schema' }, { status: 400 })
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching matches:', error.code)
      return NextResponse.json({ error: 'Unable to fetch matches' }, { status: 500 })
    }

    return NextResponse.json((data || []).map((match) => ({
      ...match,
      home_team: match.home,
      away_team: match.away,
    })))
  } catch (error) {
    console.error('[v0] Unexpected error while fetching matches')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
