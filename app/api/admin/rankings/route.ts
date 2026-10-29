import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { validatePartial, validateRanking } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const rankingId = searchParams.get('id')

    if (rankingId) {
      const { data, error } = await supabase
        .from('rankings')
        .select('id, player_id, category, rank, score, season_year, created_at, updated_at')
        .eq('id', rankingId)
        .single()

      if (error) {
        console.error('[v0] Error fetching ranking:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('rankings')
      .select('id, player_id, category, rank, score, season_year, created_at, updated_at')
      .order('rank', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching rankings:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/rankings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateRanking(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('rankings')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating ranking:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/rankings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing ranking ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateRanking)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('rankings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating ranking:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/rankings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const rankingId = searchParams.get('id')

    if (!rankingId) {
      return NextResponse.json({ error: 'Missing ranking ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('rankings')
      .delete()
      .eq('id', rankingId)

    if (error) {
      console.error('[v0] Error deleting ranking:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/rankings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
