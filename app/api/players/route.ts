import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('player_profiles')
      .select(
        `
        id,
        user_id,
        phone,
        age,
        position,
        jersey,
        height,
        weight,
        foot,
        address,
        experience,
        photo_url,
        created_at,
        updated_at,
        profiles:user_id(id, email)
      `
      )
      .order('jersey', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
