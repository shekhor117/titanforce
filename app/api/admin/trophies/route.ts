import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateTrophy } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
// GET - Fetch all trophies or by ID
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient()
    
    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const supabase = createAdminClient()

    const { searchParams } = new URL(request.url)
    const trophyId = searchParams.get('id')

    if (trophyId) {
      // Fetch specific trophy
      const { data, error } = await supabase
        .from('trophies')
        .select('id, title, description, year, image_url, created_at, updated_at')
        .eq('id', trophyId)
        .single()

      if (error) {
        console.error('[v0] Error fetching trophy:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process trophy request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      // Fetch all trophies
      const { data, error } = await supabase
        .from('trophies')
        .select('id, title, description, year, image_url, created_at, updated_at')
        .order('year', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching trophies:', error)
        return NextResponse.json({ error: 'Unable to process trophy request' }, { status: 400 })
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('[v0] Error in trophies GET:', error)
    return NextResponse.json(
      { error: 'Unable to fetch trophies' },
      { status: 500 }
    )
  }
}

// POST - Create a new trophy
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    // Validate trophy data
    const validation = validateTrophy(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('trophies')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating trophy:', error)
      return NextResponse.json({ error: 'Unable to process trophy request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in trophies POST:', error)
    return NextResponse.json(
      { error: 'Unable to create trophy' },
      { status: 500 }
    )
  }
}

// PUT - Update a trophy
export async function PUT(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const supabase = createAdminClient()

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing trophy ID' }, { status: 400 })
    }

    // Validate trophy data (partial updates are OK)
    const validation = validatePartial(updates, validateTrophy)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('trophies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating trophy:', error)
      const statusCode = error.message?.includes('no rows') ? 404 : 400
      return NextResponse.json({ error: 'Unable to process trophy request' }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error in trophies PUT:', error)
    return NextResponse.json(
      { error: 'Unable to update trophy' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a trophy
export async function DELETE(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const trophyId = searchParams.get('id')

    if (!trophyId) {
      return NextResponse.json({ error: 'Missing trophy ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('trophies')
      .delete()
      .eq('id', trophyId)

    if (error) {
      console.error('[v0] Error deleting trophy:', error)
      return NextResponse.json({ error: 'Unable to process trophy request' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error in trophies DELETE:', error)
    return NextResponse.json(
      { error: 'Failed to delete trophy' },
      { status: 500 }
    )
  }
}
