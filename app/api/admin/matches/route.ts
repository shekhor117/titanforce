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
    const userClient = await createClient()
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
    const userClient = await createClient()

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
    const matchData: Record<string, any> = {
      home: body.home_team || body.home,
      away: body.away_team || body.away,
      date: body.match_date || body.date,
      time: body.match_time || body.time || '',
      venue: body.venue || '',
      status: body.status || 'upcoming',
      lineup_data: body.lineup_data || {},
      statistics_data: body.statistics_data || {},
      goals: body.goals || []
    }
    
    // Handle optional numeric fields
    if (body.home_score !== undefined && body.home_score !== null && !isNaN(Number(body.home_score))) {
      matchData.home_score = Number(body.home_score)
    }
    if (body.away_score !== undefined && body.away_score !== null && !isNaN(Number(body.away_score))) {
      matchData.away_score = Number(body.away_score)
    }
    if (body.attendance !== undefined && body.attendance !== null && !isNaN(Number(body.attendance))) {
      matchData.attendance = Number(body.attendance)
    }
    
    if (body.result !== undefined && body.result !== null) matchData.result = body.result
    if (body.season_year !== undefined && body.season_year !== null) matchData.season_year = body.season_year
    if (body.notes !== undefined && body.notes !== null) matchData.notes = body.notes

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
    const userClient = await createClient()

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
    if (updates.venue !== undefined && updates.venue !== null && updates.venue !== '') matchData.venue = updates.venue
    if (updates.status !== undefined && updates.status !== null) matchData.status = updates.status
    
    // Handle numeric fields - skip NaN values
    if (updates.home_score !== undefined && updates.home_score !== null && !isNaN(Number(updates.home_score))) {
      matchData.home_score = Number(updates.home_score)
    }
    if (updates.away_score !== undefined && updates.away_score !== null && !isNaN(Number(updates.away_score))) {
      matchData.away_score = Number(updates.away_score)
    }
    if (updates.attendance !== undefined && updates.attendance !== null && !isNaN(Number(updates.attendance))) {
      matchData.attendance = Number(updates.attendance)
    }
    
    if (updates.result !== undefined && updates.result !== null) matchData.result = updates.result
    if (updates.season_year !== undefined && updates.season_year !== null) matchData.season_year = updates.season_year
    if (updates.notes !== undefined && updates.notes !== null) matchData.notes = updates.notes
    if (updates.lineup_data !== undefined && updates.lineup_data !== null) matchData.lineup_data = updates.lineup_data
    if (updates.statistics_data !== undefined && updates.statistics_data !== null) matchData.statistics_data = updates.statistics_data
    if (updates.goals !== undefined && updates.goals !== null) matchData.goals = updates.goals
    
    // Always add updated_at timestamp
    matchData.updated_at = new Date().toISOString()

    console.log('[v0] Updating match', id, 'with data:', matchData)

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
    const userClient = await createClient()

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
