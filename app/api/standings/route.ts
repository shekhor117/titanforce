import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('standings')
      .select('id, team_name, position, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, season_year')
      .order('position', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching standings:', error.message)
      return NextResponse.json({ error: 'Unable to fetch standings' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error in standings API:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Unable to fetch standings' }, { status: 500 })
  }
}
