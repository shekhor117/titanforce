import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    // Check authentication
    const userClient = await createClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const resolvedParams = await params
    const playerNum = parseInt(resolvedParams.num)

    if (!playerNum || isNaN(playerNum)) {
      return NextResponse.json(
        { error: 'Player number is required and must be valid' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Build update object with only defined fields, filtering out NaN values
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    // List of allowed fields to update
    const allowedFields = [
      'full_name', 'name', 'position', 'age', 'hometown', 'bio',
      'goals', 'assists', 'appearances', 'minutes_played', 'pass_accuracy',
      'chances_created', 'yellow_cards', 'red_cards', 'pace', 'shooting',
      'passing', 'dribbling', 'defending', 'physical', 'foot', 'status',
      'image_url', 'club', 'nationality', 'date_of_birth', 'join_date'
    ]

    // Only include fields that are present and valid in the request
    for (const field of allowedFields) {
      if (field in body) {
        const value = body[field]
        // Skip NaN or undefined values
        if (value !== undefined && (typeof value !== 'number' || !isNaN(value))) {
          updateData[field] = value
        }
      }
    }

    console.log('[v0] Updating player', playerNum, 'with data:', updateData)

    // First, find the player by jersey number (num) to get their ID
    const { data: foundPlayers, error: findError } = await supabase
      .from('players')
      .select('id, num')
      .eq('num', playerNum)
      .limit(1)

    console.log('[v0] Finding player with num:', playerNum)
    console.log('[v0] Find error:', findError)
    console.log('[v0] Found players:', foundPlayers)

    if (findError) {
      console.error('[v0] Error finding player:', findError.message)
      return NextResponse.json(
        { error: `Database error: ${findError.message}` },
        { status: 400 }
      )
    }

    if (!foundPlayers || foundPlayers.length === 0) {
      console.warn('[v0] No player found with num:', playerNum)
      return NextResponse.json(
        { error: `No player found with jersey number ${playerNum}` },
        { status: 404 }
      )
    }

    const playerId = foundPlayers[0].id

    // Update player in database by ID
    const { data, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', playerId)
      .select()

    if (error) {
      console.error('[v0] Error updating player:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update player' },
        { status: 400 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update player' },
        { status: 500 }
      )
    }

    console.log('[v0] Player updated successfully:', data[0])
    return NextResponse.json(data[0], { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const userClient = await createClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const resolvedParams = await params
    const jerseyNum = parseInt(resolvedParams.num)

    if (isNaN(jerseyNum)) {
      return NextResponse.json({ error: 'Invalid jersey number' }, { status: 400 })
    }

    const { data: foundPlayers, error: findError } = await supabase
      .from('players')
      .select('id')
      .eq('num', jerseyNum)
      .limit(1)

    if (findError || !foundPlayers || foundPlayers.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    const playerId = foundPlayers[0].id

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('[v0] Error deleting player:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
