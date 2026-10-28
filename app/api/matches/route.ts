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
      .select('id, home_team, away_team, home_score, away_score, date, time, venue, status, result, league, season_year, notes, goals')
      .order('date', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    if (league) {
      query = query.eq('league', league)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching matches:', error)
      return NextResponse.json({ error: 'Unable to fetch matches' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
