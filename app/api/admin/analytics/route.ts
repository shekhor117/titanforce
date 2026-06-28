import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateAnalytics } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const playerId = searchParams.get('playerId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (playerId) {
      const { data, error } = await supabase
        .from('players')
        .select('*, analytics:analytics(*)')
        .eq('id', playerId)
        .single()

      if (error) {
        console.error('[v0] Error fetching analytics:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('players')
      .select('id, name, number, position')
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Error fetching analytics:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in analytics GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { playerId, ...analyticsData } = body

    if (!playerId) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    const validation = validateAnalytics(analyticsData)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('players')
      .update(analyticsData)
      .eq('id', playerId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating analytics:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in analytics PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
