import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateMotm } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const motmId = searchParams.get('id')

    if (motmId) {
      const { data, error } = await supabase
        .from('man_of_the_match')
        .select('id, match_id, player_id, votes, created_at, updated_at')
        .eq('id', motmId)
        .single()

      if (error) {
        console.error('[v0] Error fetching MOTM:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('man_of_the_match')
      .select('id, match_id, player_id, votes, created_at, updated_at')
      .order('matchDate', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching MOTM records:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/motm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateMotm(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('man_of_the_match')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating MOTM record:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/motm:', error)
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
      return NextResponse.json({ error: 'Missing MOTM ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateMotm)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('man_of_the_match')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating MOTM record:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/motm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const motmId = searchParams.get('id')

    if (!motmId) {
      return NextResponse.json({ error: 'Missing MOTM ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('man_of_the_match')
      .delete()
      .eq('id', motmId)

    if (error) {
      console.error('[v0] Error deleting MOTM record:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/motm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
