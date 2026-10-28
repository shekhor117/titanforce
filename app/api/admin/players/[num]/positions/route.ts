import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const resolvedParams = await params
    const playerNum = parseInt(resolvedParams.num)

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id')
      .eq('num', playerNum)
      .single()

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    // Get positions
    const { data: positions, error } = await supabase
      .from('player_positions')
      .select('id, player_id, position, is_primary, created_at, updated_at')
      .eq('player_id', player.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const resolvedParams = await params
    const playerNum = parseInt(resolvedParams.num)
    const { position_name, x_coordinate, y_coordinate, is_primary, description } = await request.json()

    if (typeof position_name !== 'string' || position_name.trim().length === 0 || position_name.length > 80 || !Number.isFinite(Number(x_coordinate)) || !Number.isFinite(Number(y_coordinate)) || Number(x_coordinate) < 0 || Number(x_coordinate) > 100 || Number(y_coordinate) < 0 || Number(y_coordinate) > 100) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id')
      .eq('num', playerNum)
      .single()

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    // If this is primary, unset other primary positions
    if (is_primary) {
      await supabase
        .from('player_positions')
        .update({ is_primary: false })
        .eq('player_id', player.id)
    }

    // Insert new position
    const { data, error } = await supabase
      .from('player_positions')
      .insert({
        player_id: player.id,
        position_name,
        x_coordinate: parseFloat(x_coordinate),
        y_coordinate: parseFloat(y_coordinate),
        is_primary: is_primary || false,
        description,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ position: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating position:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    await params
    const { positionId, position_name, x_coordinate, y_coordinate, is_primary, description } = await request.json()

    if (typeof positionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(positionId)) {
      return NextResponse.json({ error: 'Valid position ID required' }, { status: 400 })
    }

    // Get the position to find player_id
    const { data: position, error: positionError } = await supabase
      .from('player_positions')
      .select('player_id')
      .eq('id', positionId)
      .single()

    if (positionError || !position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    // If setting as primary, unset other primary positions
    if (is_primary) {
      await supabase
        .from('player_positions')
        .update({ is_primary: false })
        .eq('player_id', position.player_id)
    }

    // Update position
    const { data, error } = await supabase
      .from('player_positions')
      .update({
        position_name,
        x_coordinate: x_coordinate !== undefined ? parseFloat(x_coordinate) : undefined,
        y_coordinate: y_coordinate !== undefined ? parseFloat(y_coordinate) : undefined,
        is_primary,
        description,
      })
      .eq('id', positionId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ position: data })
  } catch (error) {
    console.error('Error updating position:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    await params
    const { positionId } = await request.json()

    if (typeof positionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(positionId)) {
      return NextResponse.json({ error: 'Valid position ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('player_positions')
      .delete()
      .eq('id', positionId)

    if (error) {
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting position:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
