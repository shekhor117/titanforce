import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validatePlayer } from '@/lib/validation'

// GET - Fetch all players or a specific player
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('id')

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (playerId) {
      // Fetch specific player
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single()

      if (error) {
        console.error('[v0] Error fetching player:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      // Fetch all players
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('num', { ascending: true })

      if (error) {
        console.error('[v0] Error fetching players:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new player
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate player data
    const validation = validatePlayer(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('players')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating player:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[v0] Player created:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a player
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    // Validate player data (partial updates are OK)
    const validation = validatePlayer(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating player:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[v0] Player updated:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a player
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('id')

    if (!playerId) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('[v0] Error deleting player:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[v0] Player deleted:', playerId)
    return NextResponse.json({ success: true, id: playerId })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
