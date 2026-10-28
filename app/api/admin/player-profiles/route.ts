import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validatePlayerProfile } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('id')

    if (profileId) {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (error) {
        console.error('[v0] Error fetching player profile:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching player profiles:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/player-profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validatePlayerProfile(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('player_profiles')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating player profile:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/player-profiles:', error)
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
      return NextResponse.json({ error: 'Missing player profile ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validatePlayerProfile)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('player_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating player profile:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/player-profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('id')

    if (!profileId) {
      return NextResponse.json({ error: 'Missing player profile ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('player_profiles')
      .delete()
      .eq('id', profileId)

    if (error) {
      console.error('[v0] Error deleting player profile:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/player-profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
