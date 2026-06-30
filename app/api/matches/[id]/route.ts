import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const matchId = params.id

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (error) {
      console.error('[v0] Error fetching match:', error)
      const statusCode = error.message?.includes('no rows') ? 404 : 400
      return NextResponse.json({ error: error.message }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
