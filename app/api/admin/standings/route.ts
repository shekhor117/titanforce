import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { position, team_name, played, won, drawn, lost, goals_for, goals_against, points, is_highlighted } = body

    if (!position || !team_name) {
      return NextResponse.json(
        { error: 'Position and team_name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('standings')
      .insert({
        position,
        team_name,
        played: played || 0,
        won: won || 0,
        drawn: drawn || 0,
        lost: lost || 0,
        goals_for: goals_for || 0,
        goals_against: goals_against || 0,
        points: points || 0,
        is_highlighted: is_highlighted || false,
      })
      .select()

    if (error) {
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        console.debug('[v0] Standings table not yet created - migration needed')
        return NextResponse.json(
          { error: 'Standings table not yet created. Please run the database migration: supabase/migrations/20260702_create_matches_standings_tables.sql' },
          { status: 400 }
        )
      }
      console.error('[v0] Error creating standing:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data?.[0] || {}, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, position, team_name, played, won, drawn, lost, goals_for, goals_against, points, is_highlighted } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('standings')
      .update({
        position,
        team_name,
        played,
        won,
        drawn,
        lost,
        goals_for,
        goals_against,
        points,
        is_highlighted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        console.debug('[v0] Standings table not yet created - migration needed')
        return NextResponse.json(
          { error: 'Standings table not yet created. Please run the database migration: supabase/migrations/20260702_create_matches_standings_tables.sql' },
          { status: 400 }
        )
      }
      console.error('[v0] Error updating standing:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('standings')
      .delete()
      .eq('id', id)

    if (error) {
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        console.debug('[v0] Standings table not yet created - migration needed')
        return NextResponse.json(
          { error: 'Standings table not yet created. Please run the database migration: supabase/migrations/20260702_create_matches_standings_tables.sql' },
          { status: 400 }
        )
      }
      console.error('[v0] Error deleting standing:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
