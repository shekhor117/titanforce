import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePlayer } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
// GET - Fetch all players or a specific player
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient()
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('id')

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    // Use admin client for database queries
    const supabase = createAdminClient()

    if (playerId) {
      // Fetch specific player
      const { data, error } = await supabase
        .from('players')
        .select('id, num, name, position, image_url, bio, created_at, updated_at')
        .eq('id', playerId)
        .single()

      if (error) {
        console.error('[v0] Error fetching player:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json({ ...data, number: data.num, photo_url: data.image_url, is_active: true })
    } else {
      // Fetch all players
      const { data, error } = await supabase
        .from('players')
        .select('id, num, name, position, image_url, bio, created_at, updated_at')
        .order('num', { ascending: true })

      if (error) {
        console.error('[v0] Error fetching players:', error)
        return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
      }

      return NextResponse.json((data || []).map((player) => ({ ...player, number: player.num, photo_url: player.image_url, is_active: true })))
    }
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST - Create a new player
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    // Validate player data
    const normalizedBody = { ...body, num: body.num ?? body.number, image_url: body.image_url ?? body.photo_url }
    const validation = validatePlayer(normalizedBody)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const writableFields = ['num', 'name', 'position', 'image_url', 'bio', 'nationality', 'date_of_birth'] as const
    const playerRecord = Object.fromEntries(writableFields.filter((field) => normalizedBody[field] !== undefined).map((field) => [field, normalizedBody[field]]))

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('players')
      .insert([playerRecord])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating player:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT - Update a player
export async function PUT(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id } = body
    const normalizedBody = { ...body, num: body.num ?? body.number, image_url: body.image_url ?? body.photo_url }
    const writableFields = ['num', 'name', 'position', 'image_url', 'bio', 'nationality', 'date_of_birth'] as const
    const updates = Object.fromEntries(writableFields.filter((field) => normalizedBody[field] !== undefined).map((field) => [field, normalizedBody[field]]))

    if (!id) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    // Validate player data (partial updates are OK)
    const validation = validatePlayer(updates, { partial: true })
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No writable fields provided' }, { status: 400 })
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating player:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE - Delete a player
export async function DELETE(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('id')

    if (!playerId) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('[v0] Error deleting player:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: playerId })
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}
