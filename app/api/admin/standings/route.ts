import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const body = await request.json()

    const { position, team_name, played, won, drawn, lost, goals_for, goals_against, points, is_highlighted } = body

    const numericValues = { position, played, won, drawn, lost, goals_for, goals_against, points }
    if (typeof team_name !== 'string' || !team_name.trim() || team_name.length > 120 || !Number.isInteger(position) || position < 1 || position > 100 || Object.values(numericValues).some((value) => value !== undefined && (!Number.isInteger(value) || value < 0 || value > 100000))) {
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
      console.error('[v0] Error creating standing:', error.message)
      return NextResponse.json({ error: 'Unable to create standing' }, { status: 400 })
    }

    return NextResponse.json(data?.[0] || {}, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Unable to process standings request' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const body = await request.json()
    const { id, position, team_name, played, won, drawn, lost, goals_for, goals_against, points, is_highlighted } = body

    const numericValues = { position, played, won, drawn, lost, goals_for, goals_against, points }
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) || (position !== undefined && (!Number.isInteger(position) || position < 1 || position > 100)) || Object.values(numericValues).some((value) => value !== undefined && (!Number.isInteger(value) || value < 0 || value > 100000))) {
      return NextResponse.json({ error: 'Invalid standing data' }, { status: 400 })
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
      console.error('[v0] Error updating standing:', error.message)
      return NextResponse.json({ error: 'Unable to update standing' }, { status: 400 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Unable to process standings request' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 })
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
      console.error('[v0] Error deleting standing:', error.message)
      return NextResponse.json({ error: 'Unable to delete standing' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Unable to process standings request' },
      { status: 500 }
    )
  }
}
