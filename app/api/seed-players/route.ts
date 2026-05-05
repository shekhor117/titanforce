import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Complete squad of 10 players
    const squadPlayers = [
      {
        jersey: 1,
        position: 'GK',
        age: 17,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 3,
        position: 'CB / RB',
        age: 21,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 4,
        position: 'CB / LB',
        age: 17,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 5,
        position: 'CB / CDM',
        age: 19,
        foot: 'Both',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 6,
        position: 'CAM',
        age: 20,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 7,
        position: 'LW / RW / CAM',
        age: 19,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 8,
        position: 'CM / CAM',
        age: 20,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 9,
        position: 'ST / CF',
        age: 17,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 11,
        position: 'LW / ST',
        age: 18,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
      {
        jersey: 17,
        position: 'CB / CM / CDM',
        age: 20,
        foot: 'Right',
        address: 'Mulikandi, Sylhet',
        goals: 0,
        assists: 0,
        clean_sheets: 0,
      },
    ]

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Insert squad players
    const { data, error } = await supabase
      .from('player_profiles')
      .insert(
        squadPlayers.map((player) => ({
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

    console.log('[v0] Squad players created:', data?.length)
    return NextResponse.json({
      success: true,
      message: `Successfully added ${data?.length || 0} players to your squad`,
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
