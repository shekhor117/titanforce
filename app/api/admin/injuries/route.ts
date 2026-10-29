import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateInjury } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
// GET - Fetch all injuries or by ID
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient()
    
    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (injuryId) {
      const { data, error } = await supabase
        .from('injuries')
        .select('id, player_id, injury_type, description, status, start_date, expected_return, created_at, updated_at')
        .eq('id', injuryId)
        .single()

      if (error) {
        console.error('[v0] Error fetching injury:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('injuries')
      .select('id, player_id, injury_type, description, status, start_date, expected_return, created_at, updated_at')
      .order('injuryDate', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching injuries:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new injury
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateInjury(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('injuries')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating injury:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update injury
export async function PUT(request: NextRequest) {
  try {
    const userClient = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing injury ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateInjury)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('injuries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating injury:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove injury
export async function DELETE(request: NextRequest) {
  try {
    const userClient = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (!injuryId) {
      return NextResponse.json({ error: 'Missing injury ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('injuries')
      .delete()
      .eq('id', injuryId)

    if (error) {
      console.error('[v0] Error deleting injury:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
