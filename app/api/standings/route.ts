import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching standings:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('[v0] Standings API error:', message)

    // Return 503 for configuration errors
    if (message.includes('credentials') || message.includes('not configured')) {
      return NextResponse.json(
        { error: 'Database not configured', message: 'Supabase credentials missing' },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
