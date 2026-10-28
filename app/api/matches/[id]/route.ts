import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    const matchId = resolvedParams.id

    if (!/^[0-9a-f-]{36}$/i.test(matchId)) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('matches')
      .select('id, home, away, home_score, away_score, date, time, venue, status, result, season_year, notes, goals')
      .eq('id', matchId)
      .single()

    if (error) {
      console.error('[v0] Error fetching match:', error)
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Match not found' }, { status: 404 })
      return NextResponse.json({ error: 'Unable to fetch match' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
