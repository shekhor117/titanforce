import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { num: string } }
) {
  try {
    const supabase = createAdminClient()
    const playerNum = parseInt(params.num)

    if (!playerNum) {
      return NextResponse.json(
        { error: 'Player number is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update player in database
    const { data, error } = await supabase
      .from('players')
      .update({
        full_name: body.full_name,
        name: body.name,
        position: body.position,
        age: body.age,
        hometown: body.hometown,
        bio: body.bio,
        goals: body.goals,
        assists: body.assists,
        appearances: body.appearances,
        minutes_played: body.minutes_played,
        pass_accuracy: body.pass_accuracy,
        chances_created: body.chances_created,
        yellow_cards: body.yellow_cards,
        red_cards: body.red_cards,
        pace: body.pace,
        shooting: body.shooting,
        passing: body.passing,
        dribbling: body.dribbling,
        defending: body.defending,
        physical: body.physical,
        foot: body.foot,
        status: body.status,
        image_url: body.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('num', playerNum)
      .select()

    if (error) {
      console.error('[v0] Error updating player:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update player' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Player updated successfully',
        data: data?.[0]
      },
      { status: 200 }
    )
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
