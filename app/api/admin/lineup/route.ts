import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { pickWritableFields } from '@/lib/admin-write'
import { validatePartial, validateLineup } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const lineupId = searchParams.get('id')

    if (lineupId) {
      const { data, error } = await supabase
        .from('lineups')
        .select('id, match_id, player_id, position, is_starting, shirt_number, created_at, updated_at')
        .eq('id', lineupId)
        .single()

      if (error) {
        console.error('[v0] Error fetching lineup:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: statusCode === 404 ? 'Lineup not found' : 'Unable to fetch lineup' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('lineups')
      .select('id, match_id, player_id, position, is_starting, shirt_number, created_at, updated_at')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching lineups:', error)
      return NextResponse.json({ error: 'Unable to process lineup request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateLineup(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lineups')
      .insert([pickWritableFields(body, ['match_id', 'player_id', 'position', 'is_starting', 'shirt_number'])])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating lineup:', error)
      return NextResponse.json({ error: 'Unable to process lineup request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id } = body
    const updates = pickWritableFields(body, ['match_id', 'player_id', 'position', 'is_starting', 'shirt_number'])

    if (!id) {
      return NextResponse.json({ error: 'Missing lineup ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateLineup)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lineups')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating lineup:', error)
      return NextResponse.json({ error: 'Unable to process lineup request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const lineupId = searchParams.get('id')

    if (!lineupId) {
      return NextResponse.json({ error: 'Missing lineup ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('lineups')
      .delete()
      .eq('id', lineupId)

    if (error) {
      console.error('[v0] Error deleting lineup:', error)
      return NextResponse.json({ error: 'Unable to process lineup request' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
