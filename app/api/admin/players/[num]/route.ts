import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { num: string } }
) {
  try {
    // Check authentication
    const userClient = await createClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const playerNum = parseInt(params.num)

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

    // Update player in database
    const { data, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('num', playerNum)
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
        { error: 'Player not found' },
        { status: 404 }
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
