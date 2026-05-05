import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get a demo user ID (we'll use a hardcoded UUID or get from auth)
    const testPlayers = [
      {
        jersey: 1,
        position: 'GK',
        age: 28,
        foot: 'Right',
        address: 'Dhaka, Bangladesh',
        goals: 0,
        assists: 0,
        clean_sheets: 12,
      },
      {
        jersey: 4,
        position: 'CB',
        age: 26,
        foot: 'Right',
        address: 'Chittagong, Bangladesh',
        goals: 2,
        assists: 0,
        clean_sheets: 10,
      },
      {
        jersey: 7,
        position: 'CM',
        age: 24,
        foot: 'Right',
        address: 'Dhaka, Bangladesh',
        goals: 5,
        assists: 3,
        clean_sheets: 0,
      },
      {
        jersey: 9,
        position: 'ST',
        age: 25,
        foot: 'Right',
        address: 'Khulna, Bangladesh',
        goals: 15,
        assists: 4,
        clean_sheets: 0,
      },
      {
        jersey: 10,
        position: 'CAM',
        age: 23,
        foot: 'Left',
        address: 'Sylhet, Bangladesh',
        goals: 8,
        assists: 7,
        clean_sheets: 0,
      },
      {
        jersey: 11,
        position: 'LW',
        age: 22,
        foot: 'Left',
        address: 'Dhaka, Bangladesh',
        goals: 6,
        assists: 5,
        clean_sheets: 0,
      },
    ]

    // Get current user or create with service role
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Insert test players
    const { data, error } = await supabase
      .from('player_profiles')
      .insert(
        testPlayers.map((player) => ({
          ...player,
          user_id: user.id,
        }))
      )
      .select()

    if (error) {
      console.error('[v0] Insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('[v0] Test players created:', data?.length)
    return NextResponse.json({
      success: true,
      message: `Created ${data?.length || 0} test players`,
      data,
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
