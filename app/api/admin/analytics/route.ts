import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { validateAnalytics } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()

    const searchParams = request.nextUrl.searchParams
    const playerId = searchParams.get('playerId')
    const rawLimit = Number(searchParams.get('limit') || '10')
    const rawOffset = Number(searchParams.get('offset') || '0')
    if (!Number.isInteger(rawLimit) || rawLimit < 1 || rawLimit > 100 || !Number.isInteger(rawOffset) || rawOffset < 0) {
      return NextResponse.json({ error: 'Invalid pagination' }, { status: 400 })
    }
    const limit = rawLimit
    const offset = rawOffset

    if (playerId) {
      const { data, error } = await supabase
        .from('players')
        .select('*, analytics:analytics(*)')
        .eq('id', playerId)
        .single()

      if (error) {
        console.error('[v0] Error fetching analytics:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: statusCode === 404 ? 'Player analytics not found' : 'Unable to fetch analytics' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('players')
      .select('id, name, number, position')
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Error fetching analytics:', error)
      return NextResponse.json({ error: 'Unable to process analytics request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in analytics GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()

    const body = await request.json()
    const { playerId, ...analyticsData } = body

    if (!playerId) {
      return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    const validation = validateAnalytics(analyticsData)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('players')
      .update(analyticsData)
      .eq('id', playerId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating analytics:', error)
      return NextResponse.json({ error: 'Unable to process analytics request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in analytics PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
