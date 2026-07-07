import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validateMatch } from '@/lib/validation'

// Helper to map database fields to admin form fields
function mapMatchData(dbMatch: any) {
  return {
    id: dbMatch.id,
    home_team: dbMatch.home,
    away_team: dbMatch.away,
    home_score: dbMatch.home_score,
    away_score: dbMatch.away_score,
    match_date: dbMatch.date,
    match_time: dbMatch.time,
    venue: dbMatch.venue,
    status: dbMatch.status,
    result: dbMatch.result,
    season_year: dbMatch.season_year,
    notes: dbMatch.notes,
    lineup_data: dbMatch.lineup_data,
    statistics_data: dbMatch.statistics_data,
    goals: dbMatch.goals,
    created_at: dbMatch.created_at,
    updated_at: dbMatch.updated_at
  }
}

export async function GET(request: NextRequest) {
  try {
    const userClient = createClient()
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('id')

    // Check admin authentication
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client for querying
    const supabase = createAdminClient()

    if (matchId) {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (error) {
        console.error('[v0] Error fetching match:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(mapMatchData(data))
    } else {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching matches:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json((data || []).map(mapMatchData))
    }
  } catch (error) {
    console.error('[v0] Unexpected error in GET:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userClient = createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate match data
    const validation = validateMatch(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    // Map field names from admin form to database schema
    const matchData = {
      home: body.home_team || body.home,
      away: body.away_team || body.away,
      date: body.match_date || body.date,
      time: body.match_time || body.time,
      venue: body.venue || '',
      status: body.status || 'upcoming',
      home_score: body.home_score,
      away_score: body.away_score,
      result: body.result,
      season_year: body.season_year,
      notes: body.notes,
      lineup_data: body.lineup_data || {},
      statistics_data: body.statistics_data || {},
      goals: body.goals || []
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating match:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userClient = createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing match ID' }, { status: 400 })
    }

    // Validate match data (partial updates are OK)
    const validation = validateMatch(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    // Map field names from admin form to database schema
    const matchData: Record<string, any> = {}
    if (updates.home_team || updates.home) matchData.home = updates.home_team || updates.home
    if (updates.away_team || updates.away) matchData.away = updates.away_team || updates.away
    if (updates.match_date || updates.date) matchData.date = updates.match_date || updates.date
    if (updates.match_time || updates.time) matchData.time = updates.match_time || updates.time
    if (updates.venue !== undefined) matchData.venue = updates.venue
    if (updates.status !== undefined) matchData.status = updates.status
    if (updates.home_score !== undefined) matchData.home_score = updates.home_score
    if (updates.away_score !== undefined) matchData.away_score = updates.away_score
    if (updates.result !== undefined) matchData.result = updates.result
    if (updates.season_year !== undefined) matchData.season_year = updates.season_year
    if (updates.notes !== undefined) matchData.notes = updates.notes
    if (updates.lineup_data !== undefined) matchData.lineup_data = updates.lineup_data
    if (updates.statistics_data !== undefined) matchData.statistics_data = updates.statistics_data
    if (updates.goals !== undefined) matchData.goals = updates.goals

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('matches')
      .update(matchData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating match:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userClient = createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('id')

    if (!matchId) {
      return NextResponse.json({ error: 'Missing match ID' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId)

    if (error) {
      console.error('[v0] Error deleting match:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: matchId })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
